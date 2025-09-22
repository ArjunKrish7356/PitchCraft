"use client";

// Admin login page with Supabase email/password authentication restricted to a single admin user
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Folder, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Login page - email/password + OAuth (Google/Apple) with Supabase
export default function LoginPage() {
  // Form state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [signingUp, setSigningUp] = useState(false);
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

        if (userData) {
          router.push("/homepage");
        } else {
          router.push("/useronboarding");
        }
      } else {
        // Fallback in case user is null but there was no sign-in error
        router.push("/homepage");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
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
      setSigningUp(false);
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    // Root container - full height grid layout
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left section - login form column */}
      <div className="relative flex flex-col px-4 py-8 sm:px-6 lg:px-10">
        {/* Brand header - pinned to the top */}
        <div className="absolute top-6 left-4 sm:left-6 lg:left-10">
          <Link href="/" className="flex items-center">
            <Folder className="h-7 w-7 sm:h-8 sm:w-8 mr-2 text-indigo-600" />
            <span className="text-xl sm:text-2xl font-semibold tracking-tight">
              PitchCraft
            </span>
          </Link>
        </div>

        {/* Main form container - vertically centered content with top padding to avoid overlap */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto pt-16 sm:pt-20">
            {/* Welcome header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-2">
                {signingUp ? "Create an Account" : "Welcome Back"}
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                {signingUp
                  ? "Create an account to access your dashboard."
                  : "Sign in to access your dashboard."}
              </p>
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
                <Link
                  href="#"
                  className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Forgot Password?
                </Link>
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
                    Signing In...
                  </span>
                ) : signingUp ? (
                  "Sign Up"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  onClick={() => setSigningUp(!signingUp)}
                  href="#"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  {signingUp ? "Sign In" : "Sign Up"}
                </Link>
              </p>
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
