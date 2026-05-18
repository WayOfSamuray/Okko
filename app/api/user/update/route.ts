import { connectDB } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";
import { cookies } from "next/headers";
import { verifyAccessToken } from "../../../../lib/jwt";
import cloudinary from "../../../../lib/cloudinary";

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const file = formData.get("avatar") as File | null;

    const token = (await cookies()).get("accessToken")?.value;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const payload: any = verifyAccessToken(token);

    let avatarUrl = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "avatars" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      avatarUrl = (upload as any).secure_url;
    }

    const updateData: any = {
      name,
      bio,
    };

    if (avatarUrl) {
      updateData.avatar = avatarUrl;
    }

    await User.findByIdAndUpdate(payload.id, updateData);

    return Response.json({ message: "Updated", avatar: avatarUrl });
  } catch (e) {
    console.error("UPDATE PROFILE ERROR:", e);
    return new Response("Server error", { status: 500 });
  }
}
