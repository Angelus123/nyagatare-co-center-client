import React, { useState } from "react";
import { uploadImageToCloudinary } from "../utils/uploadImage";

interface ImageUploadProps {
  setUrl: (url: string) => void;
}


const ImageUpload: React.FC<ImageUploadProps> = ({ setUrl }) => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      // Validate file type and size (e.g., max 5MB)
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image (JPEG, PNG, GIF).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }

      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    try {
      setIsUploading(true);
      const data = await uploadImageToCloudinary(image);
      setUrl(data.secure_url);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload the image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Upload Image to Cloudinary</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={styles.fileInput}
      />
      {error && <p style={styles.errorText}>{error}</p>}
      {previewUrl && (
        <img src={previewUrl} alt="Preview" style={styles.previewImage} />
      )}
      <button
        onClick={handleUpload}
        disabled={isUploading}
        style={{
          ...styles.uploadButton,
          backgroundColor: isUploading ? "#ccc" : "#007BFF",
          cursor: isUploading ? "not-allowed" : "pointer",
        }}
      >
        {isUploading ? (
          <span>
            <span className="spinner" style={styles.spinner}></span>
            Uploading...
          </span>
        ) : (
          "Upload"
        )}
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    textAlign: "center" as const,
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    marginBottom: "20px",
  },
  fileInput: {
    display: "block",
    margin: "20px auto",
  },
  previewImage: {
    width: "100%",
    height: "auto",
    marginBottom: "20px",
    borderRadius: "8px",
  },
  uploadButton: {
    padding: "10px 20px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    marginRight: "5px",
    border: "2px solid #fff",
    borderTop: "2px solid #007BFF",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 1s linear infinite",
  },
};

export default ImageUpload;