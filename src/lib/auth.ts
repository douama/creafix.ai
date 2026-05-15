import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * NextAuth configuration pour Monetiq AI.
 *
 * Providers :
 *  - Google OAuth (Connexion grand public)
 *  - Facebook OAuth (et Pages — scopes étendus pour l'audit)
 *  - Credentials (email + mot de passe pour les pays low-bandwidth)
 *
 * Le Prisma adapter est désactivé tant que la DB n'est pas connectée — décommente
 * `adapter: PrismaAdapter(prisma)` quand `DATABASE_URL` est configurée.
 */
export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope:
            "email,public_profile,pages_show_list,pages_read_engagement,read_insights,pages_read_user_content",
        },
      },
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize() {
        // TODO: hash check via bcrypt et lookup Prisma
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session.user) (session.user as any).id = token.sub;
      return session;
    },
  },
};
