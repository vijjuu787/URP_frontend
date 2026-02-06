import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignmentData) => void;
  isLoading?: boolean;
}

export interface AssignmentData {
  title: string;
  description: string;
  difficulty: string;
  totalPoints: number;
  timeLimitHours: number;
  downloadAssets?: File;
}

export function CreateAssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateAssignmentModalProps) {
  const [formData, setFormData] = useState<AssignmentData>({
    title: "",
    description: "",
    difficulty: "Medium",
    totalPoints: 500,
    timeLimitHours: 48,
    downloadAssets: undefined,
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    field: string,
    value: string | number | File | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        downloadAssets: e.target.files![0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation - check each required field
    const missingFields: string[] = [];

    if (!formData.title) missingFields.push("Title");
    if (!formData.description) missingFields.push("Description");
    if (formData.totalPoints <= 0) missingFields.push("Total Points");
    if (formData.timeLimitHours <= 0) missingFields.push("Time Limit Hours");

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
            Create Assignment
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

          {/* Title */}
          <div>
            <Label style={{ color: "var(--text-secondary)" }}>
              Assignment Title *
            </Label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Buffer Overflow Analysis"
              className="h-11 mt-1"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Description */}
          <div>
            <Label style={{ color: "var(--text-secondary)" }}>
              Description *
            </Label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter a detailed assignment description..."
              rows={6}
              className="w-full p-3 rounded-lg border mt-1"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Difficulty & Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Total Points *
              </Label>
              <Input
                type="number"
                value={formData.totalPoints}
                onChange={(e) =>
                  handleInputChange("totalPoints", parseInt(e.target.value))
                }
                placeholder="e.g., 500"
                className="h-11 mt-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {/* Time Limit */}
          <div>
            <Label style={{ color: "var(--text-secondary)" }}>
              Time Limit (Hours) *
            </Label>
            <Input
              type="number"
              value={formData.timeLimitHours}
              onChange={(e) =>
                handleInputChange("timeLimitHours", parseInt(e.target.value))
              }
              placeholder="e.g., 48"
              className="h-11 mt-1"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* File Upload */}
          <div>
            <Label style={{ color: "var(--text-secondary)" }}>
              Download Assets (Optional)
            </Label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer mt-2"
              style={{
                borderColor: "var(--border-primary)",
                backgroundColor: "var(--gray-50)",
              }}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {formData.downloadAssets ? (
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {formData.downloadAssets.name}
                  </p>
                ) : (
                  <>
                    <p
                      className="text-sm mb-1 font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Drop your assets file here
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-quaternary)" }}
                    >
                      or click to browse
                    </p>
                  </>
                )}
              </label>
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
              {isLoading ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
