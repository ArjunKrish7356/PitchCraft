"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, GraduationCap, User, Heart } from "lucide-react";

export interface PersonalData {
  name: string;
  email: string;
  education: string;
  hobbies: string;
}

interface PersonalInfoCardProps {
  data: PersonalData;
  onChange: (patch: Partial<PersonalData>) => void;
}

// PersonalInfoCard - step 1: collects name, email, education, and hobbies
export default function PersonalInfoCard({
  data,
  onChange,
}: PersonalInfoCardProps) {
  return (
    // Card content - fields grid and inputs
    <div className="space-y-6">
      {/* Row: Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="fullName"
              placeholder="John Doe"
              className="pl-10"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <GraduationCap className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="education"
            placeholder="e.g., B.Sc. in Computer Science"
            className="pl-10"
            value={data.education}
            onChange={(e) => onChange({ education: e.target.value })}
          />
        </div>
      </div>

      {/* Hobbies */}
      <div className="space-y-2">
        <Label htmlFor="hobbies">Hobbies</Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-3 pl-3">
            <Heart className="h-5 w-5 text-gray-400" />
          </div>
          <Textarea
            id="hobbies"
            placeholder="Tell us about your hobbies and interests..."
            className="pl-10 min-h-[100px]"
            value={data.hobbies}
            onChange={(e) => onChange({ hobbies: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
