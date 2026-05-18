import { connectDB } from "../../../../lib/mongodb";
import { Movie } from "../../../../models/Movie";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) return Response.json([]);

    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { interName: { $regex: query, $options: "i" } },
      ],
    })
      .limit(10)
      .lean();

    return Response.json(movies);
  } catch (e) {
    console.error("SEARCH ERROR:", e);
    return new Response("Server error", { status: 500 });
  }
}
