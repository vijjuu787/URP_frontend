import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Download,
  Edit3,
  Briefcase,
  GraduationCap,
  Share2,
  Target,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  CheckCircle,
  Calendar,
  Building,
  Loader,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ProfileEdit } from "./profile-edit";
import { apiCall } from "../utils/api";
import { API_BASE_URL } from "../../config/api";

interface ProfileData {
  id: string;
  userId: string;
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  experiences: Array<{
    id: string;
    company: string;
    role: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  educations: Array<{
    id: string;
    degree: string;
    institution: string;
    location?: string;
    graduationYear?: string;
  }>;
  skills?: {
    id: string;
    frontend: string[];
    backend: string[];
    tools: string[];
  };
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

interface ProfilePageProps {
  userId: string;
}

export function ProfilePage({ userId }: ProfilePageProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(85);

  // Function to fetch profile data
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!userId) {
        setError("User ID not provided. Please log in again.");
        setIsLoading(false);
        return;
      }
      const token = localStorage.getItem("authToken");
      const url = `${API_BASE_URL}/api/profile`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to fetch profile");
        setProfileData(null);
        setIsLoading(false);
        return;
      }
      const profileContent = data.data || data;
      setProfileData(profileContent);
      calculateCompletion(profileContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch profile data from backend using userId
  useEffect(() => {
    fetchProfile();
  }, [userId]);
  const calculateCompletion = (profile: ProfileData | null) => {
    if (!profile) {
      setProfileCompletion(0);
      return;
    }

    let completionScore = 0;
    let totalFields = 7;

    if (profile.user?.fullName) completionScore++;
    if (profile.headline) completionScore++;
    if (profile.summary) completionScore++;
    if (profile.location) completionScore++;
    if (profile.phone) completionScore++;
    if (profile.experiences && profile.experiences.length > 0)
      completionScore++;
    if (profile.educations && profile.educations.length > 0) completionScore++;

    setProfileCompletion(Math.round((completionScore / totalFields) * 100));
  };

  // Default skills if not provided
  const skills = profileData?.skills || {
    frontend: [],
    backend: [],
    tools: [],
  };

  // Format experience data
  const experience = profileData?.experiences || [];

  // Format education data
  const education = profileData?.educations || [];

  // Default user info if not available
  const userName = profileData?.user?.fullName || "Loading...";
  const userEmail = profileData?.user?.email || "";
  const userHeadline = profileData?.headline || "Professional";
  const userLocation = profileData?.location || "";
  const userPhone = profileData?.phone || "";
  const userSummary = profileData?.summary || "";

  if (isEditMode) {
    return (
      <ProfileEdit
        userId={userId}
        onCancel={() => setIsEditMode(false)}
        onSave={() => {
          setIsEditMode(false);
          // Refetch profile data after save
          setIsLoading(true);
          fetchProfile();
        }}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="flex-1 min-h-screen overflow-y-auto flex items-center justify-center"
        style={{
          backgroundColor: "var(--gray-50)",
          fontFamily: "var(--font-inter)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader
            className="w-8 h-8 animate-spin"
            style={{ color: "var(--primary-600)" }}
          />
          <p style={{ color: "var(--text-secondary)" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && profileData === null) {
    const isUnauthorized = error === "No token" || error.includes("401");

    return (
      <div
        className="flex-1 min-h-screen overflow-y-auto flex items-center justify-center"
        style={{
          backgroundColor: "var(--gray-50)",
          fontFamily: "var(--font-inter)",
        }}
      >
        <div
          className="bg-white rounded-lg p-8 max-w-md text-center"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          {isUnauthorized ? (
            <>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "var(--orange-100)" }}
              >
                <Mail
                  className="w-6 h-6"
                  style={{ color: "var(--orange-600)" }}
                />
              </div>
              <p
                style={{ color: "var(--text-primary)" }}
                className="font-semibold mb-2 text-lg"
              >
                Please Log In
              </p>
              <p
                style={{ color: "var(--text-secondary)" }}
                className="text-sm mb-4"
              >
                You need to be logged in to view your profile. Please log in
                with your credentials.
              </p>
              <Button
                onClick={() => {
                  // Navigate to login page
                  window.location.href = "/login";
                }}
                className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm"
                style={{
                  backgroundColor: "var(--primary-600)",
                  color: "var(--fg-white)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                Go to Login
              </Button>
            </>
          ) : (
            <>
              <p
                style={{ color: "var(--text-primary)" }}
                className="font-semibold mb-2"
              >
                Unable to Load Profile
              </p>
              <p
                style={{ color: "var(--text-secondary)" }}
                className="text-sm mb-4"
              >
                {error}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm"
                style={{
                  backgroundColor: "var(--primary-600)",
                  color: "var(--fg-white)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                Retry
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 min-h-screen overflow-y-auto"
      style={{
        backgroundColor: "var(--gray-50)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            {/* Header Section */}
            <div
              className="rounded-xl p-5 h-64 flex flex-col justify-between"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "var(--primary-100)",
                    border: "3px solid var(--primary-200)",
                  }}
                >
                  <User
                    className="w-16 h-16"
                    style={{ color: "var(--primary-600)" }}
                  />
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h1
                        className="text-3xl font-bold mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {userName}
                      </h1>
                      <p
                        className="text-lg font-medium mb-2"
                        style={{
                          color: "var(--text-secondary)",
                        }}
                      >
                        {userHeadline}
                      </p>
                      {userLocation && (
                        <div
                          className="flex items-center gap-2"
                          style={{
                            color: "var(--text-tertiary)",
                          }}
                        >
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{userLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-4">
                    <Button
                      onClick={() => setIsEditMode(true)}
                      className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                      style={{
                        backgroundColor: "var(--primary-600)",
                        color: "var(--fg-white)",
                        boxShadow: "var(--shadow-xs)",
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </Button>
                    <Button
                      className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border-primary)",
                        boxShadow: "var(--shadow-xs)",
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div
              className="rounded-xl p-6 min-h-[200px] flex flex-col"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Professional Summary
                </h2>
                <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit3
                    className="w-4 h-4"
                    style={{ color: "var(--text-quaternary)" }}
                  />
                </button>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {userSummary ||
                  "No professional summary added yet. Add one to stand out to recruiters!"}
              </p>
            </div>

            {/* Skills Section */}
            <div
              className="rounded-xl p-6 min-h-[280px] flex flex-col"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Skills & Expertise
                </h2>
                <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit3
                    className="w-4 h-4"
                    style={{ color: "var(--text-quaternary)" }}
                  />
                </button>
              </div>

              <div className="space-y-4">
                {/* Frontend */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Frontend
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.frontend.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: "var(--primary-50)",
                          color: "var(--primary-700)",
                          border: "1px solid var(--primary-200)",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Backend */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Backend
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.backend.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: "var(--success-50)",
                          color: "var(--success-700)",
                          border: "1px solid var(--success-200)",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Tools & Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.tools.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: "var(--gray-100)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-secondary)",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Education Section - removed from here */}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1 space-y-6 flex flex-col">
            {/* Profile Completion */}
            <div
              className="rounded-xl p-5 h-64 flex flex-col justify-between"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Profile Strength
                </h3>
                <div className="relative mb-3">
                  <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: "var(--gray-200)",
                    }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${profileCompletion}%`,
                        backgroundColor: "var(--success-600)",
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Profile Completion
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: "var(--success-600)",
                      fontFamily: "var(--font-code)",
                    }}
                  >
                    {profileCompletion}%
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className="w-3 h-3"
                    style={{ color: "var(--success-600)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Add professional photo
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className="w-3 h-3"
                    style={{ color: "var(--success-600)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Complete work experience
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border-2"
                    style={{ borderColor: "var(--gray-300)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Add certifications
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div
              className="rounded-xl p-6 min-h-[200px] flex flex-col"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <h3
                className="flex items-center justify-between mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Contact Information
              </h3>
              <div className="space-y-3">
                {userEmail && (
                  <div className="flex items-center gap-3">
                    <Mail
                      className="w-5 h-5"
                      style={{ color: "var(--text-quaternary)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {userEmail}
                    </span>
                  </div>
                )}
                {userPhone && (
                  <div className="flex items-center gap-3">
                    <Phone
                      className="w-5 h-5"
                      style={{ color: "var(--text-quaternary)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {userPhone}
                    </span>
                  </div>
                )}
                {!userPhone && (
                  <div className="flex items-center gap-3">
                    <Phone
                      className="w-5 h-5"
                      style={{ color: "var(--text-quaternary)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      No phone number added
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Linkedin
                    className="w-5 h-5"
                    style={{ color: "var(--text-quaternary)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--primary-600)" }}
                  >
                    Add LinkedIn
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Github
                    className="w-5 h-5"
                    style={{ color: "var(--text-quaternary)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--primary-600)" }}
                  >
                    Add GitHub
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe
                    className="w-5 h-5"
                    style={{ color: "var(--text-quaternary)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--primary-600)" }}
                  >
                    Add Portfolio
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className="rounded-xl p-6 min-h-[160px] flex flex-col"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Quick Actions
              </h3>
              <div className="space-y-5">
                <Button
                  className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "var(--primary-600)",
                    color: "var(--fg-white)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </Button>
                <Button
                  className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-primary)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <Target className="w-4 h-4" />
                  Match with Jobs
                </Button>
              </div>
            </div>

            {/* Additional Info Card */}
            <div
              className="rounded-xl p-6 min-h-[120px] flex flex-col"
              style={{
                backgroundColor: "var(--primary-50)",
                border: "1px solid var(--primary-200)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex items-start gap-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "var(--primary-600)",
                  }}
                >
                  <Building
                    className="w-5 h-5"
                    style={{ color: "var(--fg-white)" }}
                  />
                </div>
                <div>
                  <h4
                    className="font-semibold mb-1"
                    style={{ color: "var(--primary-900)" }}
                  >
                    Open to Opportunities
                  </h4>
                  <p
                    className="text-sm"
                    style={{ color: "var(--primary-700)" }}
                  >
                    Actively looking for Senior Full Stack Developer roles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid - 2 Column Layout */}
        <div className="mb-6">
          {/* Work Experience - Full Width Section */}
          <div
            className="rounded-xl p-6 min-h-[400px] flex flex-col mt-6"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Work Experience
              </h2>
              <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit3
                  className="w-4 h-4"
                  style={{ color: "var(--text-quaternary)" }}
                />
              </button>
            </div>

            <div className="space-y-6">
              {experience && experience.length > 0 ? (
                experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="flex gap-4">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: "var(--primary-100)",
                          border: "2px solid var(--primary-600)",
                        }}
                      >
                        <Briefcase
                          className="w-5 h-5"
                          style={{
                            color: "var(--primary-600)",
                          }}
                        />
                      </div>
                      {idx < experience.length - 1 && (
                        <div
                          className="w-0.5 h-full mt-2"
                          style={{
                            backgroundColor: "var(--border-secondary)",
                          }}
                        />
                      )}
                    </div>

                    {/* Experience Card */}
                    <div className="flex-1 pb-6">
                      <h3
                        className="text-lg font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="font-medium"
                          style={{
                            color: "var(--primary-600)",
                          }}
                        >
                          {exp.company}
                        </span>
                        {exp.location && (
                          <>
                            <span
                              style={{
                                color: "var(--text-quaternary)",
                              }}
                            >
                              •
                            </span>
                            <span
                              className="text-sm"
                              style={{
                                color: "var(--text-tertiary)",
                              }}
                            >
                              {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar
                            className="w-4 h-4"
                            style={{
                              color: "var(--text-quaternary)",
                            }}
                          />
                          <span
                            className="text-sm"
                            style={{
                              color: "var(--text-tertiary)",
                            }}
                          >
                            {exp.startDate}{" "}
                            {exp.endDate ? `- ${exp.endDate}` : "- Present"}
                          </span>
                        </div>
                      )}
                      {exp.description && (
                        <p
                          className="text-sm leading-relaxed"
                          style={{
                            color: "var(--text-secondary)",
                          }}
                        >
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="text-center py-8"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No work experience added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Education - Full Width Section */}
        <div className="mb-6">
          <div
            className="rounded-xl p-6 min-h-[280px] flex flex-col"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Education
              </h2>
              <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit3
                  className="w-4 h-4"
                  style={{ color: "var(--text-quaternary)" }}
                />
              </button>
            </div>

            <div className="space-y-4">
              {education && education.length > 0 ? (
                education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="flex gap-4 p-4 rounded-lg"
                    style={{
                      backgroundColor: "var(--gray-50)",
                      border: "1px solid var(--border-secondary)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: "var(--success-100)",
                        border: "1px solid var(--success-200)",
                      }}
                    >
                      <GraduationCap
                        className="w-6 h-6"
                        style={{ color: "var(--success-600)" }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {edu.degree}
                      </h3>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{
                          color: "var(--text-secondary)",
                        }}
                      >
                        {edu.institution}
                      </p>
                      <div className="flex items-center gap-2">
                        {edu.location && (
                          <>
                            <span
                              className="text-sm"
                              style={{
                                color: "var(--text-tertiary)",
                              }}
                            >
                              {edu.location}
                            </span>
                            <span
                              style={{
                                color: "var(--text-quaternary)",
                              }}
                            >
                              •
                            </span>
                          </>
                        )}
                        <span
                          className="text-sm"
                          style={{
                            color: "var(--text-tertiary)",
                          }}
                        >
                          {edu.graduationYear
                            ? `Graduated ${edu.graduationYear}`
                            : "Graduation year not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="text-center py-8"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No education added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
