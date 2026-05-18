import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";
import { generateAccessToken, generateRefreshToken } from "../../../../lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email и пароль обязательны" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 400 },
      );
    }

    if (!user.isActivated) {
      return NextResponse.json(
        { message: "Аккаунт не активирован" },
        { status: 400 },
      );
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      return NextResponse.json({ message: "Неверный пароль" }, { status: 400 });
    }

    const payload = { id: user._id.toString(), email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const response = NextResponse.json({ message: "Login success" });

    const isProd = process.env.NODE_ENV === "production";

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (e: any) {
    console.error("LOGIN ERROR:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
