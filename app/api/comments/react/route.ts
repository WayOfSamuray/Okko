import { connectDB } from "../../../../lib/mongodb";
import { Comment } from "../../../../models/Comment";
import { verifyAccessToken } from "../../../../lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectDB();

  const { commentId, type } = await req.json();

  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const payload: any = verifyAccessToken(token);

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return new Response("Not found", { status: 404 });
  }

  const userId = payload.id;

  comment.likes = comment.likes.filter((id: string) => id !== userId);
  comment.dislikes = comment.dislikes.filter((id: string) => id !== userId);

  if (type === "like") {
    comment.likes.push(userId);
  }

  if (type === "dislike") {
    comment.dislikes.push(userId);
  }

  await comment.save();

  return Response.json({ message: "Updated" });
}
