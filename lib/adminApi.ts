// lib/adminApi.ts - Admin API client for BrainHR backend
// If you want to override the backend base URL, set:
//   NEXT_PUBLIC_API_BASE (preferred) or NEXT_PUBLIC_API_URL
// Fallback: http://localhost:5000
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export interface JobApplication {
  id: number;
  name: string;
  email: string;
  contact_no: string;
  linkedin: string;
  location: string;
  visa_status: string;
  relocation: string;
  experience_years: number;
  job_id: number;
  job_title: string;
  resume_filename: string;
  applied_at: string;
  viewed: number;
}

export interface Job {
  id: number;
  title: string;
  location: string;
  description: string;
  visa_constraints: string;
  assessment_url?: string;
  job_category?: string;
  active: number;
  created_at: string;
}

export interface Course {
  id: number;
  title: string;
  category: string;
  description?: string;
  thumbnail_url?: string;
  video_url?: string;
  key_skills?: string;
  programming_languages?: string;
  course_duration?: string;
  total_sessions?: string;
  session_duration?: string;
  level?: string;
  target_audience?: string;
  mode?: string;
  course_contents?: string;
  what_you_will_learn?: string;
  created_at: string;
}

export interface AdminStats {
  total_applications: number;
  unviewed_applications: number;
  job_stats: Array<{
    job_title: string;
    count: number;
    unviewed: number;
  }>;
}

class AdminApi {
  private async fetchWithCredentials(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Request failed';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(username: string, password: string) {
    return this.fetchWithCredentials('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout() {
    return this.fetchWithCredentials('/api/admin/logout', {
      method: 'POST',
    });
  }

  async checkAuth() {
    return this.fetchWithCredentials('/api/admin/check');
  }

  async getJobs(): Promise<Job[]> {
    return this.fetchWithCredentials('/api/admin/jobs');
  }

  async createJob(jobData: {
    title: string;
    location: string;
    description: string;
    visa_constraints?: string;
    assessment_url?: string;
    job_category?: string;
  }) {
    return this.fetchWithCredentials('/api/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async getCourses(category?: string): Promise<Course[]> {
    const url = category ? `/api/admin/courses?category=${category}` : '/api/admin/courses';
    return this.fetchWithCredentials(url);
  }

  async createCourse(courseData: {
    title: string;
    category: string;
    description?: string;
    thumbnail_url?: string;
    video_url?: string;
    key_skills?: string;
    programming_languages?: string;
  }) {
    return this.fetchWithCredentials('/api/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async createCourseWithFile(formData: FormData) {
    const response = await fetch(`${API_BASE}/api/admin/courses`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to create course';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  async updateCourseWithFile(courseId: number, formData: FormData) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/courses/${courseId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to update course (${response.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return response.json();
      }
      return response.text();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update course');
    }
  }

  async archiveCourse(courseId: number) {
    return this.fetchWithCredentials(`/api/admin/courses/${courseId}/archive`, {
      method: 'POST',
    });
  }

  async deleteCourse(courseId: number) {
    return this.fetchWithCredentials(`/api/admin/courses/${courseId}`, {
      method: 'DELETE',
    });
  }

  async deleteJob(jobId: number) {
    return this.fetchWithCredentials(`/api/admin/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  async deleteApplication(applicationId: number) {
    return this.fetchWithCredentials(`/api/admin/applications/${applicationId}`, {
      method: 'DELETE',
    });
  }

  async deleteApplicationsBulk(applicationIds: number[]) {
    return this.fetchWithCredentials('/api/admin/applications/delete', {
      method: 'POST',
      body: JSON.stringify({ application_ids: applicationIds }),
    });
  }

  async getApplications(jobId?: number): Promise<JobApplication[]> {
    const url = jobId ? `/api/admin/applications?job_id=${jobId}` : '/api/admin/applications';
    return this.fetchWithCredentials(url);
  }

  async markApplicationViewed(applicationId: number) {
    return this.fetchWithCredentials(`/api/admin/applications/${applicationId}/view`, {
      method: 'POST',
    });
  }

  async downloadResume(filename: string) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/download/resume/${filename}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw new Error('Failed to download file');
    }
  }

  async downloadMultipleResumes(applicationIds: number[]) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/download/resumes`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application_ids: applicationIds }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'selected_resumes.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw new Error('Failed to download resumes');
    }
  }

  async exportToExcel(applicationIds?: number[]) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/export/excel`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application_ids: applicationIds || [] }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'applications.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw new Error('Failed to export Excel file');
    }
  }

  async getStats(): Promise<AdminStats> {
    return this.fetchWithCredentials('/api/admin/stats');
  }

  async getCourseEnrollments(courseId: number) {
    return this.fetchWithCredentials(`/api/admin/enrollments/${courseId}`);
  }

  async exportEnrollmentsToExcel(courseId: number, enrollmentIds?: number[]) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/enrollments/export/excel`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course_id: courseId, enrollment_ids: enrollmentIds || [] }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'enrollments.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw new Error('Failed to export Excel file');
    }
  }
}

export const adminApi = new AdminApi();

// Public API for job applications
export class PublicApi {
  async getJobs(): Promise<Job[]> {
    try {
      const response = await fetch(`${API_BASE}/api/jobs`);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new Error('Failed to load jobs');
    }
  }

  async getCourses(category?: string, search?: string): Promise<Course[]> {
    try {
      let url = `${API_BASE}/api/public/courses`;
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to load courses');
    }
  }

  async submitApplication(formData: FormData) {
    try {
      const response = await fetch(`${API_BASE}/api/apply`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Application failed';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to submit application');
    }
  }

  async enrollCourse(formData: FormData) {
    try {
      const response = await fetch(`${API_BASE}/api/enroll`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Enrollment failed';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to submit enrollment');
    }
  }
}

export const publicApi = new PublicApi();