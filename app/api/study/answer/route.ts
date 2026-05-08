import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function GET(req: Request) {
  const userId = getUserId(req);

  const decks = await prisma.deck.findMany({
    where: { userId },
    include: { cards: true },
  });

  return Response.json(decks);
}

export async function POST(req: Request) {
  const userId = getUserId(req);
  const { name } = await req.json();

  const deck = await prisma.deck.create({
    data: { name, userId },
  });

  return Response.json(deck);
}