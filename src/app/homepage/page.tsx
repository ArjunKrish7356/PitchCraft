"use client";

// Imports: React, routing, framer-motion, Supabase, and shadcn/ui primitives
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "@/lib/supabaseClient";

// UI Primitives & Icons
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Folder,
  User,
  Menu,
  X,
  LogOut,
  Twitter,
  Linkedin,
} from "lucide-react";

// Types: Startup shape and load status
type Startup = {
  id: number;
  name: string;
  description: string;
  hashtags: string[];
};

type Status = "loading" | "error" | "success";

// Utils: deterministic badge color derived from tag hash
const badgeColorFor = (tag: string) => {
  const colors = [
    "bg-indigo-100 text-indigo-800",
    "bg-sky-100 text-sky-800",
    "bg-emerald-100 text-emerald-800",
    "bg-amber-100 text-amber-800",
    "bg-rose-100 text-rose-800",
    "bg-violet-100 text-violet-800",
  ];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) | 0;
  }
  return colors[Math.abs(hash) % colors.length];
};

// Header: top navigation with search, avatar, and logout
const Header = ({
  query,
  setQuery,
  onSearchSubmit,
}: {
  query: string;
  setQuery: (q: string) => void;
  onSearchSubmit: () => void;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (user) {
        setUserName(user.email?.split("@")[0] || "User");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Folder className="h-7 w-7 md:h-8 md:w-8 text-indigo-600" />
            <span className="text-lg md:text-xl font-bold tracking-tight">
              PitchCraft
            </span>
          </Link>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, industry, or tag..."
              className="pl-10 w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSearchSubmit();
                }
              }}
              aria-label="Search startups"
            />
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm font-medium capitalize">{userName}</span>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-slate-200">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="bg-indigo-600 text-white"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              onClick={() => setMobileOpen(true)}
              variant="ghost"
              size="icon"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-0 left-0 right-0 bg-white p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg">Menu</span>
                <Button
                  onClick={() => setMobileOpen(false)}
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <Button
                onClick={handleLogout}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// StartupCard: fixed-height card with expandable description and hashtag badges
const StartupCard = ({ startup }: { startup: Startup }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_CHARS = 100;
  const descriptionNeedsTruncating = startup.description.length > MAX_CHARS;

  const toggleExpansion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Link
        href={`/startups/${startup.id}`}
        className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
      >
        <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {startup.name}
            </CardTitle>
            <CardDescription className="text-slate-600 pt-2 min-h-[6rem]">
              {isExpanded
                ? startup.description
                : `${startup.description.slice(0, MAX_CHARS)}`}
              {descriptionNeedsTruncating && !isExpanded && "…"}
              {descriptionNeedsTruncating && (
                <button
                  onClick={toggleExpansion}
                  className="text-indigo-500 font-semibold ml-1 hover:underline"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="flex flex-wrap gap-2 mt-4">
              {startup.hashtags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`${badgeColorFor(tag)}`}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

// StartupGridSkeleton: placeholder grid while fetching
const StartupGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i}>
        <CardHeader className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardHeader>
        <CardContent className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

// Footer: minimal links and socials
const Footer = () => (
  <footer className="bg-white border-t">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
      <p className="text-sm text-slate-500">
        &copy; {new Date().getFullYear()} PitchCraft. All rights reserved.
      </p>
      <div className="flex items-center gap-4">
        <a href="#" aria-label="Twitter">
          <Twitter className="h-5 w-5 text-slate-400 hover:text-slate-600" />
        </a>
        <a href="#" aria-label="LinkedIn">
          <Linkedin className="h-5 w-5 text-slate-400 hover:text-slate-600" />
        </a>
      </div>
    </div>
  </footer>
);

// Home: protected page listing startups with search and pagination
export default function Home() {
  const [query, setQuery] = useState(""); // input value
  const [committedQuery, setCommittedQuery] = useState(""); // applied server-side filter
  const [startups, setStartups] = useState<Startup[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  const PAGE_SIZE = 9;

  // Auth guard: check Supabase session; redirect to /login when unauthenticated
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (!data.session?.user) {
        router.replace("/login");
        return;
      }
      setAuthChecked(true);
    })();
    return () => {
      active = false;
    };
  }, [router]);

  const fetchStartups = useCallback(
    async (page: number, q: string) => {
      setStatus("loading");
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let queryBuilder = supabase
        .from("StartupInfo")
        .select("id,name,description,hashtags", { count: "exact" })
        .order("id", { ascending: false })
        .range(from, to);

      const qTrim = q.trim();
      if (qTrim) {
        if (qTrim.startsWith("#")) {
          const tag = qTrim.slice(1).toLowerCase();
          if (tag) {
            queryBuilder = queryBuilder.contains("hashtags", [tag]);
          }
        } else {
          // OR filter across name and description
          const pattern = `%${qTrim}%`;
          queryBuilder = queryBuilder.or(
            `name.ilike.${pattern},description.ilike.${pattern}`
          );
        }
      }

      const { data, error, count } = await queryBuilder;

      if (error) {
        console.error(error);
        setStatus("error");
        return;
      }

      setStartups(data || []);
      setTotalCount(count || 0);
      setStatus("success");
    },
    [PAGE_SIZE]
  );

  // Fetch initial page after auth is confirmed
  useEffect(() => {
    if (authChecked) fetchStartups(currentPage, committedQuery);
  }, [fetchStartups, authChecked, currentPage, committedQuery]);

  // Submit search on Enter: reset to page 1 and fetch
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    setCommittedQuery(query);
  };

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    [totalCount]
  );

  // Build a compact page window: current +/- 2
  const pageWindow = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }, [currentPage, totalPages]);

  // While auth is being checked, render nothing to avoid flash
  if (!authChecked) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header
        query={query}
        setQuery={setQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {status === "loading" && startups.length === 0 ? (
          <StartupGridSkeleton />
        ) : status === "error" ? (
          <p className="text-center text-red-500">Failed to load startups.</p>
        ) : startups.length === 0 ? (
          <p className="text-center text-slate-500">No startups found.</p>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
              initial="hidden"
              animate="show"
            >
              {startups.map((startup) => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </motion.div>

            {/* Pagination controls */}
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1 && status !== "loading")
                          setCurrentPage(currentPage - 1);
                      }}
                      aria-disabled={currentPage === 1 || status === "loading"}
                    />
                  </PaginationItem>
                  {pageWindow[0] > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (status !== "loading") setCurrentPage(1);
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {pageWindow[0] > 2 && (
                        <PaginationItem>
                          <span className="px-2">…</span>
                        </PaginationItem>
                      )}
                    </>
                  )}
                  {pageWindow.map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          if (p !== currentPage && status !== "loading")
                            setCurrentPage(p);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {pageWindow[pageWindow.length - 1] < totalPages && (
                    <>
                      {pageWindow[pageWindow.length - 1] < totalPages - 1 && (
                        <PaginationItem>
                          <span className="px-2">…</span>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (status !== "loading")
                              setCurrentPage(totalPages);
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages && status !== "loading")
                          setCurrentPage(currentPage + 1);
                      }}
                      aria-disabled={
                        currentPage === totalPages || status === "loading"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
