import { cookies } from "next/headers";
import { connectDB } from "../../../lib/mongodb";
import { Movie } from "../../../models/Movie";
import { Rating } from "../../../models/Rating";
import { verifyAccessToken } from "../../../lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const token = (await cookies()).get("accessToken")?.value;
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload: any = verifyAccessToken(token);
    const data = await req.json();

    let formattedGenres: { name: string; slug: string }[] = [];

    if (typeof data.genre === "string") {
      formattedGenres = data.genre
        .split(",")
        .map((g: string) => {
          const name = g.trim();
          if (!name) return null;
          return {
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
          };
        })
        .filter(Boolean) as any;
    } else if (Array.isArray(data.genre)) {
      formattedGenres = data.genre
        .map((g: any) => {
          if (typeof g === "string") {
            const name = g.trim();
            return name
              ? { name, slug: name.toLowerCase().replace(/\s+/g, "-") }
              : null;
          }
          if (g?.name && g?.slug) {
            return {
              name: g.name.trim(),
              slug: g.slug.toLowerCase().trim(),
            };
          }
          return null;
        })
        .filter(Boolean) as any;
    }

    const movie = await Movie.create({
      ...data,
      genre: formattedGenres,
      userId: payload.id,
    });

    return Response.json(movie);
  } catch (e) {
    console.error("CREATE MOVIE ERROR:", e);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();

  const movies = await Movie.find().lean();

  const ratings = await Rating.aggregate([
    {
      $group: {
        _id: "$movieId",
        average: { $avg: "$value" },
        count: { $sum: 1 },
      },
    },
  ]);

  const ratingMap = new Map(ratings.map((r) => [String(r._id), r]));

  const moviesWithRating = movies.map((movie) => {
    const r = ratingMap.get(String(movie._id));

    return {
      ...movie,
      averageRating: r ? Number(r.average.toFixed(1)) : 0,
      ratingCount: r ? r.count : 0,
    };
  });

  return Response.json(moviesWithRating);
}
