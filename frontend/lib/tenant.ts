import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { serverReadClient } from "@/sanity/lib/serverClient";

export type TenantMembership = {
  _id: string;
  role: "owner" | "editor";
  tenant: {
    _id: string;
    name: string;
    slug: string;
    isActive?: boolean;
  };
};

const membershipQuery = `*[_type == "tenantMember" && clerkUserId == $userId][0]{
  _id,
  role,
  tenant->{
    _id,
    name,
    "slug": slug.current,
    isActive
  }
}`;

export async function requireSignedInUserId() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return userId;
}

export async function getCurrentMembership() {
  const userId = await requireSignedInUserId();
  const membership = await serverReadClient.fetch<TenantMembership | null>(
    membershipQuery,
    { userId },
  );

  return membership;
}

export async function getCurrentUserProfile() {
  const user = await currentUser();
  return {
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    name:
      [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
      null,
  };
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
