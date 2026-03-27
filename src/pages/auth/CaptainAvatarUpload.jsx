import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { captainService } from "../../services/captain.service";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";

export const CaptainAvatarUpload = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    try {
      await captainService.uploadProfilePhoto(image);
      toast.success("Photo uploaded successfully");
      navigate("/captain-home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/captain-home");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center p-4">
      <div className="max-w-md mx-auto w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Uber</h1>
        <h2 className="text-2xl font-bold mb-6">Add Your Photo</h2>
        <p className="text-gray-600 mb-8">
          Help passengers know who they're riding with
        </p>

        {preview ? (
          <div className="mb-6">
            <img
              src={preview}
              alt="Preview"
              className="w-48 h-48 rounded-full object-cover mx-auto mb-4"
            />
            <button
              onClick={() => document.getElementById("imageInput")?.click()}
              className="text-black hover:underline text-sm"
            >
              Change Photo
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-48 h-48 mx-auto border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-gray-400 transition-all mb-6">
            <FaCamera size={48} className="text-gray-400" />
            <span className="mt-2 text-sm text-gray-600">Click to upload</span>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}

        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <div className="space-y-3">
          <Button
            onClick={handleUpload}
            loading={loading}
            disabled={!image}
            className="w-full"
          >
            Upload Photo
          </Button>
          <Button
            variant="secondary"
            onClick={handleSkip}
            disabled={loading}
            className="w-full"
          >
            Skip for Now
          </Button>
        </div>
      </div>
    </div>
  );
};
