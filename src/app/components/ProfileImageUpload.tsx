"use client";
import { useState } from "react";
import { updateProfileImage } from "@/features/users/actions/users";

export default function ProfileImageUpload({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_WIDTH = 128; // Max width in pixels
  const MAX_HEIGHT = 128; // Max height in pixels
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif"];

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Calculate new dimensions while preserving aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL(file.type, 0.8); // Use original file type, 80% quality
        resolve(base64);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a PNG, JPEG, or GIF image");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const resizedBase64 = await resizeImage(file);
      await updateProfileImage(resizedBase64, userId);
      window.location.reload(); // Refresh to show new image
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to process and upload image");
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor="profile-image" className="btn btn-primary">
        {uploading ? "Uploading..." : "Change Photo"}
      </label>
      <input
        id="profile-image"
        type="file"
        accept="image/png,image/jpeg,image/gif"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
