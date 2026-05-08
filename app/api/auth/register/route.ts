import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ error: "Email and password required" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  const token = signToken(user.id);

  return Response.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      xp: user.xp,
      streak: user.streak,
    },
  });
}