# app.py - BrainHR IT Solutions Backend (FULLY IMPLEMENTED)
import os
import sys
import logging
import sqlite3
import zipfile
import tempfile
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime, timedelta
from functools import wraps
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify, session, send_file, make_response
from flask_cors import CORS
import pandas as pd
from dotenv import load_dotenv

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Flask app + config
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'a-very-secret-key-that-should-be-in-env')

# --- CORS Configuration ---
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
    "supports_credentials": True
}})

# --- Session Configuration ---
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=False,
    SESSION_COOKIE_HTTPONLY=True,
    PERMANENT_SESSION_LIFETIME=timedelta(days=1)
)

# Admin credentials
ADMIN_USERNAME = "BHRadmin"
ADMIN_PASSWORD_HASH = generate_password_hash("BHR@6789$")

# File Upload config
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB

# Database file name
DB_FILE = 'brainhr.db'

def init_db():
    """Initialize the SQLite database."""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
                contact_no TEXT, linkedin TEXT, location TEXT, visa_status TEXT,
                relocation TEXT, experience_years REAL, job_id INTEGER, job_title TEXT,
                resume_filename TEXT, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                viewed INTEGER DEFAULT 0
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, location TEXT NOT NULL,
                description TEXT NOT NULL, visa_constraints TEXT, active INTEGER DEFAULT 1,
                assessment_url TEXT, job_category TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, category TEXT NOT NULL,
                description TEXT, thumbnail_url TEXT, video_url TEXT, key_skills TEXT,
                programming_languages TEXT, course_duration TEXT, total_sessions TEXT,
                session_duration TEXT, level TEXT, target_audience TEXT, mode TEXT,
                course_contents TEXT, what_you_will_learn TEXT, archived INTEGER DEFAULT 0, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS course_enrollments (
                id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
                contact_no TEXT NOT NULL, course_id INTEGER NOT NULL, course_title TEXT,
                enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (course_id) REFERENCES courses(id)
            )
        ''')
        
        try:
            cursor.execute('ALTER TABLE courses ADD COLUMN archived INTEGER DEFAULT 0')
        except sqlite3.OperationalError:
            pass
        
        try:
            cursor.execute('ALTER TABLE jobs ADD COLUMN assessment_url TEXT')
        except sqlite3.OperationalError:
            pass
        
        try:
            cursor.execute('ALTER TABLE jobs ADD COLUMN job_category TEXT')
        except sqlite3.OperationalError:
            pass
        
        conn.commit()

init_db()

# ---------- Helpers ----------
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session:
            logger.warning("Authentication required for a protected route.")
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf', 'doc', 'docx'}

def send_application_email(application_data, resume_path):
    """Sends email notification for a new application."""
    try:
        smtp_server = os.getenv('SMTP_SERVER')
        smtp_port = int(os.getenv('SMTP_PORT', 587))
        smtp_user = os.getenv('SMTP_USER')
        smtp_password = os.getenv('SMTP_PASSWORD')
        recipient_email = os.getenv('HR_EMAIL', 'hr@brainhritsolutions.com')

        if not all([smtp_server, smtp_user, smtp_password]):
            logger.warning("SMTP settings not configured. Skipping email notification.")
            return

        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = recipient_email
        msg['Subject'] = f"New Application: {application_data['name']} for {application_data['job_title']}"

        body = "A new job application has been received.\n\n"
        for key, value in application_data.items():
            body += f"{key.replace('_', ' ').title()}: {value}\n"
        msg.attach(MIMEText(body, 'plain'))

        if resume_path and os.path.exists(resume_path):
            with open(resume_path, "rb") as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f"attachment; filename= {os.path.basename(resume_path)}")
            msg.attach(part)

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        logger.info(f"Application email sent successfully to {recipient_email}")

    except Exception as e:
        logger.error(f"Failed to send application email: {e}")


# ---------- Root & Health ----------
@app.route('/')
def root():
    return jsonify(message="BrainHR Backend is running.")

@app.route('/health')
def health():
    return jsonify(status="healthy")

@app.route('/uploads/<filename>')
def download_file(filename):
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(filename))
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=False)
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        logger.error(f"Error serving file: {e}")
        return jsonify({'error': 'File not found'}), 404

# ---------- Auth ----------
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    username = data.get('username')
    password = data.get('password')

    if username == ADMIN_USERNAME and check_password_hash(ADMIN_PASSWORD_HASH, password):
        session['admin_logged_in'] = True
        logger.info("Admin login successful.")
        return jsonify({'success': True})
    
    logger.warning("Invalid admin login attempt.")
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/admin/logout', methods=['POST'])
@login_required
def admin_logout():
    session.pop('admin_logged_in', None)
    logger.info("Admin logout successful.")
    return jsonify({'success': True})

@app.route('/api/admin/check', methods=['GET'])
def admin_check():
    is_logged_in = 'admin_logged_in' in session
    return jsonify({'logged_in': is_logged_in})

# ---------- Public Jobs ----------
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    with sqlite3.connect(DB_FILE) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM jobs WHERE active = 1 ORDER BY created_at DESC')
        jobs = [dict(row) for row in cursor.fetchall()]
    return jsonify(jobs)

# ---------- Apply (public) ----------
@app.route('/api/apply', methods=['POST'])
def apply_job():
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'Resume file is required'}), 400

        file = request.files['resume']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Please upload PDF, DOC, or DOCX.'}), 400

        form_data = request.form.to_dict()
        required_fields = ['name', 'email', 'contact_no', 'job_id', 'job_title', 'location', 'visa_status', 'relocation']
        missing_fields = [field for field in required_fields if not form_data.get(field)]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        filename = secure_filename(f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}")
        resume_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(resume_path)

        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO applications (name, email, contact_no, linkedin, location, visa_status, relocation, 
                                         experience_years, job_id, job_title, resume_filename)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                form_data.get('name'), form_data.get('email'), form_data.get('contact_no'),
                form_data.get('linkedin'), form_data.get('location'), form_data.get('visa_status'),
                form_data.get('relocation'), form_data.get('experience_years'),
                form_data.get('job_id'), form_data.get('job_title'), filename
            ))
            conn.commit()
        
        # Send email notification
        send_application_email(form_data, resume_path)

        return jsonify({'success': True, 'message': 'Application submitted successfully'})

    except Exception as e:
        logger.error(f"Apply error: {e}")
        return jsonify({'error': str(e)}), 500

# ---------- Admin Dashboard ----------
@app.route('/api/admin/stats', methods=['GET'])
@login_required
def get_stats():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM applications')
        total_applications = cursor.fetchone()[0]
        cursor.execute('SELECT COUNT(*) FROM applications WHERE viewed = 0')
        unviewed_applications = cursor.fetchone()[0]
        cursor.execute('SELECT COUNT(*) FROM jobs WHERE active = 1')
        active_jobs = cursor.fetchone()[0]
    return jsonify({
        'total_applications': total_applications,
        'unviewed_applications': unviewed_applications,
        'active_jobs': active_jobs
    })

# ---------- Admin Jobs ----------
@app.route('/api/admin/jobs', methods=['GET'])
@login_required
def get_all_jobs():
    with sqlite3.connect(DB_FILE) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('''
            SELECT j.*, COUNT(a.id) as application_count
            FROM jobs j
            LEFT JOIN applications a ON j.id = a.job_id
            GROUP BY j.id
            ORDER BY j.created_at DESC
        ''')
        jobs = [dict(row) for row in cursor.fetchall()]
    return jsonify(jobs)

@app.route('/api/admin/jobs', methods=['POST'])
@login_required
def create_job():
    data = request.get_json()
    if not data or not all(k in data for k in ['title', 'location', 'description']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO jobs (title, location, description, visa_constraints, assessment_url, job_category) VALUES (?, ?, ?, ?, ?, ?)',
            (data['title'], data['location'], data['description'], data.get('visa_constraints', ''), data.get('assessment_url', ''), data.get('job_category', ''))
        )
        conn.commit()
        job_id = cursor.lastrowid
    return jsonify({'success': True, 'job_id': job_id}), 201

@app.route('/api/admin/jobs/<int:job_id>', methods=['DELETE'])
@login_required
def delete_job(job_id):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE jobs SET active = 0 WHERE id = ?', (job_id,))
        conn.commit()
    return jsonify({'success': True, 'message': 'Job deactivated.'})

@app.route('/api/admin/jobs/delete', methods=['POST'])
@login_required
def delete_jobs_bulk():
    data = request.get_json()
    job_ids = data.get('job_ids', [])
    if not job_ids:
        return jsonify({'error': 'No job IDs provided'}), 400
    
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute(f"UPDATE jobs SET active = 0 WHERE id IN ({','.join('?' for _ in job_ids)})", job_ids)
        conn.commit()
    return jsonify({'success': True, 'message': f'{len(job_ids)} jobs deactivated.'})

@app.route('/api/admin/applications/<int:app_id>', methods=['DELETE'])
@login_required
def delete_application(app_id):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM applications WHERE id = ?', (app_id,))
        conn.commit()
    return jsonify({'success': True, 'message': 'Application deleted.'})

@app.route('/api/admin/applications/delete', methods=['POST'])
@login_required
def delete_applications_bulk():
    data = request.get_json()
    app_ids = data.get('application_ids', [])
    if not app_ids:
        return jsonify({'error': 'No application IDs provided'}), 400
    
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute(f"DELETE FROM applications WHERE id IN ({','.join('?' for _ in app_ids)})", app_ids)
        conn.commit()
    return jsonify({'success': True, 'message': f'{len(app_ids)} applications deleted.'})

# ---------- Admin Applications ----------
@app.route('/api/admin/applications', methods=['GET'])
@login_required
def get_applications():
    job_id_filter = request.args.get('job_id')
    query = 'SELECT * FROM applications'
    params = []
    if job_id_filter and job_id_filter != 'all':
        query += ' WHERE job_id = ?'
        params.append(job_id_filter)
    query += ' ORDER BY applied_at DESC'

    with sqlite3.connect(DB_FILE) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(query, params)
        applications = [dict(row) for row in cursor.fetchall()]
    return jsonify(applications)

@app.route('/api/admin/applications/<int:app_id>/view', methods=['POST'])
@login_required
def mark_application_viewed(app_id):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE applications SET viewed = 1 WHERE id = ?', (app_id,))
        conn.commit()
    return jsonify({'success': True})

# ---------- File & Data Export ----------
@app.route('/api/admin/download/resume/<path:filename>')
@login_required
def download_resume(filename):
    try:
        # Mark as viewed when downloaded
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute('UPDATE applications SET viewed = 1 WHERE resume_filename = ?', (filename,))
            conn.commit()
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if not os.path.exists(file_path):
            return jsonify({'error': 'Resume file not found'}), 404
        return send_file(file_path, as_attachment=True)
    except FileNotFoundError:
        return jsonify({'error': 'Resume file not found'}), 404
        return jsonify({'error': 'File not found'}), 404

@app.route('/api/admin/download/resumes', methods=['POST'])
@login_required
def download_multiple_resumes():
    app_ids = request.get_json().get('application_ids', [])
    if not app_ids:
        return jsonify({'error': 'No applications selected'}), 400

    with sqlite3.connect(DB_FILE) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(f"SELECT name, resume_filename FROM applications WHERE id IN ({','.join('?' for _ in app_ids)})", app_ids)
        apps = cursor.fetchall()
        # Mark as viewed
        cursor.execute(f"UPDATE applications SET viewed = 1 WHERE id IN ({','.join('?' for _ in app_ids)})", app_ids)
        conn.commit()

    memory_file = tempfile.SpooledTemporaryFile()
    with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zf:
        for app_data in apps:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], app_data['resume_filename'])
            if os.path.exists(file_path):
                zip_filename = f"{app_data['name'].replace(' ', '_')}_{app_data['resume_filename']}"
                zf.write(file_path, zip_filename)
    memory_file.seek(0)
    
    response = make_response(send_file(memory_file, mimetype='application/zip', as_attachment=True, download_name='resumes.zip'))
    response.headers['Content-Disposition'] = 'attachment; filename=selected_resumes.zip'
    return response

@app.route('/api/admin/export/excel', methods=['POST'])
@login_required
def export_applications_excel():
    app_ids = request.get_json().get('application_ids', [])
    
    query = '''
        SELECT name, email, contact_no, linkedin, location, visa_status, 
               relocation, experience_years, job_title, applied_at
        FROM applications
    '''
    params = []
    if app_ids:
        query += f" WHERE id IN ({','.join('?' for _ in app_ids)})"
        params.extend(app_ids)
    query += ' ORDER BY applied_at DESC'

    with sqlite3.connect(DB_FILE) as conn:
        df = pd.read_sql_query(query, conn, params=params)
        
        # Create a temporary file to save the Excel
        with tempfile.NamedTemporaryFile(suffix='.xlsx', delete=False) as tmp:
            df.to_excel(tmp.name, index=False)
            tmp_path = tmp.name
            
        try:
            return send_file(
                tmp_path,
                as_attachment=True,
                download_name='applications.xlsx',
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
        finally:
            # Clean up the temp file
            try:
                os.unlink(tmp_path)
            except:
                pass

    output = tempfile.SpooledTemporaryFile()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    df.to_excel(writer, index=False, sheet_name='Applications')
    writer.close()
    output.seek(0)

    response = make_response(send_file(output, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
    response.headers['Content-Disposition'] = 'attachment; filename=applications.xlsx'
    return response

# ---------- Courses API ----------
@app.route('/api/admin/courses', methods=['GET'])
@login_required
def get_courses():
    category = request.args.get('category')
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        if category:
            cursor.execute('SELECT * FROM courses WHERE category = ? AND archived = 0 ORDER BY created_at DESC', (category,))
        else:
            cursor.execute('SELECT * FROM courses WHERE archived = 0 ORDER BY created_at DESC')
        courses = cursor.fetchall()
    courses_list = []
    for c in courses:
        courses_list.append({
            'id': c[0], 'title': c[1], 'category': c[2], 'description': c[3],
            'thumbnail_url': c[4], 'video_url': c[5], 'key_skills': c[6],
            'programming_languages': c[7], 'course_duration': c[8], 'total_sessions': c[9],
            'session_duration': c[10], 'level': c[11], 'target_audience': c[12],
            'mode': c[13], 'course_contents': c[14], 'what_you_will_learn': c[15]
        })
    return jsonify(courses_list)

@app.route('/api/admin/courses', methods=['POST'])
@login_required
def create_course():
    # Handle both JSON and FormData uploads
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
    
    if not data or not all(k in data for k in ['title', 'category']):
        return jsonify({'error': 'Missing required fields: title and category'}), 400
    
    # Handle file upload
    thumbnail_url = data.get('thumbnail_url', '')
    if 'thumbnail' in request.files:
        file = request.files['thumbnail']
        if file and file.filename:
            filename = secure_filename(f"{datetime.now().timestamp()}_{file.filename}")
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            thumbnail_url = f"/uploads/{filename}"
    
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute(
            '''INSERT INTO courses (title, category, description, thumbnail_url, video_url, key_skills, 
               programming_languages, course_duration, total_sessions, session_duration, level, 
               target_audience, mode, course_contents, what_you_will_learn) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (data['title'], data['category'], data.get('description', ''), thumbnail_url, 
             data.get('video_url', ''), data.get('key_skills', ''), data.get('programming_languages', ''),
             data.get('course_duration', ''), data.get('total_sessions', ''), data.get('session_duration', ''),
             data.get('level', 'Beginner'), data.get('target_audience', ''), data.get('mode', 'Virtual'),
             data.get('course_contents', ''), data.get('what_you_will_learn', ''))
        )
        conn.commit()
        course_id = cursor.lastrowid
    return jsonify({'success': True, 'course_id': course_id}), 201

