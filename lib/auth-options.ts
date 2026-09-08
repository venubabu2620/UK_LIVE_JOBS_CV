import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [CredentialsProvider({
    name: "credentials",
    credentials: { email: {}, password: {} },
    async authorize(c) {
      if (!c?.email || !c.password) return null;
      const user = await db.user.findUnique({ where: { email: c.email.toLowerCase() } });
      if (!user || !(await bcrypt.compare(c.password, user.passwordHash))) return null;
      return { id: user.id, email: user.email, name: user.name, role: user.role };
    }
  })],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) { if (user) { token.id=user.id; token.role=(user as any).role; } return token; },
    async session({ session, token }) {
      if (session.user) { (session.user as any).id=token.id; (session.user as any).role=token.role; }
      return session;
    }
  }
};
