import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProfileForm from "@/components/profile/ProfileForm";
import { getCurrentUser } from "@/lib/dal";
import "./profile.css";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  // The id comes from the server-side session; the password is never selected.
  const user = await getCurrentUser();
  if (!user) notFound();

  return (
    <>
      <div className="page-head">
        <h1 className="gg-page-title">Profile</h1>
        <Link href="/dashboard" className="gg-btn gg-btn--secondary">
          <ArrowLeft /> Back
        </Link>
      </div>
      <ProfileForm
        profile={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber ?? "",
          image: user.image,
          role: user.role,
        }}
      />
    </>
  );
}
