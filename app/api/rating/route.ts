import { cookies } from "next/headers";
import { connectDB } from "../../../lib/mongodb";
import { verifyAccessToken } from "../../../lib/jwt";
import { Rating } from "../../../models/Rating";
import { pusherServer } from "../../../lib/pusher";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { movieId, value } = await req.json();

    const token = (await cookies()).get("accessToken")?.value;

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload: any = verifyAccessToken(token);

    const existing = await Rating.findOne({
      userId: payload.id,
      movieId,
    });

    if (existing) {
      existing.value = value;
      await existing.save();
    } else {
      await Rating.create({
        userId: payload.id,
        movieId,
        value,
      });
    }

    const ratings = await Rating.find({ movieId });

    const average =
      ratings.reduce((sum, r) => sum + r.value, 0) / (ratings.length || 1);

    const averageRating = Number(average.toFixed(1));

    await pusherServer.trigger("movies", "rating-updated", {
      movieId,
      averageRating,
      ratingCount: ratings.length,
    });

    return Response.json({
      message: "ok",
      averageRating,
      ratingCount: ratings.length,
    });
  } catch (e) {
    console.error("RATING ERROR:", e);

    return new Response("Server error", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const movieId = searchParams.get("movieId");

  const token = (await cookies()).get("accessToken")?.value;

  let userId = null;

  if (token) {
    const payload: any = verifyAccessToken(token);
    userId = payload.id;
  }

  const ratings = await Rating.find({ movieId });

  const avg =
    ratings.reduce((sum, r) => sum + r.value, 0) / (ratings.length || 1);

  const userRating = userId ? await Rating.findOne({ movieId, userId }) : null;

  return Response.json({
    average: Number(avg.toFixed(1)),
    count: ratings.length,
    myRating: userRating?.value || 0,
  });
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { movieId } = await req.json();

    const token = (await cookies()).get("accessToken")?.value;

    if (!token) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const payload: any = verifyAccessToken(token);

    await Rating.findOneAndDelete({
      userId: payload.id,
      movieId,
    });

    const ratings = await Rating.find({ movieId });

    const avg =
      ratings.reduce((sum, r) => sum + r.value, 0) / (ratings.length || 1);

    const averageRating = Number(avg.toFixed(1));

    await pusherServer.trigger("movies", "rating-updated", {
      movieId,
      averageRating,
      ratingCount: ratings.length,
    });

    return Response.json({
      message: "Deleted",
      averageRating,
      ratingCount: ratings.length,
    });
  } catch (e) {
    console.error("DELETE RATING ERROR:", e);

    return new Response("Server error", {
      status: 500,
    });
  }
}
