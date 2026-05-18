import { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { Movie } from "../../../../../models/Movie";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const movie = await Movie.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    );

    if (!movie) {
      return Response.json(
        { ok: false, error: "Movie not found" },
        { status: 404 },
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("View increment error:", error);
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
