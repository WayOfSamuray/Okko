import { connectDB } from "../../../lib/mongodb";
import { verifyAccessToken } from "../../../lib/jwt";
import { cookies } from "next/headers";
import { Comment } from "../../../models/Comment";
import { User } from "../../../models/User";
import { Types } from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const movieIdParam = searchParams.get("movieId");

    if (!movieIdParam) {
      return new Response("No movieId", { status: 400 });
    }

    const movieId = new Types.ObjectId(movieIdParam);

    const comments = await Comment.find({ movieId }).lean();

    return Response.json(comments);
  } catch (e) {
    console.error("GET COMMENTS ERROR:", e);
    return new Response("Server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { text, movieId, parentId } = await req.json();

    const movieObjectId = new Types.ObjectId(movieId);

    const parentObjectId = parentId ? new Types.ObjectId(parentId) : null;

    const token = (await cookies()).get("accessToken")?.value;

    let userData = {
      userId: "guest",
      userName: "Гость",
      userAvatar: "",
    };

    if (token) {
      const payload: any = verifyAccessToken(token);
      const user = await User.findById(payload.id);

      if (user) {
        userData = {
          userId: user._id.toString(),
          userName: user.name || "Без имени",
          userAvatar: user.avatar || "",
        };
      }
    }

    await Comment.create({
      text,
      movieId: movieObjectId,
      parentId: parentObjectId,
      ...userData,
      likes: [],
      dislikes: [],
    });

    return Response.json({ message: "Created" });
  } catch (e) {
    console.error("POST COMMENT ERROR:", e);
    return new Response("Server error", { status: 500 });
  }
}
