import jwt from "jsonwebtoken";

export function signToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "demo-secret", {
    expiresIn: "7d",
  });
}

export function getUserId(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = auth.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "demo-secret") as {
    userId: string;
  };

  return decoded.userId;
}