"use client";

// User onboarding page (multi-step) - orchestrates 3 cards and collects profile details
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder } from "lucide-react";
import PersonalInfoCard, { PersonalData } from "./personal-info-card";
import WorkExperienceCard, { ExperienceData } from "./work-experience-card";
import SkillsAchievementsCard, { SkillsData } from "./skills-achievements-card";

type Step = 0 | 1 | 2;

// Replace incorrect/placeholder interface and add precise payload types
interface Project {
  title: string;
  description: string;
}

interface UserOnboardingPayload {
  email: string | null;
  name: string | null;
  education: string | null;
  hobbies: string | null;
  // quoted/CASE-SENSITIVE column names in DB
  Work_Experience: string | null;
  Project1: Project | null;
  Project2: Project | null;
  skills: string | null;
  achievements: string | null;
  additional_data: string | null;
}

// Page component - renders the multi-step onboarding with navigation and indicator
export default function UserOnboardingPage() {
  const router = useRouter();
  // step state - which card is active
  const [currentStep, setCurrentStep] = useState<Step>(0);
  // direction state - 1 forward, -1 backward to control animation
  const [direction, setDirection] = useState<1 | -1>(1);
  // submit state - success/error messaging
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState<
    | null
    | { type: "success"; message: string }
    | { type: "error"; message: string }
  >(null);

  // personalData state - step 0
  const [personalData, setPersonalData] = useState<PersonalData>({
    name: "",
    email: "",
    education: "",
    hobbies: "",
  });

  // experienceData state - step 1
  const [experienceData, setExperienceData] = useState<ExperienceData>({
    workExperience: [""],
    projects: [
      { title: "", description: "" },
      { title: "", description: "" },
    ],
  });

  // skillsData state - step 2
  const [skillsData, setSkillsData] = useState<SkillsData>({
    skills: "",
    achievements: "",
    additional_data: "",
  });

  // validateStep - basic per-step validation to advance
  const validateStep = (step: Step) => {
    if (step === 0) {
      return (
        personalData.name.trim() !== "" && personalData.email.trim() !== ""
      );
    }
    if (step === 1) {
      return (experienceData.workExperience[0] ?? "").trim() !== "";
    }
    if (step === 2) {
      return skillsData.skills.trim() !== "";
    }
    return true;
  };

  // handlePrevious - go back a step (set backward direction)
  const handlePrevious = () => {
    setDirection(-1);
    setCurrentStep((s) => (s > 0 ? ((s - 1) as Step) : s));
  };

  // handleNext - advance a step or submit at the end (set forward direction)
  const handleNext = async () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 2) {
      setDirection(1);
      setCurrentStep((s) => (s + 1) as Step);
    } else {
      // Final submit - push to Supabase
      await pushDataToSupabase();
    }
  };

  // pushDataToSupabase - inserts combined onboarding data into public.userData
  const pushDataToSupabase = async () => {
    try {
      setSubmitError(null);
      setSubmitSuccess(null);
      setSubmitLoading(true);

      // Normalize fields to match table schema
      const workExperienceText =
        (experienceData.workExperience || [])
          .filter((t) => (t ?? "").trim() !== "")
          .join("\n\n") || null;

      const payload: UserOnboardingPayload = {
        email: personalData.email || null,
        name: personalData.name || null,
        education: personalData.education || null,
        hobbies: personalData.hobbies || null,
        // assign exact-cased keys for quoted columns
        Work_Experience: workExperienceText,
        Project1: (experienceData.projects?.[0] as Project) ?? null,
        Project2: (experienceData.projects?.[1] as Project) ?? null,
        skills: skillsData.skills || null,
        achievements: skillsData.achievements || null,
        additional_data: skillsData.additional_data ?? null,
      };

      const { error } = await supabase.from("userData").insert([payload]);
      if (error) throw error;

      const successMsg = "Your profile has been saved successfully.";
      setSubmitSuccess(successMsg);
      setShowDialog({ type: "success", message: successMsg });

      // Auto-close dialog after 2s and redirect to /homepage
      setTimeout(() => {
        setShowDialog(null);
        router.replace("/homepage");
      }, 2000);
    } catch (err: unknown) {
      // Safely extract a message from unknown
      let msg = "Failed to save your profile. Please try again.";
      if (err instanceof Error && err.message) {
        msg = err.message;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        // cover cases where supabase returns an object with message
        try {
          msg = String((err as { message?: unknown }).message) || msg;
        } catch {
          /* fallback to default */
        }
      } else if (typeof err === "string") {
        msg = err;
      }

      setSubmitError(msg);
      setShowDialog({ type: "error", message: msg });
    } finally {
      setSubmitLoading(false);
    }
  };

  // animation variants - slide horizontally with fade based on direction
  const variants = useMemo(
    () => ({
      enter: (dir: 1 | -1) => ({ x: dir === 1 ? 40 : -40, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (dir: 1 | -1) => ({ x: dir === 1 ? -40 : 40, opacity: 0 }),
    }),
    []
  );

  // renderStep - chooses which card to show with motion transitions
  const renderStep = () => {
    return (
      <div className="relative">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {currentStep === 0 && (
              <PersonalInfoCard
                data={personalData}
                onChange={(patch) =>
                  setPersonalData((d) => ({ ...d, ...patch }))
                }
              />
            )}
            {currentStep === 1 && (
              <WorkExperienceCard
                data={experienceData}
                onChange={(patch) =>
                  setExperienceData((d) => ({ ...d, ...patch }))
                }
              />
            )}
            {currentStep === 2 && (
              <SkillsAchievementsCard
                data={skillsData}
                onChange={(patch) => setSkillsData((d) => ({ ...d, ...patch }))}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  // StepIndicator - simple three-dot progress with active state
  const StepIndicator = () => (
    // Dots row - shows current progress
    <div className="flex items-center justify-center gap-2 mb-6">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={[
            "h-2.5 w-2.5 rounded-full transition-colors duration-200",
            currentStep === i ? "bg-indigo-600" : "bg-gray-300",
          ].join(" ")}
          aria-label={`Step ${i + 1} ${currentStep === i ? "(current)" : ""}`}
        />
      ))}
    </div>
  );

  return (
    // Root layout - header, content, footer
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - brand only per design */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand - file icon + name */}
          <Link href="/" className="flex items-center gap-2">
            <Folder className="h-7 w-7 md:h-8 md:w-8 text-indigo-600" />
            <span className="text-lg md:text-xl font-bold tracking-tight">
              PitchCraft
            </span>
          </Link>
          {/* Right side intentionally empty for a clean flow */}
        </div>
      </header>

      {/* Main content - title + card */}
      <main className="flex-1">
        <section className="w-full lg:w-3/4 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Title group - consistent with marketing typography */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              Find Your Perfect Startup Match
            </h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              You&apos;re one step away from a smarter way to connect with
              startups. To begin, let&apos;s build your profile. Your details
              will fuel our AI, which acts as your personal career agent to
              craft the perfect introduction to founders.
            </p>
          </div>

          {/* Card - wrapper with step indicator and card content */}
          <Card className="rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="sr-only">Onboarding form</CardTitle>
              <StepIndicator />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Submission status dialog (success/error) */}
              <AlertDialog
                open={!!showDialog}
                onOpenChange={(o) => !o && setShowDialog(null)}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {showDialog?.type === "success"
                        ? "Success"
                        : "Something went wrong"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {showDialog?.message}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    {showDialog?.type === "success" ? (
                      <AlertDialogAction
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => router.replace("/homepage")}
                      >
                        OK
                      </AlertDialogAction>
                    ) : (
                      <AlertDialogAction
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => setShowDialog(null)}
                      >
                        Close
                      </AlertDialogAction>
                    )}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {renderStep()}

              {/* Navigation footer - previous/next or submit */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="min-w-[110px] disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={currentStep === 0}
                  onClick={handlePrevious}
                >
                  Previous
                </Button>

                <Button
                  type="button"
                  className="min-w-[170px] bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleNext}
                  disabled={submitLoading}
                >
                  {currentStep < 2
                    ? "Next"
                    : submitLoading
                    ? "Submitting..."
                    : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer - copyright */}
      <footer className="border-t border-gray-200 py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 PitchCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
