"use client";

// Admin login page with Supabase email/password authentication restricted to a single admin user
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
import { Folder, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Login page - email/password + OAuth (Google/Apple) with Supabase
export default function LoginPage() {
  // Form state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  // use tabs to control signin/signup
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const signingUp = mode === "signup";
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetInfo, setResetInfo] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const router = useRouter();

  // handleSubmit - routes to sign in or sign up based on current mode
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (signingUp) {
      await signUpWithEmail();
    } else {
      await signInWithEmail();
    }
  };

  // signInWithEmail - attempts to sign in and redirects to /homepage on success
  const signInWithEmail = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      if (signInError) {
        setError(
          "Account not found or password incorrect. If you don't have an account, please create one using Sign Up."
        );
        setLoading(false);
        return;
      }
      if (data.user) {
        const { data: userData } = await supabase
          .from("userData")
          .select("id")
          .eq("id", data.user.id)
          .single();

        // Clear loading before navigation
        setLoading(false);
        if (userData) {
          router.push("/homepage");
        } else {
          router.push("/useronboarding");
        }
      } else {
        // Fallback in case user is null but there was no sign-in error
        setLoading(false);
        router.push("/homepage");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred");
      }
      setLoading(false);
    }
  };

  // signUpWithEmail - creates an account and redirects to /useronboarding; shows info if email confirmation is required
  const signUpWithEmail = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'https://pitch-craft-sage.vercel.app/login'
          }
        });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      if (!signUpData.session) {
        setInfo(
          "Check your email to confirm your account. After confirming, come back to continue onboarding."
        );
        setLoading(false);
        return;
      }
      setMode("signin");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred");
      }
      setLoading(false);
    }
  };

  // Supabase password reset
  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetInfo(null);
    setResetLoading(true);
    try {
      const emailToUse = resetEmail || email;
      const { error } = await supabase.auth.resetPasswordForEmail(emailToUse, {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : undefined,
      });
      if (error) {
        setResetError(error.message);
      } else {
        setResetInfo(
          "If an account exists for that email, a reset link has been sent."
        );
      }
    } catch (err) {
      setResetError(
        err instanceof Error ? err.message : "Unexpected error occurred"
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    // Root container - full height grid layout
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left section - login form column */}
      <div className="relative flex flex-col px-4 py-8 sm:px-6 lg:px-10">
        {/* Brand header - pinned to the top */}
        <div className="absolute top-6 left-4 sm:left-6 lg:left-10">
          <Link href="/" className="flex items-center gap-3">
            <Folder className="h-7 w-7 md:h-8 md:w-8 text-indigo-600" />
            <span className="text-lg md:text-xl font-bold tracking-tight">
              PitchCraft
            </span>
          </Link>
        </div>

        {/* Main form container - vertically centered content with top padding to avoid overlap */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto pt-16 sm:pt-20">
            {/* Tabs and header */}
            <Tabs
              value={mode}
              onValueChange={(v: string) => {
                const next = (v as "signin" | "signup") ?? "signin";
                setMode(next);
                setError(null);
                setInfo(null);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-2">
                    {signingUp ? "Create an Account" : "Welcome Back"}
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">
                    {signingUp
                      ? "Create an account to access your dashboard."
                      : "Sign in to access your dashboard."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" aria-hidden />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" aria-hidden />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="flex justify-end">
                <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
                      onClick={() => {
                        setResetEmail(email);
                        setResetError(null);
                        setResetInfo(null);
                      }}
                    >
                      Forgot Password?
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset your password</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter your email and we&apos;ll send you a password
                        reset link.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                      {resetError && (
                        <Alert variant="destructive">
                          <AlertDescription>{resetError}</AlertDescription>
                        </Alert>
                      )}
                      {resetInfo && (
                        <Alert>
                          <AlertDescription>{resetInfo}</AlertDescription>
                        </Alert>
                      )}
                      <AlertDialogFooter>
                        <AlertDialogCancel type="button">
                          Cancel
                        </AlertDialogCancel>
                        <Button type="submit" disabled={resetLoading}>
                          {resetLoading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Sending...
                            </span>
                          ) : (
                            "Send reset link"
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Error / Info messages */}
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {info && (
                <Alert className="mt-4">
                  <AlertDescription>{info}</AlertDescription>
                </Alert>
              )}

              {/* Sign in button */}
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {signingUp ? "Creating Account..." : "Signing In..."}
                  </span>
                ) : signingUp ? (
                  "Sign Up"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Helper line */}
            <div className="mt-6 text-center text-sm text-gray-600">
              {signingUp
                ? "Already have an account? Use the Sign In tab above."
                : "New here? Use the Sign Up tab above."}
            </div>
          </div>
        </div>
      </div>

      {/* Right section - hero content (hidden on mobile) */}
      <div className="hidden lg:flex bg-indigo-600 relative overflow-hidden">
        {/* Background base - solid indigo */}
        <div className="absolute inset-0 bg-indigo-600" />

        {/* Content container */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-12 text-white">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 leading-tight">
              From Cold Email to First Interview
            </h2>
            <p className="text-base md:text-lg text-indigo-100/90 leading-relaxed">
              Access our database of visionary founders and use our AI to write
              hyper-personalized outreach. Your journey to a dream internship or
              job starts here.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-md" />
      </div>
    </div>
  );
}
