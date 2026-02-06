import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChallengeData) => void;
  isLoading?: boolean;
  onOpenAssignment?: () => void;
}

export interface ChallengeData {
  title: string;
  company: string;
  logo: string;
  location: string;
  workType: string;
  jobType: string;
  salary: string;
  experience: string;
  difficulty: string;
  tags: string[];
  description: string;
  requirements: string[];
  responsibilities: string[];
}

export function CreateChallengeModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  onOpenAssignment,
}: CreateChallengeModalProps) {
  const [formData, setFormData] = useState<ChallengeData>({
    title: "",
    company: "",
    logo: "",
    location: "",
    workType: "Remote",
    jobType: "Full-time",
    salary: "",
    experience: "",
    difficulty: "Medium",
    tags: [],
    description: "",
    requirements: [],
    responsibilities: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [
          ...prev.responsibilities,
          responsibilityInput.trim(),
        ],
      }));
      setResponsibilityInput("");
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation - check each required field and provide specific feedback
    const missingFields: string[] = [];

    if (!formData.title) missingFields.push("Job Title");
    if (!formData.company) missingFields.push("Company Name");
    if (!formData.location) missingFields.push("Location");
    if (!formData.salary) missingFields.push("Salary Range");
    if (!formData.experience) missingFields.push("Experience Level");
    if (!formData.description) missingFields.push("Job Description");
    if (formData.tags.length === 0)
      missingFields.push("at least one Skill/Tag");
    if (formData.requirements.length === 0)
      missingFields.push("at least one Requirement");
    if (formData.responsibilities.length === 0)
      missingFields.push("at least one Responsibility");

    if (missingFields.length > 0) {
      setError(
        `Please fill in all required fields: ${missingFields.join(", ")}`,
      );
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-primary)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b z-10"
          style={{
            borderColor: "var(--border-primary)",
            backgroundColor: "var(--bg-primary)",
          }}
        >
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Create Challenge
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div
              className="p-4 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--error-50)",
                border: "1px solid var(--error-200)",
                color: "var(--error-700)",
              }}
            >
              {error}
            </div>
          )}

          {/* Job Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Job Title *
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Backend Engineer"
                className="h-11 mt-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Company Name *
              </Label>
              <Input
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="e.g., DataStream Analytics"
                className="h-11 mt-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {/* Logo & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Company Logo (2 letters) *
              </Label>
              <Input
                value={formData.logo}
                onChange={(e) =>
                  handleInputChange(
                    "logo",
                    e.target.value.toUpperCase().slice(0, 2),
                  )
                }
                placeholder="e.g., DS"
                maxLength={2}
                className="h-11 mt-1 uppercase"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Location *
              </Label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Seattle, WA"
                className="h-11 mt-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {/* Work Type & Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Work Type *
              </Label>
              <select
                value={formData.workType}
                onChange={(e) => handleInputChange("workType", e.target.value)}
                className="w-full h-11 px-3 rounded-lg border mt-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Job Type *
              </Label>
              <select
                value={formData.jobType}
                onChange={(e) => handleInputChange("jobType", e.target.value)}
                className="w-full h-11 px-3 rounded-lg border mt-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Salary & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Salary Range *
              </Label>
              <Input
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                placeholder="e.g., $110k - $150k"
                className="h-11 mt-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Experience Level *
              </Label>
              <Input
                value={formData.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
                placeholder="e.g., 3-5 years"
                className="h-11 mt-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Difficulty Level *
              </Label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  handleInputChange("difficulty", e.target.value)
                }
                className="w-full h-11 px-3 rounded-lg border mt-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Assignment Section *
              </Label>
              <div
                className="w-full h-11 px-3 rounded-lg border mt-1 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
                onClick={() => {
                  if (onOpenAssignment) {
                    onOpenAssignment();
                  }
                }}
              >
                Assignment
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label style={{ color: "var(--text-secondary)" }}>
              Job Description *
            </Label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter a detailed job description..."
              rows={4}
              className="w-full p-3 rounded-lg border mt-1"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <Label style={{ color: "var(--text-secondary)" }}>
              Skills/Tags *
            </Label>
            <div className="flex gap-2 mt-2 mb-3">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add a skill (e.g., Python, AWS)"
                className="h-10 flex-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
              <Button
                type="button"
                onClick={addTag}
                className="px-4"
                style={{
                  backgroundColor: "var(--primary-600)",
                  color: "var(--fg-white)",
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--primary-50)",
                    color: "var(--primary-700)",
                    border: "1px solid var(--primary-200)",
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(idx)}
                    className="hover:opacity-70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <Label style={{ color: "var(--text-secondary)" }}>
              Requirements *
            </Label>
            <div className="flex gap-2 mt-2 mb-3">
              <Input
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addRequirement())
                }
                placeholder="Add a requirement"
                className="h-10 flex-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
              <Button
                type="button"
                onClick={addRequirement}
                className="px-4"
                style={{
                  backgroundColor: "var(--primary-600)",
                  color: "var(--fg-white)",
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    backgroundColor: "var(--gray-50)",
                    border: "1px solid var(--border-secondary)",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(idx)}
                    className="p-1 hover:bg-gray-200 rounded transition"
                  >
                    <X
                      className="w-4 h-4"
                      style={{ color: "var(--text-secondary)" }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <Label style={{ color: "var(--text-secondary)" }}>
              Responsibilities *
            </Label>
            <div className="flex gap-2 mt-2 mb-3">
              <Input
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addResponsibility())
                }
                placeholder="Add a responsibility"
                className="h-10 flex-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
              <Button
                type="button"
                onClick={addResponsibility}
                className="px-4"
                style={{
                  backgroundColor: "var(--primary-600)",
                  color: "var(--fg-white)",
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.responsibilities.map((resp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    backgroundColor: "var(--gray-50)",
                    border: "1px solid var(--border-secondary)",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>{resp}</span>
                  <button
                    type="button"
                    onClick={() => removeResponsibility(idx)}
                    className="p-1 hover:bg-gray-200 rounded transition"
                  >
                    <X
                      className="w-4 h-4"
                      style={{ color: "var(--text-secondary)" }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex gap-3 justify-end pt-6 border-t"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-lg font-semibold"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-primary)",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              style={{
                backgroundColor: "var(--primary-600)",
                color: "var(--fg-white)",
              }}
            >
              {isLoading ? "Creating..." : "Create Challenge"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
