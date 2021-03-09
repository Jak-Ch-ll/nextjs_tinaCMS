import { PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (process.env.NODE_ENV === "development")
    console.log("Starting prisma in dev environment");
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

prisma.$on("beforeExit", () => {
  console.log("Server disconnecting");
});

export default prisma;
