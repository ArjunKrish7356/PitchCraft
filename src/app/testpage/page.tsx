"use client";

import {motion} from "framer-motion"
import { Button } from "@/components/ui/button";

export default function TestPage() {
  return (
    <div className=" h-screen bg-blue-200 flex justify-center items-center">
      <Button variant="secondary" size="lg" asChild>
        <motion.button whileTap={{ scale: 0.98 }}>Click me</motion.button>
      </Button>
    </div>
  );
}
