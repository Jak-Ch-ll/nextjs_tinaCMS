import NextAuth, { User } from "next-auth";
import Providers from "next-auth/providers";

import prisma from "../../../../prisma/prisma";
import Adapters from "next-auth/adapters";

// import { sendVerificationRequest } from "../../../auth/mail";

export default NextAuth({
  providers: [
    Providers.Email({
      server: {
        host: process.env.SMTP_HOST || "",
        port: Number(process.env.SMTP_PORT) || 0,
        auth: {
          user: process.env.SMTP_USER || "",
          pass: process.env.SMTP_PASSWORD || "",
        },
      },
      from: process.env.SMTP_FROM,
      // sendVerificationRequest,
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: process.env.SECRET,
  callbacks: {
    // only allow signin of users in the database
    async signIn(user, account, profile) {
      if (user.name) {
        return true;
      }
      return false;
    },

    // redirect to main edit page after loggin in via link
    async redirect(url, baseUrl) {
      return "/edit";
    },
  },
});
