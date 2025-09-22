"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Code2, Trophy, Users } from "lucide-react";

export interface SkillsData {
  skills: string;
  achievements: string;
  additional_data: string;
}

interface SkillsAchievementsCardProps {
  data: SkillsData;
  onChange: (patch: Partial<SkillsData>) => void;
}

// SkillsAchievementsCard - step 3: skills, achievements, additional_data
export default function SkillsAchievementsCard({
  data,
  onChange,
}: SkillsAchievementsCardProps) {
  return (
    // Card content - textarea fields with icons
    <div className="space-y-6">
      {/* Skills */}
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-3 pl-3">
            <Code2 className="h-5 w-5 text-gray-400" />
          </div>
          <Textarea
            id="skills"
            placeholder="e.g., HTML, CSS, JavaScript, React..."
            className="pl-10 min-h-[100px]"
            value={data.skills}
            onChange={(e) => onChange({ skills: e.target.value })}
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-2">
        <Label htmlFor="achievements">Achievements</Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-3 pl-3">
            <Trophy className="h-5 w-5 text-gray-400" />
          </div>
          <Textarea
            id="achievements"
            placeholder="Awards, scholarships, hackathons, certifications..."
            className="pl-10 min-h-[100px]"
            value={data.achievements}
            onChange={(e) => onChange({ achievements: e.target.value })}
          />
        </div>
      </div>

      {/* additional_data */}
      <div className="space-y-2">
        <Label htmlFor="additional_data">Additional Data</Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-3 pl-3">
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <Textarea
            id="additional_data"
            placeholder="Clubs, teams, initiatives you led or organized..."
            className="pl-10 min-h-[100px]"
            value={data.additional_data}
            onChange={(e) => onChange({ additional_data: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
