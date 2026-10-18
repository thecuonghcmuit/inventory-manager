import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

// next-auth/jwt only re-exports this module, so augment the source.
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
