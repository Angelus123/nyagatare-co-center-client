import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'vila-coda';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET || 'your_upload_preset'; // Replace with your actual preset name

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  resource_type: string;
  [key: string]: unknown;
}

export const uploadImageToCloudinary = async (image: File): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await axios.post<CloudinaryUploadResponse>(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );
  return response.data;
};