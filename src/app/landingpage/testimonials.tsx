"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useAnimation, useInView } from "framer-motion";
import AnimatedGradientBackground from "@/components/animated-background";

// TestimonialCard - single testimonial item
interface TestimonialCardProps {
  name: string;
  role: string;
  text: string;
  initials: string;
}

// TestimonialCard - renders avatar circle, text and meta
function TestimonialCard({ name, role, text, initials }: TestimonialCardProps) {
  return (
    <Card className="bg-gray-50 border-gray-200 h-full flex flex-col">
      <CardContent className="p-5 flex flex-col gap-4">
        <p className="text-xs md:text-sm text-gray-700 leading-relaxed flex-1">
          “{text}”
        </p>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium">
            {initials}
          </div>
          <div>
            <div className="text-xs font-medium text-gray-900">{name}</div>
            <div className="text-[10px] text-gray-500">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// TestimonialsSection - displays a grid of user testimonials
// TestimonialsSection - horizontally auto-scrolling, seamless loop of testimonials
export function TestimonialsSection() {
  const testimonials: TestimonialCardProps[] = [
    {
      name: "Sarah Lee",
      role: "Computer Science Student",
      text: "Writing cold emails used to be my biggest fear. The AI writer is incredible—it crafted a personalized pitch that sounded like me, but better. I went from zero replies to landing my dream internship in two weeks.",
      initials: "SL",
    },
    {
      name: "David Chen",
      role: "Marketing Manager",
      text: "Innovate Hub's database is gold. As someone trying to break into a smaller startup, having direct founder access allowed me to bypass the generic application portals and start real conversations that led to a job offer.",
      initials: "DC",
    },
    {
      name: "Maria Rodriguez",
      role: "UX Designer",
      text: "Before, it took me an hour to write one good cold email. With the AI writer, I can send five highly personalized, impactful emails in that same time. The founders are actually replying.",
      initials: "MR",
    },
  ];
  // autoscroll refs & lifecycle
  const marqueeRef = React.useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const inView = useInView(marqueeRef, {
    margin: "0px 0px -20% 0px",
    once: true,
  });

  React.useEffect(() => {
    if (!inView) return;
    controls.start({ x: [0, -1000] });
  }, [inView, controls]);

  return (
    // Wrapper section
    <section
      id="testimonials"
      className="relative w-full py-24 min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Animated background scoped to testimonials */}
      {/* Container */}
      <div className="mx-auto w-full max-w-7xl px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center text-2xl md:text-3xl font-semibold tracking-tight mb-14"
        >
          Loved by innovators
        </motion.h2>
        {/* Horizontal autoscroll area */}
        <div className="relative">
          {/* Scroll container (duplicated content for seamless loop) */}
          <div className="relative">
            {/* Gradient edges for nicer mask */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent" />
            <div
              ref={marqueeRef}
              className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] overflow-hidden"
            >
              <motion.div
                className="flex gap-6"
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                {[...testimonials, ...testimonials].map((t, idx) => (
                  <motion.div
                    key={idx}
                    className="shrink-0 w-72 sm:w-80 h-64"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: 0.06 * (idx % testimonials.length),
                    }}
                  >
                    <TestimonialCard {...t} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
