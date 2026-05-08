import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function GET(req: Request) {
  const userId = getUserId(req);

  const cards = await prisma.card.findMany({
    where: {
      nextReviewAt: { lte: new Date() },
      deck: { userId },
    },
    include: { deck: true },
    take: 20,
  });

  return Response.json(cards);
}