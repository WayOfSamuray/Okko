import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return new Response("No file", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(buffer);
    });

    return Response.json({ url: upload.secure_url });
  } catch (e) {
    console.error(e);
    return new Response("Upload error", { status: 500 });
  }
}
