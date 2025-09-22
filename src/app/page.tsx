// Root route redirector - immediately sends users to the marketing landing page
import { redirect } from "next/navigation";

export default function RootRedirectPage() {
  // Server redirect to /landingpage
  redirect("/landingpage");
}
