import cloudinary from 'cloudinary';
import { env } from '../utils/env.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env('CLOUDINARY_CLOUD_NAME'),
  api_key: env('CLOUDINARY_API_KEY'),
  api_secret: env('CLOUDINARY_API_SECRET'),
});

export const uploadImage = async (filePath) => {
  try {
    console.log('Uploading image to Cloudinary...');
    const result = await cloudinary.v2.uploader.upload(filePath);
    console.log('Cloudinary result:', result);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Error uploading image to Cloudinary');
  }
};
