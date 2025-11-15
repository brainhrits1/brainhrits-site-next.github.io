"use client";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import Head from "next/head";

type Slide = {
  title: string;
  titleHighlights?: string[]; // Keywords to highlight in title
  subtitle?: string;
  subtitleHighlights?: string[]; // Keywords to highlight in subtitle
  body?: string;
  bodyHighlights?: string[]; // Keywords to highlight in body
  image: string;
};

const slides: Slide[] = [
  {
    title: "Connecting Elite Tech Talent with Industry-Leading Innovators",
    titleHighlights: ["Elite Tech Talent", "Industry-Leading"],
    subtitle:
      "Your dedicated platform for exceptional software careers and building world-class engineering teams",
    subtitleHighlights: ["exceptional", "world-class"],
    image: "/carouselImages/team.jpg",
  },
  {
    title: "Elite Talent Network",
    titleHighlights: ["Elite", "Talent"],
    body: "Access to pre-vetted software professionals with proven expertise across all technology stacks.",
    bodyHighlights: ["pre-vetted", "proven expertise"],
    image: "/carouselImages/digital.jpg",
  },
  {
    title: "Premier Partnerships",
    titleHighlights: ["Premier"],
    body: "Exclusive relationships with industry-leading software companies seeking exceptional talent.",
    bodyHighlights: ["Exclusive", "exceptional talent"],
    image: "/carouselImages/hiring.jpg",
  },
];

// Helper function to highlight specific keywords in text
const highlightText = (text: string, highlights?: string[]) => {
  if (!highlights || highlights.length === 0) {
    return <span>{text}</span>;
  }

  let processedText = text;
  const parts: { text: string; highlight: boolean }[] = [];

  // Create a regex pattern that matches all highlight keywords
  const pattern = new RegExp(`(${highlights.join("|")})`, "gi");
  const matches = processedText.split(pattern);

  return (
    <>
      {matches.map((part, index) => {
        const isHighlight = highlights.some(
          (h) => h.toLowerCase() === part.toLowerCase()
        );

        if (isHighlight) {
          return (
            <span
              key={index}
              className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent font-bold"
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export function HeroCarousel() {
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  const scrollToContent = () => {
    const nextSection = document.getElementById("about");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative h-screen w-full">
      <Carousel
        plugins={[autoplay.current]}
        className="w-full h-full"
        onMouseEnter={() => autoplay.current.stop()}
        onMouseLeave={() => autoplay.current.play()}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-screen">
              <div className="relative h-full w-full">
                {/* Image with dark overlay for better text contrast */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-7 md:px-8 lg:px-32 max-w-full">
                    <div className="max-w-4xl space-y-6">
                      {/* Title */}
                      <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-2xl">
                        {highlightText(slide.title, slide.titleHighlights)}
                      </h1>

                      {/* Subtitle */}
                      {slide.subtitle && (
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-100 font-light leading-relaxed tracking-wide max-w-3xl drop-shadow-lg">
                          {highlightText(
                            slide.subtitle,
                            slide.subtitleHighlights
                          )}
                        </p>
                      )}

                      {/* Body */}
                      {slide.body && (
                        <p className="text-base md:text-lg lg:text-xl text-gray-200 font-normal leading-relaxed max-w-2xl drop-shadow-md border-l-4 border-orange-500 pl-6 py-2 bg-black/20 backdrop-blur-sm rounded-r-lg">
                          {highlightText(slide.body, slide.bodyHighlights)}
                        </p>
                      )}

                      {/* Optional CTA Button */}
                      {index === 0 && (
                        <div className="pt-4">
                          <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <CarouselPrevious className="left-4 md:left-8 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300" />
        <CarouselNext className="right-4 md:right-8 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300" />
      </Carousel>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group"
        aria-label="Scroll to content"
        title="Scroll to content"
      >
        <ChevronDown className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