@app.route('/api/admin/courses/<int:course_id>', methods=['PUT'])
@login_required
def update_course(course_id):
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
    
    if not data or not all(k in data for k in ['title', 'category']):
        return jsonify({'error': 'Missing required fields: title and category'}), 400
    
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT thumbnail_url FROM courses WHERE id = ?', (course_id,))
        result = cursor.fetchone()
        if not result:
            return jsonify({'error': 'Course not found'}), 404
        
        thumbnail_url = result[0]
        
        if 'thumbnail' in request.files:
            file = request.files['thumbnail']
            if file and file.filename:
                filename = secure_filename(f"{datetime.now().timestamp()}_{file.filename}")
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                thumbnail_url = f"/uploads/{filename}"
        elif 'thumbnail_url' in data and data['thumbnail_url']:
            thumbnail_url = data['thumbnail_url']
        
        cursor.execute(
            '''UPDATE courses SET title=?, category=?, description=?, thumbnail_url=?, video_url=?, 
               key_skills=?, programming_languages=?, course_duration=?, total_sessions=?, 
               session_duration=?, level=?, target_audience=?, mode=?, course_contents=?, 
               what_you_will_learn=? WHERE id=?''',
            (data['title'], data['category'], data.get('description', ''), thumbnail_url,
             data.get('video_url', ''), data.get('key_skills', ''), data.get('programming_languages', ''),
             data.get('course_duration', ''), data.get('total_sessions', ''), data.get('session_duration', ''),
             data.get('level', 'Beginner'), data.get('target_audience', ''), data.get('mode', 'Virtual'),
             data.get('course_contents', ''), data.get('what_you_will_learn', ''), course_id)
        )
        conn.commit()
    
    return jsonify({'success': True, 'message': 'Course updated.', 'course_id': course_id})

