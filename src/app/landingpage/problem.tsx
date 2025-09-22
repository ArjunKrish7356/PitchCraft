"use client";

import { XCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

// ProblemSection - highlights user pain points on a contrasting purple background
export function ProblemSection() {
  return (
    // Wrapper with accent background
    <section
      id="problem"
      className="w-full bg-[#4438f2] text-white py-24 min-h-screen flex items-center"
    >
      {/* Content container */}
      <div className="mx-auto max-w-5xl px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-2xl md:text-4xl font-semibold tracking-tight max-w-3xl mb-12"
        >
          Your Application Deserves to Be Seen.
        </motion.h2>
        {/* Two-column comparison: BEFORE vs WITH US */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm md:text-base">
          {/* BEFORE column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            aria-labelledby="before-title"
          >
            {/* Label */}
            <div
              id="before-title"
              className="text-xs font-semibold uppercase tracking-wide text-white/80 mb-4"
            >
              Before
            </div>
            {/* List of pains */}
            <ul className="space-y-4 max-w-xl">
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
                <p className="leading-relaxed">Wasting hours on LinkedIn.</p>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
                <p className="leading-relaxed">Hunting for emails.</p>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
                <p className="leading-relaxed">
                  Sending generic messages into an application black hole.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
                <p className="leading-relaxed">Feeling ignored.</p>
              </li>
            </ul>
          </motion.div>

          {/* WITH US column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            aria-labelledby="withus-title"
          >
            {/* Label */}
            <div
              id="withus-title"
              className="text-xs font-semibold uppercase tracking-wide text-white/80 mb-4"
            >
              With Us
            </div>
            {/* List of benefits */}
            <ul className="space-y-4 max-w-xl">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
                <p className="leading-relaxed">
                  Instantly access a list of vetted startups.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
                <p className="leading-relaxed">Get direct founder contacts.</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
                <p className="leading-relaxed">
                  Let our AI write a unique, personalized email in seconds.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
                <p className="leading-relaxed">
                  Feel confident and land the interview.
                </p>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
