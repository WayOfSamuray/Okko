import { cookies } from "next/headers";
import { connectDB } from "../../../../lib/mongodb";
import { Movie } from "../../../../models/Movie";
import { verifyAccessToken } from "../../../../lib/jwt";
import { NextRequest } from "next/server";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await context.params;

  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const payload: any = verifyAccessToken(token);

  const movie = await Movie.findById(id);
  if (!movie) return new Response("Not found", { status: 404 });

  if (movie.userId !== payload.id) {
    return new Response("Forbidden", { status: 403 });
  }

  await Movie.findByIdAndDelete(id);

  return Response.json({ message: "Deleted" });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await context.params;

  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const payload: any = verifyAccessToken(token);

  const movie = await Movie.findById(id);
  if (!movie) return new Response("Not found", { status: 404 });

  if (movie.userId !== payload.id) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await req.json();

  await Movie.findByIdAndUpdate(id, data);

  return Response.json({ message: "Updated" });
}