@app.route('/api/admin/courses/<int:course_id>/archive', methods=['POST'])
@login_required
def archive_course(course_id):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE courses SET archived = 1 WHERE id = ?', (course_id,))
        conn.commit()
    return jsonify({'success': True, 'message': 'Course archived.'})

@app.route('/api/admin/courses/<int:course_id>', methods=['DELETE'])
@login_required
def delete_course(course_id):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM courses WHERE id = ?', (course_id,))
        conn.commit()
    return jsonify({'success': True, 'message': 'Course deleted.'})

@app.route('/api/public/courses', methods=['GET'])
def get_public_courses():
    category = request.args.get('category')
    search = request.args.get('search', '').lower()
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        if category:
            cursor.execute('SELECT * FROM courses WHERE category = ? ORDER BY created_at DESC', (category,))
        else:
            cursor.execute('SELECT * FROM courses ORDER BY created_at DESC')
        courses = cursor.fetchall()
    
    result = []
    for c in courses:
        result.append({
            'id': c[0], 'title': c[1], 'category': c[2], 'description': c[3],
            'thumbnail_url': c[4], 'video_url': c[5], 'key_skills': c[6],
            'programming_languages': c[7], 'course_duration': c[8], 'total_sessions': c[9],
            'session_duration': c[10], 'level': c[11], 'target_audience': c[12],
            'mode': c[13], 'course_contents': c[14], 'what_you_will_learn': c[15]
        })
    result_final = result
    
    if search:
        result_final = [c for c in result_final if search in c['title'].lower() or search in c.get('description', '').lower()]
    
    return jsonify(result_final)

