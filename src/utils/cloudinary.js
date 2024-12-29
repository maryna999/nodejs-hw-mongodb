import cloudinary from 'cloudinary';
import { env } from '../utils/env.js';

cloudinary.config({
  cloud_name: env('CLOUDINARY_CLOUD_NAME'),
  api_key: env('CLOUDINARY_API_KEY'),
  api_secret: env('CLOUDINARY_API_SECRET'),
});

export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath);
    return result.secure_url;
  } catch {
    throw new Error('Error uploading image to Cloudinary');
  }
};
