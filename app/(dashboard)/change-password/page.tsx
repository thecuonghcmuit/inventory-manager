import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import { requireUser } from "@/lib/dal";

export const metadata = { title: "Change Password" };

export default async function ChangePasswordPage() {
  await requireUser();

  return (
    <>
      <div className="page-head">
        <h1 className="gg-page-title">Change Password</h1>
        <Link href="/dashboard" className="gg-btn gg-btn--secondary">
          <ArrowLeft /> Back
        </Link>
      </div>
      <ChangePasswordForm />
    </>
  );
}
