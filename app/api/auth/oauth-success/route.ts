import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

import { cookies } from "next/headers";

export async function GET() {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    return Response.redirect(
      new URL("/login", process.env.NEXTAUTH_URL),
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("accessToken", session.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  });

  cookieStore.set("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.redirect(
    new URL("/profile", process.env.NEXTAUTH_URL),
  );
}