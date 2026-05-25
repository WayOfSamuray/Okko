import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { accessToken, refreshToken } = await req.json();

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 15,
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);

    return Response.json(
      { message: "Server error" },
      { status: 500 },
    );
  }
}