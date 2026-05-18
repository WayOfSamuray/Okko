import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  avatar: String,
  birthDate: Date,
  bio: String,
  isActivated: { type: Boolean, default: false },
  activationLink: String,
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
