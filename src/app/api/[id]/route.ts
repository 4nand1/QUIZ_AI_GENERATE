import { auth } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(_request: Request, ctx: RouteContext<'/api/[id]'>) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await ctx.params;
  const prisma = getPrisma();

  const quiz = await prisma.quiz.findFirst({
    where: { id, userId },
    include: {
      questions: true,
    },
  });

  if (!quiz) {
    return new Response("Quiz not found", { status: 404 });
  }

  return Response.json(quiz);
}
