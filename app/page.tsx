import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import {
  ArrowRight,
  Users,
  Building,
  Award,
  CheckCircle,
  Briefcase,
  User,
} from "lucide-react";
import { clients } from "@/lib/clients";
import { testimonials } from "@/lib/testimonial";
import { HeroCarousel } from "@/components/hero-carousel";
import { ClientSlider } from "@/components/client-slider";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      {/* About Section */}
      <section
        id="about"
        className="relative scroll-mt-20 pt-32 pb-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <SectionHeading
            title="About BrainHR IT Solutions"
            subtitle="We take the pleasure to introduce ourselves to you as a leading Software consultancy firm catering to the Staffing needs of various prestigious software companies in INDIA, and a few reputed overseas clients within US."
            centered
            className="flex flex-col items-center"
          />

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="glass p-6 rounded-lg text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Talent Pool</h3>
              <p className="text-muted-foreground">
                Access to a curated network of top-tier software professionals
                with verified skills and experience.
              </p>
            </div>

            <div className="glass p-6 rounded-lg text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Industry Connections</h3>
              <p className="text-muted-foreground">
                Strong relationships with prestigious software companies across
                India and the United States.
              </p>
            </div>

            <div className="glass p-6 rounded-lg text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Proven Track Record</h3>
              <p className="text-muted-foreground">
                Consistent success in matching the right talent with the right
                opportunities for optimal outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Services"
            subtitle="Comprehensive staffing solutions tailored to meet the unique needs of software companies."
            centered
            className="flex flex-col items-center"
          />

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4">
                Resource Strategy & Staffing
              </h3>
              <p className="text-muted-foreground mb-4">
                Flexible staffing solutions for project-based needs, providing
                skilled professionals for short to long-term assignments.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Quick turnaround times</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Verified technical expertise</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Scalable team augmentation</span>
                </li>
              </ul>
              <Link href="/services#contract-staffing">
                <Button variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4">
                Software Projects - Mobile and Web Applications
              </h3>
              <p className="text-muted-foreground mb-4">
                End-to-end software development services for mobile and web
                applications, from concept to deployment.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Agile development methodologies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Cross-platform solutions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Post-launch support and maintenance</span>
                </li>
              </ul>
              <Link href="/services#software-development">
                <Button variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4">Training</h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive training programs for software professionals to
                enhance their skills and stay updated with the latest
                technologies.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Customized training modules</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Hands-on workshops</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Certification programs</span>
                </li>
              </ul>
              <Link href="/services#training">
                <Button variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button>
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-20 bg-gray-50" id="testimonials">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Client Testimonials"
            subtitle="Hear what our clients have to say about our staffing solutions."
            centered
            className="flex flex-col items-center"
          />

          <div className="mt-12 max-w-4xl mx-auto">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </div>
      </section> */}

      {/* Clients */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Trusted by Industry Leaders" centered />

          <ClientSlider>
            <>
              {clients.map((client, index) => (
                <div key={index} className="relative h-12 w-[100px]">
                  <Image
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    width={160}
                    height={48}
                    className="h-12 w-auto object-contain block pointer-events-none select-none"
                    sizes="(min-width: 1024px) 160px, 120px"
                  />
                </div>
              ))}
            </>
          </ClientSlider>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-intermediate text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Whether you are looking for top talent or your next career
            opportunity, we are here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                Contact Us Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Link href="/jobs">View Open Positions</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
