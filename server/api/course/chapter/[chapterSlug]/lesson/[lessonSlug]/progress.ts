import { PrismaClient } from "@prisma/client";
import protectRoute from "~/utils/protectRoute";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  assertMethod(event, ["PUT", "PATCH", "POST"]);

  protectRoute(event);

  const { chapterSlug, lessonSlug } = event.context.params;

  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      Chapter: {
        slug: chapterSlug,
      },
    },
  });

  if (!lesson) {
    throw createError({
      statusCode: 404,
      statusMessage: "Lesson not found",
    });
  }

  const { completed } = await readBody(event);

  const {
    user: { email: userEmail },
  } = event.context;

  return await prisma.lessonProgress.upsert({
    where: {
      lessonId_userEmail: {
        lessonId: lesson.id,
        userEmail,
      },
    },
    update: {
      completed,
    },
    create: {
      completed,
      userEmail,
      Lesson: {
        connect: {
          id: lesson.id,
        },
      },
    },
  });
});