# ---------- Course Enrollments API ----------
@app.route('/api/enroll', methods=['POST'])
def enroll_course():
    try:
        form_data = request.form.to_dict()
        required_fields = ['name', 'email', 'contact_no', 'course_id', 'course_title']
        if not all(field in form_data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO course_enrollments (name, email, contact_no, course_id, course_title)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                form_data.get('name'), form_data.get('email'), form_data.get('contact_no'),
                form_data.get('course_id'), form_data.get('course_title')
            ))
            conn.commit()
        
        return jsonify({'success': True, 'message': 'Enrollment submitted successfully'})

    except Exception as e:
        logger.error(f"Enrollment error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/enrollments/<int:course_id>', methods=['GET'])
@login_required
def get_course_enrollments(course_id):
    try:
        with sqlite3.connect(DB_FILE) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM course_enrollments 
                WHERE course_id = ? 
                ORDER BY enrolled_at DESC
            ''', (course_id,))
            enrollments = [dict(row) for row in cursor.fetchall()]
        return jsonify(enrollments)
    except Exception as e:
        logger.error(f"Get enrollments error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/enrollments/export/excel', methods=['POST'])
@login_required
def export_enrollments_excel():
    try:
        data = request.get_json() or {}
        course_id = data.get('course_id')
        enrollment_ids = data.get('enrollment_ids', [])
        
        with sqlite3.connect(DB_FILE) as conn:
            if enrollment_ids:
                placeholders = ','.join('?' * len(enrollment_ids))
                query = f'SELECT * FROM course_enrollments WHERE id IN ({placeholders})'
                cursor = conn.cursor()
                cursor.execute(query, enrollment_ids)
            else:
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM course_enrollments WHERE course_id = ?', (course_id,))
            
            rows = cursor.fetchall()
            columns = [description[0] for description in cursor.description]
        
        df = pd.DataFrame(rows, columns=columns)
        output = pd.ExcelWriter('temp_enrollments.xlsx', engine='openpyxl')
        df.to_excel(output, sheet_name='Enrollments', index=False)
        output.close()
        
        response = make_response(send_file('temp_enrollments.xlsx', mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
        response.headers['Content-Disposition'] = 'attachment; filename=enrollments.xlsx'
        return response
    except Exception as e:
        logger.error(f"Export enrollments error: {e}")
        return jsonify({'error': str(e)}), 500

# ---------- Error Handlers ----------
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not Found', 'path': request.path}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"500 Internal Server Error: {error}")
    return jsonify({'error': 'Internal Server Error'}), 500

# ---------- Run ----------
if __name__ == '__main__':
    logger.info("Starting Flask server on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
