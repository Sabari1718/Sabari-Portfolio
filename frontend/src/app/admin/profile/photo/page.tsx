"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PortfolioAPI } from "@/services/api";
import { Upload, CheckCircle, AlertCircle, ImageIcon, Image as ImageIcon2 } from "lucide-react";
import Image from "next/image";
import { getFileUrl } from "@/services/api";

export default function ProfilePhotoAdmin() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await PortfolioAPI.getProfile();
    if (res.success && res.data) {
      setProfile(res.data);
      setPreviewUrl(res.data.profile_image);
    }
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ text: "Please select an image file (JPG, PNG, WEBP)", type: "error" });
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: "File size must be less than 5MB", type: "error" });
      return;
    }

    setMessage({ text: "", type: "" });
    setSelectedFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(profile?.profile_image || null);
    setMessage({ text: "", type: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setMessage({ text: "Uploading image...", type: "info" });

    try {
      const uploadRes = await PortfolioAPI.uploadImage(selectedFile);
      
      if (uploadRes.success && uploadRes.data?.url) {
        const fullImageUrl = getFileUrl(uploadRes.data.url) || uploadRes.data.url;
        
        const updatedProfile = {
          ...(profile || {}),
          profile_image: fullImageUrl
        };
        
        const updateRes = await PortfolioAPI.updateProfile(updatedProfile);
        
        if (updateRes.success) {
          setProfile(updatedProfile);
          setPreviewUrl(fullImageUrl);
          setSelectedFile(null);
          setMessage({ text: "Profile picture updated successfully!", type: "success" });
        } else {
          setMessage({ text: updateRes.message || "Failed to update profile database", type: "error" });
        }
      } else {
        setMessage({ text: uploadRes.message || "File upload failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "A network error occurred during upload", type: "error" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading profile photo data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile Photo</h1>
        <p className="text-[var(--text-secondary)]">
          Manage your portfolio's main profile picture. This image will appear on the public homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Current Photo Display */}
        <Card className="border-white/10 bg-[#121212]/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ImageIcon className="text-[var(--primary)]" size={24} />
              Current Photo
            </CardTitle>
            <CardDescription>
              This is your currently active profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <div className="relative w-64 h-64 rounded-full p-1 bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                {profile?.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt="Current Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon2 className="text-white/20" size={64} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Upload Controls */}
        <Card className="border-white/10 bg-[#121212]/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Upload className="text-[var(--primary)]" size={24} />
              Change Profile Photo
            </CardTitle>
            <CardDescription>
              Upload a new image in JPG, PNG, or WEBP format. (Max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />
            
            {/* Step 1: Choose Image */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-[var(--primary)]/50 transition-colors bg-white/5 cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="text-[var(--text-secondary)] mb-4" size={32} />
              <p className="text-sm font-medium text-white mb-1">Click to browse or drag image here</p>
              <p className="text-xs text-[var(--text-secondary)]">Recommended size: 400x400px</p>
            </div>

            {/* Step 2: Image Preview (If selected) */}
            {selectedFile && previewUrl !== profile?.profile_image && (
              <div className="mt-6 space-y-4">
                <p className="text-sm font-semibold text-white">Preview New Image:</p>
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 relative">
                    <img
                      src={previewUrl ?? ""}
                      alt="Selected Preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                </div>
                <div className="text-center text-sm text-[var(--text-secondary)]">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedFile && previewUrl !== profile?.profile_image && (
              <div className="flex gap-4 pt-4 border-t border-white/10 mt-6">
                <Button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-[var(--primary)] text-black hover:bg-[var(--primary)]/90 font-semibold"
                >
                  {uploading ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  onClick={handleCancel}
                  disabled={uploading}
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-white/5 text-white"
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Status Messages */}
            {message.text && (
              <div className={`p-4 rounded-xl flex items-center gap-3 mt-4 text-sm font-medium ${
                message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                {message.text}
              </div>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
