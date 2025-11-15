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

type Slide = {
  title: string;
  subtitle?: string;
  body?: string;
  image: string;
};

const slides: Slide[] = [
  {
    title: "Connecting Elite Tech Talent with Industry-Leading Innovators",
    subtitle:
      "Your dedicated platform for exceptional software careers and building world-class engineering teams",
    image: "/carouselImages/team.jpeg",
  },
  {
    title: "Elite Talent Network",
    body: "Access to pre-vetted software professionals with proven expertise across all technology stacks.",
    image: "/carouselImages/digital.jpg",
  },
  {
    title: "Premier Partnerships",
    body: "Exclusive relationships with industry-leading software companies seeking exceptional talent.",
    image: "/carouselImages/hiring.jpeg",
  },
];

export function HeroCarousel() {
  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: true }));

  return (
    <div className="relative">
      <Carousel
        className="w-full h-[90vh]"
        opts={{ loop: true, align: "center" }}
        plugins={[autoplay.current]}
      >
        <CarouselContent className="h-full">
          {slides.map((slide, i) => (
            <CarouselItem key={i} className="h-[90vh]">
              <div className="relative h-full w-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={i === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto max-w-5xl px-6 text-white">
                    <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <p className="mt-4 text-lg md:text-2xl text-white/90">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.body && (
                      <p className="mt-4 text-base md:text-xl text-white/80">
                        {slide.body}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 bg-white/15 border-white/20 text-white hover:bg-white/25" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 bg-white/15 border-white/20 text-white hover:bg-white/25" />
      </Carousel>
    </div>
  );
}
