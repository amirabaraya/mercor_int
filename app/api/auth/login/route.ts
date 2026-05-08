import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return Response.json({ error: "Invalid login" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return Response.json({ error: "Invalid login" }, { status: 401 });
  }

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