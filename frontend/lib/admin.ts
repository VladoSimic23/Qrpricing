import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireSuperAdminUserId() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const superAdminId = process.env.SUPER_ADMIN_CLERK_USER_ID;

  if (!superAdminId) {
    throw new Error("Missing environment variable: SUPER_ADMIN_CLERK_USER_ID");
  }

  if (userId !== superAdminId) {
    redirect("/dashboard");
  }

  return userId;
}
