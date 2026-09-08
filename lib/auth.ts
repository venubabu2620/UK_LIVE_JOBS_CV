import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
export async function getCurrentUser() { return (await getServerSession(authOptions))?.user ?? null; }
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user as any;
}
