"use client";

// StartupDetailCard - expanded view card for a single startup with extended info
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ReactNode, useMemo, useState } from "react";
import { Copy, DollarSign, Mail, Linkedin as LinkedinIcon } from "lucide-react";

export interface StartupRecord {
  id: number;
  name: string;
  description: string;
  hashtags: string[];
  extendedDescription?: string | null;
  founderLinkedIn?: string | null;
  founderEmail?: string | null;
  funding_info?: string | null;
  tips?: string | null;
}

interface StartupDetailCardProps {
  startup: StartupRecord;
  sidebar?: ReactNode; // optional right side content override
}

export function StartupDetailCard({
  startup,
  sidebar,
}: StartupDetailCardProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);

  const displayLinkedIn = useMemo(() => {
    if (!startup.founderLinkedIn) return "";
    return startup.founderLinkedIn.replace(/^https?:\/\//, "");
  }, [startup.founderLinkedIn]);

  const copyToClipboard = async (text: string, which: "email" | "linkedin") => {
    try {
      await navigator.clipboard.writeText(text);
      if (which === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 1200);
      } else {
        setCopiedLinkedIn(true);
        setTimeout(() => setCopiedLinkedIn(false), 1200);
      }
    } catch (e) {
      // noop: clipboard not available, or permissions denied.
      console.error("Failed to copy to clipboard", e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Main Card Section */}
      <div className="lg:col-span-3 xl:col-span-4">
        <Card className="p-8 shadow-sm border border-gray-200/70">
          {/* Title / Subtitle */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {startup.name}
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-3xl">
              {startup.description}
            </p>
          </div>

          {/* Tags */}
          {startup.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {startup.hashtags.slice(0, 12).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gray-100 text-gray-800 hover:bg-gray-100 cursor-default"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </Badge>
              ))}
            </div>
          )}

          {/* Extended Description */}
          {startup.extendedDescription && (
            <div className="prose prose-sm md:prose max-w-none text-gray-800 leading-relaxed space-y-4">
              {startup.extendedDescription.split(/\n{2,}/).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          )}
        </Card>

        {/* Cold Email Tips below main card */}
        <div className="mt-6 rounded-md border border-gray-200/80 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Cold Email Tips
          </h3>
          {startup.tips ? (
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {startup.tips.split(/\n+/).map((line, i) => (
                <li key={i}>{line.trim()}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">Information unavailable.</p>
          )}
        </div>
      </div>

      {/* Sidebar Section */}
      <aside className="lg:col-span-2 xl:col-span-1">
        {sidebar ? (
          sidebar
        ) : (
          <div className="space-y-6">
            <Card className="p-4 shadow-sm border border-gray-200/70">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Founder Contact
              </h2>
              <div className="space-y-4">
                {/* LinkedIn row: icon left, link + icon-only copy on right */}
                <div className="flex items-center justify-between gap-3">
                  <LinkedinIcon className="h-4 w-4 text-blue-600" />
                  {startup.founderLinkedIn ? (
                    <div className="flex items-center gap-2 min-w-0">
                      <a
                        href={startup.founderLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 break-all hover:underline text-right"
                      >
                        {displayLinkedIn}
                      </a>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Copy LinkedIn"
                        onClick={() =>
                          copyToClipboard(startup.founderLinkedIn!, "linkedin")
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Information unavailable.
                    </span>
                  )}
                </div>

                {/* Email row: icon left, mailto + icon-only copy on right */}
                <div className="flex items-center justify-between gap-3">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  {startup.founderEmail ? (
                    <div className="flex items-center gap-2 min-w-0">
                      <a
                        href={`mailto:${startup.founderEmail}`}
                        className="text-xs text-blue-600 break-all hover:underline text-right"
                      >
                        {startup.founderEmail}
                      </a>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Copy Email"
                        onClick={() =>
                          copyToClipboard(startup.founderEmail!, "email")
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Information unavailable.
                    </span>
                  )}
                </div>

                <Separator />

                {/* Funding row: icon left, value on right */}
                <div className="flex items-start justify-between gap-3">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  {startup.funding_info ? (
                    <p className="text-sm text-gray-700 break-words text-right">
                      {startup.funding_info}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Information unavailable.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </aside>
    </div>
  );
}
