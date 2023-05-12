import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type User = {
  email: string;
};

export default defineEventHandler(async (event) => {
  const user = event.context.user as User;

  if (!user) {
    return false;
  }

  const coursePurchase = await prisma.coursePurchase.findMany({
    where: {
      userEmail: user.email,
      verified: true,
      //hard coded course Id
      courseId: 1,
    },
  });

  return coursePurchase.length > 0;
});
