import { connectDB } from "../../../../lib/mongodb";
import { Comment } from "../../../../models/Comment";
import { cookies } from "next/headers";
import { verifyAccessToken } from "../../../../lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { commentId } = await req.json();

    const token = (await cookies()).get("accessToken")?.value;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const payload: any = verifyAccessToken(token);

    const comment = await Comment.findById(commentId);

    if (!comment) return new Response("Not found", { status: 404 });

    if (comment.userId !== payload.id) {
      return new Response("Forbidden", { status: 403 });
    }

    await Comment.findByIdAndDelete(commentId);

    return Response.json({ message: "Deleted" });
  } catch (e) {
    console.error("DELETE ERROR:", e);
    return new Response("Server error", { status: 500 });
  }
}
