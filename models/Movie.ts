import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    image: String,
    video: String,
    title: String,
    interName: String,
    genre: [{ name: String, slug: String }],
    year: Number,
    averageRating: Number,
    age: String,
    director: String,
    actors: [String],
    desc: String,
    premiere: String,
    country: [String],
    writers: [String],
    audio: String,
    videoQuality: String,
    views: {
      type: Number,
      default: 0,
    },
    userId: { type: String, required: true },
  },
  { timestamps: true },
);

export const Movie =
  mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
