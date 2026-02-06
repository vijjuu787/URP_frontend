import { useState, useEffect } from "react";
import {
  Shield,
  Code,
  Briefcase,
  MapPin,
  DollarSign,
  Github,
  Globe,
  Save,
  ArrowRight,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { apiCall } from "../utils/api";

interface OnboardingFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

type ProficiencyLevel = "beginner" | "intermediate" | "advanced" | "expert";

interface SelectedSkill {
  name: string;
  proficiency: ProficiencyLevel;
}

const AVAILABLE_SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "C++",
  "Java",
  "React",
  "Node.js",
  "Django",
  "FastAPI",
  "Spring Boot",
  "Docker",
  "Kubernetes",
  "AWS",
  "GCP",
  "Azure",
  "Cybersecurity",
  "Networking",
  "Cryptography",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "REST API",
];

export function OnboardingForm({ onComplete, onSkip }: OnboardingFormProps) {
  const [autoSaved, setAutoSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    currentRole: "",
    yearsExperience: "",
    preferredJobRole: "",
    workType: "",
    location: "",
    jobType: "",
    salaryRange: [50, 150],
    projectDescription: "",
    githubUrl: "",
    portfolioUrl: "",
  });

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData, selectedSkills]);

  const handleInputChange = (field: string, value: string | number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skillName: string) => {
    const exists = selectedSkills.find((s) => s.name === skillName);
    if (exists) {
      setSelectedSkills(selectedSkills.filter((s) => s.name !== skillName));
    } else {
      setSelectedSkills([
        ...selectedSkills,
        { name: skillName, proficiency: "intermediate" },
      ]);
    }
  };

  const updateSkillProficiency = (
    skillName: string,
    proficiency: ProficiencyLevel,
  ) => {
    setSelectedSkills(
      selectedSkills.map((s) =>
        s.name === skillName ? { ...s, proficiency } : s,
      ),
    );
  };

  const filteredSkills = AVAILABLE_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isFormValid = () => {
    return (
      formData.currentRole &&
      formData.yearsExperience &&
      formData.preferredJobRole &&
      selectedSkills.length > 0
    );
  };

  const handleSaveSkills = async () => {
    setSaveError(null);
    setIsSaving(true);

    try {
      console.log("Saving skills...");
      console.log("Form data:", formData);
      console.log("Selected skills:", selectedSkills);

      // Format skills array for the API
      const skillsString = selectedSkills.map((s) => s.name).join(", ");

      const requestBody = {
        primaryRole: formData.currentRole,
        secondaryRole: formData.preferredJobRole,
        experienceLevel: formData.yearsExperience,
        skill: skillsString,
        workType: formData.workType,
        jobType: formData.jobType,
        experienceAndProject: formData.projectDescription,
      };

      console.log("Sending request body:", requestBody);

      const result = await apiCall<{
        id: string;
        userId: string;
        primaryRole: string;
        secondaryRole: string;
        experienceLevel: string;
        skill: string;
        workType: string;
        jobType: string;
        experienceAndProject: string;
      }>("http://localhost:5100/api/skills", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      console.log("Skills saved successfully:", result);
      onComplete();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save skills";
      console.error("Error saving skills:", errorMessage);
      setSaveError(errorMessage);
      setIsSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen overflow-y-auto"
      style={{
        backgroundColor: "var(--gray-50)",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 border-b backdrop-blur-sm"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "var(--primary-600)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <Shield
                  className="w-6 h-6"
                  style={{ color: "var(--fg-white)" }}
                />
              </div>
              <div>
                <h1
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Skill Assessment
                </h1>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Cypherock Security
                </p>
              </div>
            </div>

            {/* Auto-save indicator */}
            {autoSaved && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor: "var(--success-50)",
                  border: "1px solid var(--success-200)",
                }}
              >
                <Check
                  className="w-4 h-4"
                  style={{ color: "var(--success-600)" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--success-700)" }}
                >
                  Auto-saved
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Step 1 of 3
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--primary-600)" }}
            >
              33% Complete
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--gray-200)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: "33%", backgroundColor: "var(--primary-600)" }}
            />
          </div>
        </div>

        {/* Title */}
        <div className="mb-10">
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Tell us about your skills
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            This helps us match you with roles that fit your expertise.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Section 1: Basic Professional Information */}
          <div
            className="rounded-xl p-6 md:p-8 border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Briefcase
                className="w-5 h-5"
                style={{ color: "var(--primary-600)" }}
              />
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Professional Information
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <Label
                  htmlFor="currentRole"
                  className="mb-2 block text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Current Role / Title{" "}
                  <span style={{ color: "var(--error-600)" }}>*</span>
                </Label>
                <Input
                  id="currentRole"
                  type="text"
                  placeholder="e.g., Senior Security Engineer"
                  value={formData.currentRole}
                  onChange={(e) =>
                    handleInputChange("currentRole", e.target.value)
                  }
                  className="h-11"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label
                    htmlFor="yearsExperience"
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Years of Experience{" "}
                    <span style={{ color: "var(--error-600)" }}>*</span>
                  </Label>
                  <select
                    id="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={(e) =>
                      handleInputChange("yearsExperience", e.target.value)
                    }
                    className="w-full h-11 px-3 rounded-lg border"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0–1 years</option>
                    <option value="1-3">1–3 years</option>
                    <option value="3-5">3–5 years</option>
                    <option value="5-8">5–8 years</option>
                    <option value="8+">8+ years</option>
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="preferredJobRole"
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Preferred Job Role{" "}
                    <span style={{ color: "var(--error-600)" }}>*</span>
                  </Label>
                  <select
                    id="preferredJobRole"
                    value={formData.preferredJobRole}
                    onChange={(e) =>
                      handleInputChange("preferredJobRole", e.target.value)
                    }
                    className="w-full h-11 px-3 rounded-lg border"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                    required
                  >
                    <option value="">Select role</option>
                    <option value="BACKEND">Backend Engineer</option>
                    <option value="frontend">Frontend Engineer</option>
                    <option value="fullstack">Full Stack Engineer</option>
                    <option value="devops">DevOps Engineer</option>
                    <option value="security">Security Engineer</option>
                    <option value="systems">Systems Engineer</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Skills */}
          <div
            className="rounded-xl p-6 md:p-8 border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Code
                className="w-5 h-5"
                style={{ color: "var(--primary-600)" }}
              />
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Technical Skills
              </h2>
            </div>

            {/* Skill Search */}
            <div className="mb-5">
              <Input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-xs)",
                }}
              />
            </div>

            {/* Available Skills */}
            <div className="mb-6">
              <p
                className="text-sm mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Select your skills{" "}
                <span style={{ color: "var(--error-600)" }}>*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {filteredSkills.map((skill) => {
                  const isSelected = selectedSkills.find(
                    (s) => s.name === skill,
                  );
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: isSelected
                          ? "var(--primary-600)"
                          : "var(--gray-100)",
                        border: isSelected
                          ? "1px solid var(--primary-600)"
                          : "1px solid var(--border-secondary)",
                        color: isSelected
                          ? "var(--fg-white)"
                          : "var(--text-secondary)",
                      }}
                    >
                      {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Skills with Proficiency */}
            {selectedSkills.length > 0 && (
              <div>
                <p
                  className="text-sm mb-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Set proficiency level for each skill
                </p>
                <div className="space-y-4">
                  {selectedSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="rounded-lg p-4 border"
                      style={{
                        backgroundColor: "var(--gray-50)",
                        borderColor: "var(--border-secondary)",
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {skill.name}
                          </span>
                          <button
                            onClick={() => toggleSkill(skill.name)}
                            className="p-1 rounded hover:bg-red-50"
                          >
                            <X
                              className="w-4 h-4"
                              style={{ color: "var(--error-600)" }}
                            />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          {(
                            [
                              "beginner",
                              "intermediate",
                              "advanced",
                              "expert",
                            ] as ProficiencyLevel[]
                          ).map((level) => (
                            <button
                              key={level}
                              onClick={() =>
                                updateSkillProficiency(skill.name, level)
                              }
                              className="px-3 py-1 rounded text-xs font-medium capitalize transition-all"
                              style={{
                                backgroundColor:
                                  skill.proficiency === level
                                    ? level === "expert"
                                      ? "var(--purple-600)"
                                      : level === "advanced"
                                        ? "var(--success-600)"
                                        : level === "intermediate"
                                          ? "var(--primary-600)"
                                          : "var(--gray-600)"
                                    : "var(--bg-primary)",
                                border:
                                  skill.proficiency === level
                                    ? "1px solid transparent"
                                    : "1px solid var(--border-secondary)",
                                color:
                                  skill.proficiency === level
                                    ? "var(--fg-white)"
                                    : "var(--text-secondary)",
                              }}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Work Preferences */}
          <div
            className="rounded-xl p-6 md:p-8 border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin
                className="w-5 h-5"
                style={{ color: "var(--primary-600)" }}
              />
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Work Preferences
              </h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <Label
                    htmlFor="workType"
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Work Type
                  </Label>
                  <select
                    id="workType"
                    value={formData.workType}
                    onChange={(e) =>
                      handleInputChange("workType", e.target.value)
                    }
                    className="w-full h-11 px-3 rounded-lg border"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  >
                    <option value="">Select type</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="jobType"
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Job Type
                  </Label>
                  <select
                    id="jobType"
                    value={formData.jobType}
                    onChange={(e) =>
                      handleInputChange("jobType", e.target.value)
                    }
                    className="w-full h-11 px-3 rounded-lg border"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  >
                    <option value="">Select type</option>
                    <option value="fulltime">Full-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Preferred Location
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g., San Francisco, CA"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="h-11"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="salaryRange"
                  className="mb-3 block text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Expected Salary Range (USD/year)
                </Label>
                <div className="flex items-center gap-4">
                  <span
                    className="text-sm font-mono"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    ${formData.salaryRange[0]}k
                  </span>
                  <input
                    type="range"
                    min="30"
                    max="300"
                    step="10"
                    value={formData.salaryRange[0]}
                    onChange={(e) =>
                      handleInputChange("salaryRange", [
                        parseInt(e.target.value),
                        formData.salaryRange[1],
                      ])
                    }
                    className="flex-1"
                    style={{ accentColor: "var(--primary-600)" }}
                  />
                  <span
                    className="text-sm font-mono"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    ${formData.salaryRange[1]}k
                  </span>
                  <input
                    type="range"
                    min="30"
                    max="300"
                    step="10"
                    value={formData.salaryRange[1]}
                    onChange={(e) =>
                      handleInputChange("salaryRange", [
                        formData.salaryRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="flex-1"
                    style={{ accentColor: "var(--primary-600)" }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Minimum: ${formData.salaryRange[0]}k/year
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Maximum: ${formData.salaryRange[1]}k/year
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Experience & Projects */}
          <div
            className="rounded-xl p-6 md:p-8 border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe
                className="w-5 h-5"
                style={{ color: "var(--primary-600)" }}
              />
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Experience & Projects
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <Label
                  htmlFor="projectDescription"
                  className="mb-2 block text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Describe your most relevant project or experience
                </Label>
                <textarea
                  id="projectDescription"
                  rows={4}
                  placeholder="Briefly describe a project that showcases your technical skills..."
                  value={formData.projectDescription}
                  onChange={(e) =>
                    handleInputChange("projectDescription", e.target.value)
                  }
                  className="w-full px-3 py-2.5 rounded-lg border resize-none"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label
                    htmlFor="githubUrl"
                    className="mb-2 block text-sm font-medium flex items-center gap-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Github className="w-4 h-4" />
                    GitHub Profile (optional)
                  </Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    placeholder="https://github.com/username"
                    value={formData.githubUrl}
                    onChange={(e) =>
                      handleInputChange("githubUrl", e.target.value)
                    }
                    className="h-11"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="portfolioUrl"
                    className="mb-2 block text-sm font-medium flex items-center gap-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Globe className="w-4 h-4" />
                    Portfolio URL (optional)
                  </Label>
                  <Input
                    id="portfolioUrl"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolioUrl}
                    onChange={(e) =>
                      handleInputChange("portfolioUrl", e.target.value)
                    }
                    className="h-11"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4">
            {saveError && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--error-50)",
                  border: "1px solid var(--error-200)",
                  color: "var(--error-700)",
                }}
              >
                {saveError}
              </div>
            )}
            <div className="relative">
              <button
                onClick={() => setShowSkipWarning(!showSkipWarning)}
                className="text-sm font-medium hover:underline"
                style={{ color: "var(--text-tertiary)" }}
              >
                Skip for now
              </button>
              {showSkipWarning && (
                <div
                  className="absolute bottom-full left-0 mb-2 p-3 rounded-lg border w-64"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--warning-300)",
                    boxShadow: "var(--shadow-lg)",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--warning-600)" }}
                    />
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Skipping may reduce job matching accuracy
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleSaveSkills}
              disabled={!isFormValid() || isSaving}
              className="px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  isFormValid() && !isSaving
                    ? "var(--primary-600)"
                    : "var(--gray-300)",
                color: "var(--fg-white)",
                boxShadow:
                  isFormValid() && !isSaving ? "var(--shadow-xs)" : "none",
              }}
            >
              {isSaving ? "Saving..." : "Continue to Skill Evaluation"}
              {!isSaving && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
