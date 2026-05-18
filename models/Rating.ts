import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  movieId: { type: String, required: true },
  value: { type: Number, required: true },
});

RatingSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Rating =
  mongoose.models.Rating || mongoose.model("Rating", RatingSchema);
