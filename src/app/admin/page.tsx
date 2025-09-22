"use client";

// Admin Add Startup page - UI for adding new startup entries (no functionality yet)
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronUp, ChevronDown, LogOut, Folder, Menu, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// SectionRowProps - typing for collapsible row component
interface SectionRowProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  first?: boolean;
}

// SectionRow - clickable row for collapsible sections
function SectionRow({ title, open, onToggle, first }: SectionRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between py-4 text-left ${
        first ? "" : "mt-2"
      } transition-colors`}
      aria-expanded={open}
    >
      <span className="font-semibold text-gray-900">{title}</span>
      {open ? (
        <ChevronUp className="h-4 w-4 text-gray-500" />
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-500" />
      )}
    </button>
  );
}

// AdminPage - main exported admin page component
export default function AdminPage() {
  // Collapsible open states
  const [basicOpen, setBasicOpen] = useState(true);
  const [detailedOpen, setDetailedOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  // Mobile menu open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Auth state loading
  const [authChecking, setAuthChecking] = useState(true);
  // Form field states
  const [company, setCompany] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [detailedDesc, setDetailedDesc] = useState("");
  const [fundingInfo, setFundingInfo] = useState("");
  const [founderLinkedIn, setFounderLinkedIn] = useState("");
  const [founderEmail, setFounderEmail] = useState("");
  const [tips, setTips] = useState("");
  // Submission states
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const router = useRouter();

  // effect - verify authenticated admin user
  useEffect(() => {
    const verify = async () => {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email?.toLowerCase();
      if (email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.replace("/login");
        return;
      }
      setAuthChecking(false);
    };
    verify();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email?.toLowerCase();
      if (email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.replace("/login");
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [router]);

  // handleLogout - signs out user and redirects
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  // handleAddStartup - validate and insert new startup into Supabase
  const handleAddStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    // Basic validation for required fields
    if (!company.trim()) {
      setSubmitError("Company Name is required.");
      return;
    }
    if (!shortDesc.trim()) {
      setSubmitError("Short Description is required.");
      return;
    }
    if (!hashtags.trim()) {
      setSubmitError("At least one hashtag is required.");
      return;
    }
    // Transform hashtags into array (remove #, split by commas/spaces)
    const tags = Array.from(
      new Set(
        hashtags
          .split(/[\s,]+/)
          .map((t) => t.trim())
          .filter(Boolean)
          .map((t) => (t.startsWith("#") ? t.slice(1) : t))
      )
    ).slice(0, 20); // limit to 20 tags
    if (tags.length === 0) {
      setSubmitError("Provide at least one valid hashtag.");
      return;
    }
    setSubmitting(true);
    try {
      // Insert minimal required columns used by homepage (name, description, hashtags)
      const { error } = await supabase.from("StartupInfo").insert({
        name: company.trim(),
        description: shortDesc.trim(),
        hashtags: tags,
        extendedDescription: detailedDesc.trim() || null,
        founderLinkedIn: founderLinkedIn.trim() || null,
        founderEmail: founderEmail.trim() || null,
        funding_info: fundingInfo.trim() || null,
        tips: tips.trim() || null,
      });
      if (error) {
        setSubmitError(error.message);
        return;
      }
      // Optional: clear form
      setCompany("");
      setHashtags("");
      setShortDesc("");
      setDetailedDesc("");
      setFundingInfo("");
      setFounderLinkedIn("");
      setFounderEmail("");
      setTips("");
      setSubmitSuccess("Startup added successfully!");
      // Optionally redirect after short delay
      setTimeout(() => {
        // router.push("/"); // Uncomment to redirect to homepage after add
      }, 1200);
    } catch (err: unknown) {
      // Narrow unknown to get a message without using `any`
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Unexpected error while adding startup.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Root container - full height flex layout
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {authChecking && (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          Validating session...
        </div>
      )}
      {!authChecking && (
        <>
          {/* Top navigation bar - admin header */}
          <header className="bg-white border-b border-gray-200">
            {/* Header inner wrapper */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Header content flex row */}
              <div className="flex h-16 items-center justify-between">
                {/* Branding */}
                <div className="flex items-center space-x-2">
                  <Folder className="h-7 w-7 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">
                    PitchCraft
                  </span>
                </div>

                {/* Desktop navigation / actions */}
                <div className="hidden md:flex items-center space-x-10">
                  {/* Back link (desktop) */}
                  <Link
                    href="/"
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Back to Homepage
                  </Link>
                  {/* User actions (desktop) */}
                  <div className="flex items-center space-x-6">
                    <Button
                      type="button"
                      onClick={handleLogout}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-3"
                    >
                      Logout
                    </Button>
                  </div>
                </div>

                {/* Mobile menu toggle button */}
                <div className="md:hidden flex items-center">
                  <button
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="admin-mobile-menu"
                    onClick={() => setMobileMenuOpen((o) => !o)}
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {mobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Mobile dropdown panel */}
            {mobileMenuOpen && (
              <div
                id="admin-mobile-menu"
                className="md:hidden border-t border-gray-200 bg-white shadow-sm"
              >
                {/* Mobile menu inner */}
                <div className="px-4 py-4 space-y-4">
                  {/* Back link (mobile) */}
                  <Link
                    href="/"
                    className="block text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Back to Homepage
                  </Link>
                  <Separator />
                  {/* Logout action (mobile) */}
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                  <div className="pt-2"></div>
                </div>
              </div>
            )}
          </header>

          {/* Main content area - admin form container */}
          <main className="flex-1">
            {/* Page container */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
              {/* Page title block */}
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Add New Startup
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  Fill in the details below to add a new startup to the
                  platform.
                </p>
              </div>
              {/* Feedback alerts - success or error messages */}
              {submitError && (
                <div
                  role="alert"
                  className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {submitError}
                </div>
              )}
              <AlertDialog
                open={!!submitSuccess}
                onOpenChange={(open) => {
                  if (!open) setSubmitSuccess(null);
                }}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Success</AlertDialogTitle>
                    <AlertDialogDescription>
                      {submitSuccess}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Form card wrapper */}
              <Card className="bg-white shadow-sm border border-gray-200/70">
                {/* Card content - holds sections */}
                <CardContent className="p-0">
                  {/* Form element - wraps all input sections */}
                  <form onSubmit={handleAddStartup} noValidate>
                    {/* Basic Information section */}
                    <div className="px-6">
                      <SectionRow
                        title="Basic Information"
                        open={basicOpen}
                        onToggle={() => setBasicOpen((o) => !o)}
                        first
                      />
                      <Separator />
                      {basicOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 pb-6">
                          {/* Company name field */}
                          <div className="flex flex-col space-y-2">
                            <label
                              htmlFor="company"
                              className="text-sm font-medium text-gray-700"
                            >
                              Company Name
                            </label>
                            <Input
                              id="company"
                              placeholder="e.g. Acme Inc."
                              aria-label="Company Name"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              required
                            />
                          </div>
                          {/* Hashtags field */}
                          <div className="flex flex-col space-y-2">
                            <label
                              htmlFor="hashtags"
                              className="text-sm font-medium text-gray-700"
                            >
                              Hashtags
                            </label>
                            <Input
                              id="hashtags"
                              placeholder="e.g., #tech, #AI, #startup"
                              aria-label="Hashtags"
                              value={hashtags}
                              onChange={(e) => setHashtags(e.target.value)}
                              required
                            />
                          </div>
                          {/* Short Description full width */}
                          <div className="md:col-span-2 flex flex-col space-y-2">
                            <label
                              htmlFor="shortDesc"
                              className="text-sm font-medium text-gray-700"
                            >
                              Short Description
                            </label>
                            <Input
                              id="shortDesc"
                              placeholder="Briefly describe the startup"
                              aria-label="Short Description"
                              value={shortDesc}
                              onChange={(e) => setShortDesc(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Detailed Information section */}
                    <div className="px-6 mt-2">
                      <SectionRow
                        title="Detailed Information"
                        open={detailedOpen}
                        onToggle={() => setDetailedOpen((o) => !o)}
                      />
                      <Separator />
                      {detailedOpen && (
                        <div className="pt-4 pb-6 space-y-6">
                          {/* Detailed description field */}
                          <div className="flex flex-col space-y-2">
                            <label
                              htmlFor="detailedDesc"
                              className="text-sm font-medium text-gray-700"
                            >
                              Detailed Description
                            </label>
                            <Textarea
                              id="detailedDesc"
                              rows={5}
                              placeholder="Provide a comprehensive overview..."
                              aria-label="Detailed Description"
                              value={detailedDesc}
                              onChange={(e) => setDetailedDesc(e.target.value)}
                            />
                          </div>
                          {/* Funding information field */}
                          <div className="flex flex-col space-y-2">
                            <label
                              htmlFor="fundingInfo"
                              className="text-sm font-medium text-gray-700"
                            >
                              Funding Information (optional)
                            </label>
                            <Input
                              id="fundingInfo"
                              placeholder="e.g., Seed round $1.2M led by XYZ"
                              aria-label="Funding Information"
                              value={fundingInfo}
                              onChange={(e) => setFundingInfo(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Founder Information section */}
                    <div className="px-6 mt-2">
                      <SectionRow
                        title="Founder Information"
                        open={contactOpen}
                        onToggle={() => setContactOpen((o) => !o)}
                      />
                      <Separator />
                      {contactOpen && (
                        <div className="pt-4 pb-6 space-y-6">
                          <p className="text-xs text-gray-500">
                            Optional details to help users reach or research the
                            founder.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Founder LinkedIn field */}
                            <div className="flex flex-col space-y-2 md:col-span-1">
                              <label
                                htmlFor="founderLinkedIn"
                                className="text-sm font-medium text-gray-700"
                              >
                                Founder LinkedIn (optional)
                              </label>
                              <Input
                                id="founderLinkedIn"
                                placeholder="https://linkedin.com/in/username"
                                aria-label="Founder LinkedIn"
                                value={founderLinkedIn}
                                onChange={(e) =>
                                  setFounderLinkedIn(e.target.value)
                                }
                              />
                            </div>
                            {/* Founder Email field */}
                            <div className="flex flex-col space-y-2 md:col-span-1">
                              <label
                                htmlFor="founderEmail"
                                className="text-sm font-medium text-gray-700"
                              >
                                Founder Email (optional)
                              </label>
                              <Input
                                id="founderEmail"
                                type="email"
                                placeholder="founder@example.com"
                                aria-label="Founder Email"
                                value={founderEmail}
                                onChange={(e) =>
                                  setFounderEmail(e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Cold Email Tips section */}
                    <div className="px-6 mt-2">
                      <SectionRow
                        title="Cold Email Tips"
                        open={tipsOpen}
                        onToggle={() => setTipsOpen((o) => !o)}
                      />
                      <Separator />
                      {tipsOpen && (
                        <div className="pt-4 pb-6 space-y-4">
                          <p className="text-xs text-gray-500">
                            Optional notes to help users tailor their outreach
                            to this company.
                          </p>
                          <div className="flex flex-col space-y-2">
                            <label
                              htmlFor="tips"
                              className="text-sm font-medium text-gray-700"
                            >
                              Tips for Cold Mailing (optional)
                            </label>
                            <Textarea
                              id="tips"
                              rows={4}
                              placeholder="Share hints like good topics, best times to reach out, or what resonates with the founder."
                              aria-label="Cold Email Tips"
                              value={tips}
                              onChange={(e) => setTips(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Action buttons row */}
                    <div className="px-6 py-6 flex justify-end space-x-4 border-t border-gray-100 mt-2">
                      {/* Cancel button */}
                      <Button
                        variant="outline"
                        className="text-gray-700"
                        type="button"
                        onClick={() => {
                          setCompany("");
                          setHashtags("");
                          setShortDesc("");
                          setDetailedDesc("");
                          setFundingInfo("");
                          setFounderLinkedIn("");
                          setFounderEmail("");
                          setTips("");
                          setSubmitError(null);
                          setSubmitSuccess(null);
                        }}
                      >
                        Cancel
                      </Button>
                      {/* Add startup button */}
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        type="submit"
                        disabled={submitting}
                      >
                        {submitting ? "Adding..." : "Add Startup"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
