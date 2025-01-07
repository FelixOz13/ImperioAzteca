import fs from "fs";
import asyncHandler from "express-async-handler";
import { cloudinaryUploadImg, cloudinaryDeleteImg } from "../utils/cloudinary";

// Middleware to upload images to Cloudinary
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path); // Delete local file after upload
    }

    const images = urls.map((file) => file);
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

// Middleware to delete an image from Cloudinary
const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

export default 
{
uploadImages,
deleteImages
};
