import { connectDB } from "../../../../lib/mongodb";
import { Movie } from "../../../../models/Movie";
import { Rating } from "../../../../models/Rating";

export async function GET() {
  try {
    await connectDB();

    const movies = await Movie.find().sort({ createdAt: -1 }).limit(10).lean();

    console.log("Найдено фильмов для NewBlock:", movies.length);

    const movieIds = movies.map((m) => m._id.toString());

    const ratings = await Rating.aggregate([
      { $match: { movieId: { $in: movieIds } } },
      {
        $group: {
          _id: "$movieId",
          average: { $avg: "$value" },
        },
      },
    ]);

    const ratingMap = new Map(ratings.map((r) => [String(r._id), r.average]));

    const result = movies.map((movie) => ({
      ...movie,
      averageRating: ratingMap.has(String(movie._id))
        ? Number(ratingMap.get(String(movie._id))!.toFixed(1))
        : 0,
    }));

    console.log("NewBlock результат (первые 2):", result.slice(0, 2));

    return Response.json(result);
  } catch (error) {
    console.error("NewBlock API Error:", error);
    return Response.json([], { status: 200 });
  }
}
