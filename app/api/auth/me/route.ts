import { cookies } from "next/headers";
import { verifyAccessToken } from "../../../../lib/jwt";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token) as { id: string };

    await connectDB();

    const user = await User.findById(payload.id)
      .populate({
        path: "favorites",
        select: "_id title image",
      })
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      birthDate: user.birthDate,
      avatar: user.avatar,
      favorites: user.favorites || [],
    });
  } catch (error) {
    console.error("AUTH ME ERROR:", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
