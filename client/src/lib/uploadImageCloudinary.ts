const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;

export default async function uploadImageCloudinary(
  file: File
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => "Upload failed");
    throw new Error(`Cloudinary upload error: ${errorText}`);
  }

  const result = await res.json();
  if (!result.secure_url) {
    throw new Error("Upload succeeded but no secure_url returned");
  }

  return result.secure_url;
}
