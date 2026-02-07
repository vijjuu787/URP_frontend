import { useState } from "react";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { apiCall } from "../utils/api";
import { parseResumeText } from "../utils/resume-parser";
import { API_BASE_URL } from "../../config/api";
import { useEffect } from "react";

interface Experience {
  id?: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface Education {
  id?: string;
  degree: string;
  institution: string;
  location?: string;
  graduationYear?: string;
}

interface Skills {
  frontend: string[];
  backend: string[];
  tools: string[];
}

interface ProfileEditProps {
  userId?: string;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export function ProfileEdit({ userId, onSave, onCancel }: ProfileEditProps) {
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skills>({
    frontend: [],
    backend: [],
    tools: [],
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load profile data when userId is provided
  useEffect(() => {
    if (!userId) return;

    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${API_BASE_URL}/api/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();
        const profileData = data.data || data;

        // Set the loaded data
        setHeadline(profileData.headline || "");
        setSummary(profileData.summary || "");
        setLocation(profileData.location || "");
        setPhone(profileData.phone || "");
        setExperiences(profileData.experiences || []);
        setEducations(profileData.educations || []);
        setSkills(
          profileData.skills || { frontend: [], backend: [], tools: [] },
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [userId]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setIsProcessing(true);
    setError(null);

    try {
      // Note: Resume parsing would require a backend service (like pdfparse, resume-parser, etc.)
      // For now, we'll show the file is selected and can be submitted with the profile
      console.log("[PROFILE_EDIT] Resume file selected:", file.name);

      // In a real implementation, you would send this to a backend service:
      // const formData = new FormData();
      // formData.append('resume', file);
      // const result = await apiCall('http://localhost:5100/api/resume/parse', {
      //   method: 'POST',
      //   body: formData,
      // });
      // Then populate the form fields from the parsed data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process resume");
      setResumeFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof Experience,
    value: string,
  ) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const handleRemoveExperience = async (index: number) => {
    try {
      const experience = experiences[index];

      // If experience has an ID, delete it from backend
      if (experience.id) {
        await apiCall<any>(
          `${API_BASE_URL}/api/profile/experience/${experience.id}`,
          { method: "DELETE" },
        );
      }

      setExperiences(experiences.filter((_, i) => i !== index));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove experience",
      );
    }
  };

  const handleSaveExperience = async (experience: Experience) => {
    try {
      if (experience.id) {
        // Update existing
        await apiCall<any>(
          `${API_BASE_URL}/api/profile/experience/${experience.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(experience),
          },
        );
      } else {
        // Add new
        await apiCall<any>(`${API_BASE_URL}/api/profile/experience`, {
          method: "POST",
          body: JSON.stringify(experience),
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save experience",
      );
    }
  };

  const handleAddEducation = () => {
    setEducations([
      ...educations,
      {
        degree: "",
        institution: "",
        location: "",
        graduationYear: "",
      },
    ]);
  };

  const handleUpdateEducation = (
    index: number,
    field: keyof Education,
    value: string,
  ) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const handleRemoveEducation = async (index: number) => {
    try {
      const education = educations[index];

      // If education has an ID, delete it from backend
      if (education.id) {
        await apiCall<any>(
          `${API_BASE_URL}/api/profile/education/${education.id}`,
          { method: "DELETE" },
        );
      }

      setEducations(educations.filter((_, i) => i !== index));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove education",
      );
    }
  };

  const handleSaveEducation = async (education: Education) => {
    try {
      if (education.id) {
        // Update existing
        await apiCall<any>(
          `${API_BASE_URL}/api/profile/education/${education.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(education),
          },
        );
      } else {
        // Add new
        await apiCall<any>(`${API_BASE_URL}/api/profile/education`, {
          method: "POST",
          body: JSON.stringify(education),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save education");
    }
  };

  const handleAddSkill = (category: keyof Skills, skill: string) => {
    if (skill && !skills[category].includes(skill)) {
      setSkills({
        ...skills,
        [category]: [...skills[category], skill],
      });
    }
  };

  const handleRemoveSkill = (category: keyof Skills, skill: string) => {
    setSkills({
      ...skills,
      [category]: skills[category].filter((s) => s !== skill),
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // 1. Update profile main info
      const profileData = {
        headline,
        summary,
        location,
        phone,
      };

      console.log("[PROFILE_EDIT] Saving profile:", profileData);

      await apiCall<any>(`${API_BASE_URL}/api/profile`, {
        method: "PATCH",
        body: JSON.stringify(profileData),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 2. Save experiences
      for (const experience of experiences) {
        if (experience.company || experience.role) {
          await handleSaveExperience(experience);
        }
      }

      // 3. Save educations
      for (const education of educations) {
        if (education.degree || education.institution) {
          await handleSaveEducation(education);
        }
      }

      // 4. Save skills
      if (
        skills.frontend.length > 0 ||
        skills.backend.length > 0 ||
        skills.tools.length > 0
      ) {
        await apiCall<any>(`${API_BASE_URL}/api/profile/skills`, {
          method: "POST",
          body: JSON.stringify(skills),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      console.log("[PROFILE_EDIT] All data saved successfully");

      if (onSave) {
        onSave({ profileData, experiences, educations, skills });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
      console.error("[PROFILE_EDIT] Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="flex-1 min-h-screen overflow-y-auto"
      style={{
        backgroundColor: "var(--bg-secondary)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div className="max-w-4xl mx-auto p-8">
        <div
          className="rounded-lg p-6 mb-6"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <h1
            className="text-3xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Edit Profile
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Update your profile information and upload your resume
          </p>
        </div>

        {error && (
          <div
            className="rounded-lg p-4 mb-6"
            style={{
              backgroundColor: "var(--error-50)",
              border: "1px solid var(--error-200)",
            }}
          >
            <p style={{ color: "var(--error-700)" }} className="font-semibold">
              Error: {error}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Resume Upload */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <Label
              className="block mb-4 text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Upload Resume (PDF)
            </Label>
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 transition-all"
              style={{
                borderColor: resumeFile
                  ? "var(--success-400)"
                  : "var(--border-secondary)",
                backgroundColor: resumeFile
                  ? "var(--success-50)"
                  : "transparent",
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                disabled={isProcessing}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Upload
                  className="w-12 h-12 mx-auto mb-2"
                  style={{ color: "var(--primary-600)" }}
                />
                {resumeFile ? (
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--success-700)" }}
                    >
                      {resumeFile.name}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Click to replace
                    </p>
                  </div>
                ) : (
                  <>
                    <p
                      className="font-medium mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Drop your resume here or click to browse
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      PDF format, max 5MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="headline"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Headline
                </Label>
                <Input
                  id="headline"
                  placeholder="e.g., Senior Full Stack Developer"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <Label
                  htmlFor="summary"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Professional Summary
                </Label>
                <textarea
                  id="summary"
                  placeholder="Tell us about yourself..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-inter)",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="location"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-primary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phone"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-primary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Experience
              </h2>
              <Button
                onClick={handleAddExperience}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                style={{
                  backgroundColor: "var(--primary-600)",
                  color: "white",
                }}
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </Button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-secondary)",
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      style={{ color: "var(--text-primary)" }}
                      className="font-semibold"
                    >
                      Experience {idx + 1}
                    </h3>
                    <button
                      onClick={() => handleRemoveExperience(idx)}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <Trash2
                        className="w-4 h-4"
                        style={{ color: "var(--error-600)" }}
                      />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) =>
                        handleUpdateExperience(idx, "company", e.target.value)
                      }
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <Input
                      placeholder="Job Title"
                      value={exp.role}
                      onChange={(e) =>
                        handleUpdateExperience(idx, "role", e.target.value)
                      }
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <Input
                      placeholder="Location"
                      value={exp.location || ""}
                      onChange={(e) =>
                        handleUpdateExperience(idx, "location", e.target.value)
                      }
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        value={exp.startDate || ""}
                        onChange={(e) =>
                          handleUpdateExperience(
                            idx,
                            "startDate",
                            e.target.value,
                          )
                        }
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-primary)",
                          color: "var(--text-primary)",
                        }}
                      />
                      <Input
                        type="date"
                        value={exp.endDate || ""}
                        onChange={(e) =>
                          handleUpdateExperience(idx, "endDate", e.target.value)
                        }
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-primary)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={exp.description || ""}
                      onChange={(e) =>
                        handleUpdateExperience(
                          idx,
                          "description",
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="w-full p-3 rounded-lg border"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-inter)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Education
              </h2>
              <Button
                onClick={handleAddEducation}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                style={{
                  backgroundColor: "var(--primary-600)",
                  color: "white",
                }}
              >
                <Plus className="w-4 h-4" />
                Add Education
              </Button>
            </div>

            <div className="space-y-4">
              {educations.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-secondary)",
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      style={{ color: "var(--text-primary)" }}
                      className="font-semibold"
                    >
                      Education {idx + 1}
                    </h3>
                    <button
                      onClick={() => handleRemoveEducation(idx)}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <Trash2
                        className="w-4 h-4"
                        style={{ color: "var(--error-600)" }}
                      />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        handleUpdateEducation(idx, "degree", e.target.value)
                      }
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <Input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) =>
                        handleUpdateEducation(
                          idx,
                          "institution",
                          e.target.value,
                        )
                      }
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <Input
                      placeholder="Location"
                      value={edu.location || ""}
                      onChange={(e) =>
                        handleUpdateEducation(idx, "location", e.target.value)
                      }
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Graduation Year"
                      value={edu.graduationYear || ""}
                      onChange={(e) =>
                        handleUpdateEducation(
                          idx,
                          "graduationYear",
                          e.target.value,
                        )
                      }
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Skills
            </h2>

            {(["frontend", "backend", "tools"] as const).map((category) => (
              <div key={category} className="mb-6">
                <Label
                  className="capitalize mb-3 block font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {category} Skills
                </Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    id={`${category}-input`}
                    placeholder={`Add ${category} skill`}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const input = e.currentTarget;
                        handleAddSkill(category, input.value);
                        input.value = "";
                      }
                    }}
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-primary)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById(
                        `${category}-input`,
                      ) as HTMLInputElement;
                      if (input) {
                        handleAddSkill(category, input.value);
                        input.value = "";
                      }
                    }}
                    style={{
                      backgroundColor: "var(--primary-600)",
                      color: "white",
                    }}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills[category].map((skill, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1 rounded-full flex items-center gap-2"
                      style={{
                        backgroundColor: "var(--primary-50)",
                        border: "1px solid var(--primary-200)",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--primary-700)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {skill}
                      </span>
                      <button
                        onClick={() => handleRemoveSkill(category, skill)}
                        className="p-0.5"
                      >
                        <X
                          className="w-3 h-3"
                          style={{ color: "var(--primary-600)" }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              onClick={onCancel}
              variant="outline"
              className="rounded-lg px-6 py-3"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg px-6 py-3 flex items-center gap-2"
              style={{
                backgroundColor: "var(--primary-600)",
                color: "white",
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
