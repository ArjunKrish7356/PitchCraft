"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// HeroSection - top marketing hero with headline, supporting text, and primary CTA
export function HeroSection() {
  const router = useRouter();
  return (
    // Outer hero wrapper
    <section
      id="hero"
      className="relative w-full min-h-[calc(100vh-4rem)] flex items-center py-20 md:py-0 overflow-hidden"
    >
      {/* Constrained content container */}
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            From Cold Email to First Interview
          </h1>
          {/* Subheading */}
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm md:text-base mb-8">
            Access our database of visionary founders and use our AI to write
            hyper-personalized outreach. Your journey to a dream internship or
            job starts here.
          </p>
          {/* CTA Button */}
          <Button
            onClick={() => router.push("/login")}
            size="lg"
            className="px-6 font-medium shadow-sm bg-indigo-600 text-white"
          >
            Get Started for Free
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
