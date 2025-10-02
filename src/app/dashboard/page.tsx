"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Home, Pencil, Save, Folder } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface UserDataRow {
  id: string;
  email: string | null;
  name: string | null;
  education: string | null;
  hobbies: string | null;
  Work_Experience: string | null;
  Project1: { title?: string; description?: string } | null;
  Project2: { title?: string; description?: string } | null;
  skills: string | null;
  achievements: string | null;
  additional_data: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [project1Title, setProject1Title] = useState("");
  const [project1Description, setProject1Description] = useState("");
  const [project2Title, setProject2Title] = useState("");
  const [project2Description, setProject2Description] = useState("");
  const [achievements, setAchievements] = useState("");
  const [additionalData, setAdditionalData] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // fetch session + data
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data: sessionRes } = await supabase.auth.getSession();
      const session = sessionRes.session;
      if (!session?.user) {
        router.push("/login");
        return;
      }
      if (!active) return;
      const uid = session.user.id;
      setUserId(uid);
      const { data, error } = await supabase
        .from("userData")
        .select(
          "id,email,name,education,hobbies,Work_Experience,Project1,Project2,skills,achievements,additional_data"
        )
        .eq("id", uid)
        .maybeSingle();
      if (!active) return;
      if (error && error.code !== "PGRST116") {
        // PGRST116 = Not found maybeSingle
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data) {
        const row = data as UserDataRow;
        setName(row.name ?? "");
        setEmail(row.email ?? session.user.email ?? "");
        setEducation(row.education ?? "");
        setHobbies(row.hobbies ?? "");
        setWorkExperience(row.Work_Experience ?? "");
        setSkills(row.skills ?? "");
        setProject1Title(row.Project1?.title ?? "");
        setProject1Description(row.Project1?.description ?? "");
        setProject2Title(row.Project2?.title ?? "");
        setProject2Description(row.Project2?.description ?? "");
        setAchievements(row.achievements ?? "");
        setAdditionalData(row.additional_data ?? "");
      } else {
        // initialize email from auth if no row
        setEmail(session.user.email ?? "");
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [router]);

  const handleToggle = useCallback(
    async (e: React.FormEvent | React.MouseEvent) => {
      e.preventDefault();
      if (saving) return;
      if (isEditing) {
        if (!userId) return;
        try {
          setSaving(true);
          setError(null);
          const payload: Partial<UserDataRow> & { id: string } = {
            id: userId,
            email,
            name,
            education,
            hobbies,
            Work_Experience: workExperience,
            Project1: {
              title: project1Title || null || undefined,
              description: project1Description || null || undefined,
            },
            Project2: {
              title: project2Title || null || undefined,
              description: project2Description || null || undefined,
            },
            skills,
            achievements,
            additional_data: additionalData,
          } as any;
          const { error: upsertError } = await supabase
            .from("userData")
            .upsert(payload, { onConflict: "id" });
          if (upsertError) {
            setError(upsertError.message);
          } else {
            setIsEditing(false);
            setSavedAt(new Date());
          }
        } finally {
          setSaving(false);
        }
      } else {
        setIsEditing(true);
      }
    },
    [
      isEditing,
      userId,
      email,
      name,
      education,
      hobbies,
      workExperience,
      project1Title,
      project1Description,
      project2Title,
      project2Description,
      skills,
      achievements,
      additionalData,
      saving,
    ]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Thin Icon Sidebar (desktop) */}
      <aside className="hidden md:flex w-16 bg-white border-r border-gray-200 flex-col items-center py-6 gap-6">
        {/* Brand Icon */}
        <div className="w-10 h-10 flex items-center justify-center ">
          <Folder className="h-7 w-7 text-indigo-600" />
        </div>
        <nav className="flex flex-col gap-4 mt-4">
          <button
            aria-label="Profile"
            className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors"
          >
            <Home className="h-5 w-5" />
          </button>
        </nav>
        <div className="mt-auto pb-4 text-[10px] text-gray-400 tracking-wide rotate-180 writing-mode-vertical"></div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Folder className="h-7 w-7 text-indigo-600" />
            <span className="text-lg font-semibold text-gray-900">
              PitchCraft
            </span>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 px-3 text-xs font-medium"
        >
          <Link href="/homepage">HomePage</Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-6">
        <motion.div
          className=" mx-auto w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.header
            className="hidden md:flex justify-between items-start mb-6"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {name ? `Welcome, ${name.split(" ")[0]}` : "Welcome"}
              </h1>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Link href="/homepage">Back to Homepage</Link>
              </Button>
            </motion.div>
          </motion.header>

          {/* Main Form Card */}
          <motion.div variants={itemVariants}>
            {loading ? (
              <Card className="w-full shadow-sm border-gray-200/80">
                <CardContent className="p-6 sm:p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full shadow-sm border-gray-200/80">
                <CardContent className="p-6 sm:p-8">
                  {error && (
                    <div className="mb-4 text-sm text-red-600" role="alert">
                      {error}
                    </div>
                  )}
                  {savedAt && !isEditing && (
                    <div className="mb-4 text-xs text-green-600">
                      Last saved {savedAt.toLocaleTimeString()}
                    </div>
                  )}
                  <form className="space-y-8" onSubmit={handleToggle}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-100" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-100" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="education">Education</Label>
                        <Input
                          id="education"
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-100" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hobbies">Hobbies</Label>
                        <Input
                          id="hobbies"
                          value={hobbies}
                          onChange={(e) => setHobbies(e.target.value)}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-100" : ""}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="work-experience">Work Experience</Label>
                        <Textarea
                          id="work-experience"
                          value={workExperience}
                          onChange={(e) => setWorkExperience(e.target.value)}
                          className="min-h-[100px]"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills</Label>
                        <Textarea
                          id="skills"
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          className="min-h-[100px]"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Project 1 */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="project1-title">
                            Project 1 Title
                          </Label>
                          <Input
                            id="project1-title"
                            value={project1Title}
                            onChange={(e) => setProject1Title(e.target.value)}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-100" : ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project1-desc">
                            Project 1 Description
                          </Label>
                          <Textarea
                            id="project1-desc"
                            value={project1Description}
                            onChange={(e) =>
                              setProject1Description(e.target.value)
                            }
                            className="min-h-[110px]"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      {/* Project 2 */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="project2-title">
                            Project 2 Title
                          </Label>
                          <Input
                            id="project2-title"
                            value={project2Title}
                            onChange={(e) => setProject2Title(e.target.value)}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-100" : ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project2-desc">
                            Project 2 Description
                          </Label>
                          <Textarea
                            id="project2-desc"
                            value={project2Description}
                            onChange={(e) =>
                              setProject2Description(e.target.value)
                            }
                            className="min-h-[110px]"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="achievements">Achievements</Label>
                      <Input
                        id="achievements"
                        value={achievements}
                        onChange={(e) => setAchievements(e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-100" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additional-data">Additional Data</Label>
                      <Input
                        id="additional-data"
                        value={additionalData}
                        onChange={(e) => setAdditionalData(e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-100" : ""}
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          onClick={handleToggle}
                          disabled={saving}
                          className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isEditing ? (
                            <Save className="h-4 w-4" />
                          ) : (
                            <Pencil className="h-4 w-4" />
                          )}
                          {isEditing
                            ? saving
                              ? "Saving..."
                              : "Save Changes"
                            : "Edit"}
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
