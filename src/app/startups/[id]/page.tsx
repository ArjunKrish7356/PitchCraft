"use client";

// Startup detail page - fetches and displays a single startup using the StartupDetailCard
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import {
  StartupDetailCard,
  StartupRecord,
} from "@/components/startup-detail-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Folder } from "lucide-react";

// StartupDetailPage - dynamic route page showing full startup detail
export default function StartupDetailPage() {
  // params - dynamic route id param
  const params = useParams();
  const id = Number(params?.id);

  // state - startup record loading and error
  const [startup, setStartup] = useState<StartupRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // effect - fetch startup by id
  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setError("Invalid startup id");
      setLoading(false);
      return;
    }
    let active = true;
    const fetchOne = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("StartupInfo")
        .select(
          "id,name,description,hashtags,extendedDescription,founderLinkedIn,founderEmail,funding_info,tips"
        )
        .eq("id", id)
        .single();
      if (!active) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setStartup(data as StartupRecord);
      setLoading(false);
    };
    fetchOne();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top navigation bar - branding only */}
      <header className="h-14 flex items-center border-b border-gray-200 bg-white px-4">
        <div className="mx-auto w-full max-w-7xl flex items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3">
            <Folder className="h-7 w-7 md:h-8 md:w-8 text-indigo-600" />
            <span className="text-lg md:text-xl font-bold tracking-tight">
              PitchCraft
            </span>
          </Link>
          </div>
        </div>
      </header>
      {/* Main content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Back link row below navbar */}
        <div className="mb-6">
          <Link
            href="/homepage"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Startups
          </Link>
        </div>
        {loading && (
          <div className="space-y-6">
            <div className="h-10 w-1/3 max-w-xs">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="h-5 w-full max-w-xl">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="h-5 w-5/6 max-w-2xl">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        )}
        {!loading && error && (
          <div className="text-sm text-red-600" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && startup && (
          <StartupDetailCard startup={startup} />
        )}
        {!loading && !error && !startup && (
          <div className="text-sm text-gray-500">Startup not found.</div>
        )}
      </main>
      {/* Footer minimal */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-4">
        <div className="mx-auto max-w-7xl px-4 text-xs text-gray-500">
          <p className="text-sm text-slate-500">
               &copy; {new Date().getFullYear()} PitchCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
