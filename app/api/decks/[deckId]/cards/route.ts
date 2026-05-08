import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { deckId: string } }
) {
  const userId = getUserId(req);
  const { deckId } = params;
  const { front, back } = await req.json();

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId },
  });

  if (!deck) {
    return Response.json({ error: "Deck not found" }, { status: 404 });
  }

  const card = await prisma.card.create({
    data: {
      front,
      back,
      deckId,
      nextReviewAt: new Date(),
    },
  });

  return Response.json(card);
}