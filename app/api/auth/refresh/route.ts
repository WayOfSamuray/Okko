import { cookies } from "next/headers";
import { generateAccessToken, verifyRefreshToken } from "../../../../lib/jwt";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token" },
        { status: 401 },
      );
    }

    const user = verifyRefreshToken(refreshToken) as any;

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const response = NextResponse.json({ message: "refreshed" });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return response;
  } catch (e) {
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 401 },
    );
  }
}
