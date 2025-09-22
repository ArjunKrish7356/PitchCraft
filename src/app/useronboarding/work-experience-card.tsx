"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, FolderOpen } from "lucide-react";

export interface Project {
  title: string;
  description: string;
}
export interface ExperienceData {
  workExperience: string[]; // freeform paragraphs
  projects: [Project, Project]; // exactly two entries
}

interface WorkExperienceCardProps {
  data: ExperienceData;
  onChange: (patch: Partial<ExperienceData>) => void;
}

// WorkExperienceCard - step 2: work experience and two projects
export default function WorkExperienceCard({
  data,
  onChange,
}: WorkExperienceCardProps) {
  // updateProject - helper to update a project at index 0 or 1
  const updateProject = (index: 0 | 1, patch: Partial<Project>) => {
    const copy: [Project, Project] = [
      { ...data.projects[0] },
      { ...data.projects[1] },
    ];
    copy[index] = { ...copy[index], ...patch };
    onChange({ projects: copy });
  };

  return (
    // Card content - fields and project grid
    <div className="space-y-6">
      {/* Work Experience */}
      <div className="space-y-2">
        <Label htmlFor="workExp">Work Experience</Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-3 pl-3">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <Textarea
            id="workExp"
            placeholder="Share your relevant work or internship experience..."
            className="pl-10 min-h-[120px]"
            value={data.workExperience[0] ?? ""}
            onChange={(e) => onChange({ workExperience: [e.target.value] })}
          />
        </div>
      </div>

      {/* Projects header */}
      <div>
        <Label>Projects (2)</Label>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project 1 */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="proj1Title">Project 1 Title</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FolderOpen className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="proj1Title"
                placeholder="e.g., Startup Jobs Finder"
                className="pl-10"
                value={data.projects[0].title}
                onChange={(e) => updateProject(0, { title: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="proj1Desc">Project 1 Description</Label>
            <Textarea
              id="proj1Desc"
              placeholder="Briefly describe the project and your role..."
              className="min-h-[100px]"
              value={data.projects[0].description}
              onChange={(e) =>
                updateProject(0, { description: e.target.value })
              }
            />
          </div>
        </div>

        {/* Project 2 */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="proj2Title">Project 2 Title</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FolderOpen className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="proj2Title"
                placeholder="e.g., Resume AI Analyzer"
                className="pl-10"
                value={data.projects[1].title}
                onChange={(e) => updateProject(1, { title: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="proj2Desc">Project 2 Description</Label>
            <Textarea
              id="proj2Desc"
              placeholder="Briefly describe the project and your role..."
              className="min-h-[100px]"
              value={data.projects[1].description}
              onChange={(e) =>
                updateProject(1, { description: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
