import React, { useState } from "react";
import { captainService } from "../../services/captain.service";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import toast from "react-hot-toast";

export const Documents = () => {
  const [documents, setDocuments] = useState({
    licenseNumber: "",
    licenseExpiry: "",
    licenseFile: null,
    registrationNumber: "",
    registrationExpiry: "",
    registrationFile: null,
    insuranceExpiry: "",
    insuranceFile: null,
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setDocuments((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDocuments((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      // Upload each document
      if (documents.licenseFile) {
        const formData = new FormData();
        formData.append("licenseFile", documents.licenseFile);
        await captainService.uploadDocuments(formData);
      }
      // Similar for other documents...
      toast.success("Documents uploaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload documents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Documents</h1>

      <div className="space-y-6">
        {/* License */}
        <div className="border-2 border-gray-200 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Driving License</h3>
            <Badge text="Valid" variant="success" />
          </div>
          <input
            type="text"
            name="licenseNumber"
            placeholder="License Number"
            value={documents.licenseNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <input
            type="date"
            name="licenseExpiry"
            value={documents.licenseExpiry}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <input
            type="file"
            name="licenseFile"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* Registration */}
        <div className="border-2 border-gray-200 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Vehicle Registration</h3>
            <Badge text="Valid" variant="success" />
          </div>
          <input
            type="text"
            name="registrationNumber"
            placeholder="Registration Number"
            value={documents.registrationNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <input
            type="date"
            name="registrationExpiry"
            value={documents.registrationExpiry}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <input
            type="file"
            name="registrationFile"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* Insurance */}
        <div className="border-2 border-gray-200 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Vehicle Insurance</h3>
            <Badge text="Valid" variant="success" />
          </div>
          <input
            type="date"
            name="insuranceExpiry"
            value={documents.insuranceExpiry}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <input
            type="file"
            name="insuranceFile"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
      </div>

      <Button onClick={handleUpload} loading={loading} className="w-full mt-6">
        Upload Documents
      </Button>
    </div>
  );
};
