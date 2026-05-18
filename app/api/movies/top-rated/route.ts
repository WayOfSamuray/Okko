import { connectDB } from "../../../../lib/mongodb";
import { Movie } from "../../../../models/Movie";
import { Rating } from "../../../../models/Rating";

export async function GET() {
  try {
    await connectDB();

    const movies = await Movie.find().lean();

    const movieIds = movies.map((m) => m._id.toString());

    const ratings = await Rating.aggregate([
      { $match: { movieId: { $in: movieIds } } },
      {
        $group: {
          _id: "$movieId",
          average: { $avg: "$value" },
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingMap = new Map(ratings.map((r) => [String(r._id), r]));

    const result = movies
      .map((movie) => {
        const r = ratingMap.get(String(movie._id));
        return {
          ...movie,
          averageRating: r ? Number(r.average.toFixed(1)) : 0,
        };
      })
      .filter((m) => m.averageRating > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 10);

    console.log("TopRatedBlock загружено:", result.length);
    console.log("TopRated первые 2:", result.slice(0, 2));

    return Response.json(result);
  } catch (error) {
    console.error("TopRated API Error:", error);
    return Response.json([], { status: 200 });
  }
}
