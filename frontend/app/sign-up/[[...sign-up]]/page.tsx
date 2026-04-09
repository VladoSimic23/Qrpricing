import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <SignUp fallbackRedirectUrl="/dashboard" />
    </main>
  );
}
