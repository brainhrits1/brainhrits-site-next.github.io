import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Users,
  Coffee,
} from "lucide-react";

import { JobOpening, jobOpenings } from "./jobsDataJson";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "jobs",
  description:
    "Explore job opportunities at BrainHR IT Solutions and join our team of staffing professionals.",
};

export default function JobPage() {
  return (
    <>
      <HeroSection
        title="Join Our Team"
        subtitle="Explore career opportunities at BrainHR IT Solutions and be part of our mission to connect exceptional talent with prestigious software companies."
      />

      {/* Company Culture */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Culture"
            subtitle="At BrainHR IT Solutions, we foster a collaborative, innovative, and inclusive work environment."
            centered
          />

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="glass p-6 rounded-lg text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Passion for Excellence</h3>
              <p className="text-muted-foreground">
                We are committed to delivering exceptional service and results
                that exceed expectations at every touchpoint.
              </p>
            </div>

            <div className="glass p-6 rounded-lg text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Collaborative Spirit</h3>
              <p className="text-muted-foreground">
                We believe in the power of teamwork and foster a collaborative
                environment where everyone&apos;s ideas and contributions are
                valued.
              </p>
            </div>

            <div className="glass p-6 rounded-lg text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <Coffee className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Work-Life Balance</h3>
              <p className="text-muted-foreground">
                We understand the importance of balance and support our team
                members in maintaining a healthy work-life integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Employee Benefits"
            subtitle="We offer a comprehensive benefits package to support our team members' well-being and professional growth."
            centered
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Competitive Compensation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Salary packages that recognize your skills, experience, and
                  contributions to our success.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Health Insurance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Comprehensive health insurance coverage for you and your
                  family to ensure your well-being.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Professional Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Opportunities for continuous learning, including workshops,
                  certifications, and conference attendance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Flexible Work Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Flexible working hours and remote work options to accommodate
                  your personal needs and preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Paid Time Off</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Generous vacation days, sick leave, and holidays to ensure you
                  have time to rest and recharge.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Retirement Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Retirement savings plans with company matching to help you
                  secure your financial future.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Team Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Regular team outings, celebrations, and social events to
                  foster camaraderie and connection.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Wellness Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Initiatives to support your physical and mental well-being,
                  including gym memberships and wellness workshops.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Current Openings"
            subtitle="Explore our current job opportunities and find your next career move."
            centered
          />

          <div className="mt-12">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
                <TabsTrigger value="all">All Positions</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6 ">
                {jobOpenings?.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Testimonials"
            subtitle="Hear what our team members have to say about working at BrainHR IT Solutions."
            centered
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">R</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Person 1</CardTitle>
                    <CardDescription>Role</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  BrainHR IT Solutions helped me find my dream job. The team was
                  incredibly supportive and guided me through every step of the
                  process. I couldn&apos;t have asked for a better experience!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">A</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Person 1</CardTitle>
                    <CardDescription>Role</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Working at BrainHR IT Solutions has been a game-changer for my
                  career. The company culture is fantastic, and I feel supported
                  in my professional growth every day.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">J</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Person 3</CardTitle>
                    <CardDescription>Role</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  I am grateful to BrainHR IT Solutions for connecting me with
                  such a prestigious company. The team was professional and
                  attentive, making the entire process smooth and enjoyable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Application Process"
            subtitle="Our streamlined hiring process is designed to identify the best talent efficiently."
            centered
          />

          <div className="grid md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Application</h3>
              <p className="text-muted-foreground">
                Submit your application through our careers page, including your
                resume and cover letter.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Initial Screening</h3>
              <p className="text-muted-foreground">
                Our HR team will review your application and conduct an initial
                phone screening.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Interviews</h3>
              <p className="text-muted-foreground">
                Qualified candidates will be invited for interviews with the
                hiring manager and team members.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Offer & Onboarding</h3>
              <p className="text-muted-foreground">
                Successful candidates will receive an offer and begin our
                comprehensive onboarding process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Ready to Join Our Team?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Explore our current openings and take the next step in your career
            with BrainHR IT Solutions.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="#current-openings">
              View Open Positions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

interface JobCardProps {
  key: number;
  job: JobOpening;
}

function JobCard({ job }: JobCardProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`job-${job.id}`}>
        <AccordionTrigger>
          <div className="flex items-center justify-between p-4">
            <span className="font-semibold">{job.title}</span>
            <span className="font-extralight from-neutral-600 text-muted-foreground ml-4">
              {job.locations.join(", ")}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {job.introduction && (
            <p className="text-muted-foreground mb-4">{job.introduction}</p>
          )}

          <div>
            <h4 className="font-semibold mb-2">Responsibilities:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {job.jobDescription.keyResponsibilities.map(
                (responsibility, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {responsibility}
                  </li>
                )
              )}
            </ul>
          </div>

          {job.requiredSkills && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Required Skills:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {job.requiredSkills.map((skill, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <Button asChild>
              <Link href={`/jobs/apply/${job.id}`}>
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
