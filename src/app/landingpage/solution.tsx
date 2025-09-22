"use client";

import { Rocket, Users2, Compass, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// SolutionSection - communicates value propositions in a clean light section
export function SolutionSection() {
  // Feature cards - benefit-focused for job/internship seekers; AI highlighted
  const items = [
    {
      icon: <Compass className="h-6 w-6 text-indigo-600" />,
      title: "Discover Vetted Startups",
      body: "Forget endless searching on cluttered job boards. Access a curated database of high-growth startups and find the perfect role for your skills and passion.",
    },
    {
      icon: <Users2 className="h-6 w-6 text-indigo-600" />,
      title: "Connect Directly with Founders",
      body: "Bypass the application black hole. We provide the verified, direct email addresses for founders and key leaders, putting your message at the top of the pile.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-indigo-600" />,
      title: "AI-Powered Personalization",
      body: "This is your secret weapon. Our AI analyzes your profile and the startup's data to instantly write a unique and compelling cold email that demands a reply.",
    },
    {
      icon: <Rocket className="h-6 w-6 text-indigo-600" />,
      title: "Land the Interview",
      body: "Our blend of direct access and AI-crafted outreach is designed for one purpose: to dramatically increase your reply rate and start the conversations that lead to interviews.",
    },
  ];

  return (
    // Wrapper section
    <section
      id="solution"
      className="w-full bg-gray-50 py-24 min-h-screen flex items-center"
    >
      {/* Container */}
      <div className="mx-auto max-w-5xl px-6">
        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center text-2xl md:text-4xl font-semibold tracking-tight mb-4 max-w-3xl mx-auto"
        >
          Your Unfair Advantage in the Job Hunt
        </motion.h2>
        {/* Subheading - concise 3-step value proposition */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="text-center text-gray-600 text-sm md:text-base max-w-3xl mx-auto mb-14"
        >
          We've built the toolkit you need to go from an unknown applicant to a
          priority candidate. Discover the right companies, reach the right
          people, and say the right thing—every time.
        </motion.p>
        {/* Value proposition cards (simple responsive grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: 0.18 + idx * 0.09,
              }}
            >
              <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col h-full">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm md:text-base">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolutionSection;
