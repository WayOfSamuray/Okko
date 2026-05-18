import { connectDB } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("BODY:", body);

    const email = body?.email;
    const password = body?.password;

    if (!email || !password) {
      return new Response("Missing data", { status: 400 });
    }

    const hashPassword = await bcrypt.hash(password, 5);

    await User.create({
      email,
      password: hashPassword,
      name: body.name || "",
      bio: body.bio || "",
      avatar: body.avatar || "",
      birthDate: body.birthDate || null,
      isActivated: true,
    });

    return Response.json({ message: "User created" });
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    return new Response("Server error", { status: 500 });
  }
}
