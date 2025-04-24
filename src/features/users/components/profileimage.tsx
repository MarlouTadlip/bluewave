"use client";
import React from "react";
import { CldUploadButton } from "next-cloudinary";
import { updateProfileImage } from "../actions/users";

const profileimage = () => {
  return (
    <CldUploadButton
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess={(results: any) => {
        updateProfileImage(
          results?.info?.secure_url,
          "cm7pvk1t80000zix8agmp7x5i"
        );
        console.log(results);
      }}
    />
  );
};

export default profileimage;
