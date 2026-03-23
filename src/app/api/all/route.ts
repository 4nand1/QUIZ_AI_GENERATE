import { auth } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const prisma = getPrisma();

  const quizzes = await prisma.quiz.findMany({
    where: { userId },
    include: {
      questions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(quizzes);
}
