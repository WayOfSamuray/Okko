import { cookies } from "next/headers";
import { connectDB } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";
import { verifyAccessToken } from "../../../../lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const token = (await cookies()).get("accessToken")?.value;
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload: any = verifyAccessToken(token);
    const { movieId } = await req.json();

    const user = await User.findById(payload.id);

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    user.favorites = user.favorites.filter(Boolean);

    const exists = user.favorites.some(
      (fav: any) => String(fav?._id || fav) === String(movieId),
    );

    if (exists) {
      user.favorites = user.favorites.filter(
        (fav: any) => String(fav?._id || fav) !== String(movieId),
      );
    } else {
      user.favorites.push(movieId);
    }

    await user.save();

    return Response.json({ message: "ok" });
  } catch (e) {
    console.error("FAVORITE ERROR:", e);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
