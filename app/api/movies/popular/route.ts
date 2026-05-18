import { connectDB } from "../../../../lib/mongodb";
import { Movie } from "../../../../models/Movie";

export async function GET() {
  await connectDB();

  const movies = await Movie.find().sort({ views: -1 }).limit(10);

  return Response.json(movies);
}
