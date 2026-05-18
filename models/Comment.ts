import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },

    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    userId: { type: String, required: true },
    userName: { type: String, default: "Гость" },
    userAvatar: { type: String, default: "" },

    likes: [{ type: String }],
    dislikes: [{ type: String }],
  },
  { timestamps: true },
);

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
