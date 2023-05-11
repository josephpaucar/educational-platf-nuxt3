import { PrismaClient } from "@prisma/client";
import protectRoute from "~/utils/protectRoute";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  if (event.context.params.chapterSlug !== "1-chapter-1") {
    protectRoute(event);
  }

  const { chapterSlug, lessonSlug } = event.context.params;

  // return prisma.lesson.findFirst();
  // return prisma.lesson.findMany();
  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      Chapter: {
        slug: chapterSlug,
      },
    },
    // include: {
    //   Chapter: {
    //     select: {
    //       slug: true,
    //       title: true,
    //     },
    //   },
    // },
    // include: {
    //   Chapter: true,
    // },
    // select: {
    //   slug: true,
    // },
  });

  if (!lesson) {
    throw createError({
      statusCode: 404,
      statusMessage: "Lesson not found",
    });
  }

  return {
    ...lesson,
    path: `/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`,
  };
});
