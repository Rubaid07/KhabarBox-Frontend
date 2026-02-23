"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Store,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { getMyProfile, updateProfile, UserProfile } from "@/lib/api-user";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile(formData);
      setProfile(updated);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!profile) return null;

  const isProvider = profile.role === "PROVIDER";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">My Profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Profile Image URL Input */}
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-32 w-32 rounded-full overflow-hidden">
                <AvatarImage
                  src={formData.image || undefined}
                  className="rounded-full object-cover"
                  style={{ borderRadius: "9999px" }}
                />
                <AvatarFallback className="bg-orange-600 text-white text-2xl font-medium rounded-full">
                  {profile.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {editMode ? (
                <div className="w-full max-w-sm">
                  <Label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <ImageIcon className="h-3 w-3" /> Profile Image URL
                  </Label>
                  <Input
                    value={formData.image || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="text-sm"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500 capitalize">
                  {profile.role}
                </p>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Name
                </Label>
                {editMode ? (
                  <Input
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your name"
                  />
                ) : (
                  <p className="p-3 bg-gray-100 rounded-lg">{profile.name}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <p className="p-3 bg-gray-100 rounded-lg text-gray-600">
                  {profile.email}
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone
                </Label>
                {editMode ? (
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Phone number"
                  />
                ) : (
                  <p className="p-3 bg-gray-100 rounded-lg">
                    {profile.phone || "Not set"}
                  </p>
                )}
              </div>
            </div>

            {/* Provider Only Fields */}
            {isProvider && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold flex items-center gap-2 text-lg">
                  <Store className="h-5 w-5" /> Restaurant Info
                </h3>

                <div>
                  <Label>Restaurant Name</Label>
                  {editMode ? (
                    <Input
                      value={formData.restaurantName || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          restaurantName: e.target.value,
                        })
                      }
                      placeholder="Restaurant name"
                    />
                  ) : (
                    <p className="p-3 bg-gray-100 rounded-lg">
                      {profile.restaurantName || "Not set"}
                    </p>
                  )}
                </div>

                {/* Logo URL Input */}
                <div>
                  <Label className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> Restaurant Logo URL
                  </Label>
                  {editMode ? (
                    <Input
                      value={formData.logoUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, logoUrl: e.target.value })
                      }
                      placeholder="https://example.com/logo.png"
                    />
                  ) : (
                    <div className="flex items-center gap-4 mt-2">
                      {profile.logoUrl ? (
                        <Image
                          src={profile.logoUrl}
                          alt="Logo"
                          width={80}
                          height={80}
                          className="rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Store className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Preview logo in edit mode */}
                {editMode && formData.logoUrl && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Preview:</span>
                    <Image
                      src={formData.logoUrl}
                      alt="Logo Preview"
                      width={60}
                      height={60}
                      className="rounded-lg object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                  </div>
                )}

                <div>
                  <Label>Address</Label>
                  {editMode ? (
                    <Input
                      value={formData.restaurantAddress || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          restaurantAddress: e.target.value,
                        })
                      }
                      placeholder="Restaurant address"
                    />
                  ) : (
                    <p className="p-3 bg-gray-100 rounded-lg">
                      {profile.restaurantAddress || "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Description</Label>
                  {editMode ? (
                    <textarea
                      className="w-full p-3 border rounded-lg min-h-[100px] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={formData.restaurantDescription || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          restaurantDescription: e.target.value,
                        })
                      }
                      placeholder="About your restaurant"
                    />
                  ) : (
                    <p className="p-3 bg-gray-100 rounded-lg min-h-[100px]">
                      {profile.restaurantDescription || "Not set"}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {editMode ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditMode(false);
                      setFormData(profile);
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
