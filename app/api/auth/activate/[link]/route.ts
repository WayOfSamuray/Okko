import { connectDB } from "../../../../../lib/mongodb";
import { User } from "../../../../../models/User";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ link: string }> },
) {
  await connectDB();

  const { link } = await params;

  const user = await User.findOne({ activationLink: link });

  if (!user) {
    return new Response("Invalid link", { status: 400 });
  }

  user.isActivated = true;
  await user.save();

  return NextResponse.redirect(process.env.CLIENT_URL!);
}
