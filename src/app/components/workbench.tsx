import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Download,
  Upload,
  Flag,
  CheckCircle2,
  Terminal,
  Timer,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { apiCall } from "../utils/api";
import { API_BASE_URL } from "../../config/api";
import type { Challenge } from "./skill-validation";

interface WorkbenchProps {
  challengeId: string;
  challenge: Challenge;
  candidateId?: string;
  timerStartTime?: number;
  onBack: () => void;
}

export function Workbench({
  challengeId,
  challenge,
  candidateId,
  timerStartTime,
  onBack,
}: WorkbenchProps) {
  const [flag, setFlag] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<string>("");

  // Timer logic - updates every second when challenge timer is active
  useEffect(() => {
    if (!timerStartTime) return;

    const updateTimer = () => {
      const elapsed = Date.now() - timerStartTime;
      const totalTime = 48 * 60 * 60 * 1000; // 48 hours in milliseconds (2 days)
      const remaining = Math.max(0, totalTime - elapsed);

      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

      setElapsedTime(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [timerStartTime]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!flag || !file) {
        console.error("[WORKBENCH] Flag and file are required for submission");
        return;
      }

      if (!candidateId || !challengeId) {
        console.error("[WORKBENCH] Missing candidateId or challengeId");
        return;
      }

      setIsSubmitted(true);

      // Calculate time taken in minutes
      const timeTakenMinutes = timerStartTime
        ? Math.floor((Date.now() - timerStartTime) / (1000 * 60))
        : null;

      // Prepare submission data
      const submissionData = {
        candidateId,
        assignmentId: challengeId,
        submittedAt: new Date().toISOString(),
        timeTakenMinutes,
        status: "UNDER_REVIEW",
        candidateNotes: flag, // Store the flag as candidate notes
      };

      console.log("[WORKBENCH] Submitting assignment:", submissionData);

      // Make API call to update assignment submission
      const result = await apiCall<any>(
        `${API_BASE_URL}/api/assignment/submissions`,
        {
          method: "POST",
          body: JSON.stringify(submissionData),
        },
      );

      console.log("[WORKBENCH] Submission successful:", result);

      // Show success message for 2 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        // Optionally navigate back or show success toast
      }, 2000);
    } catch (error) {
      console.error("[WORKBENCH] Error submitting assignment:", error);
      setIsSubmitted(false);
      // Show error message to user (could use toast notification)
      alert(
        `Submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <div
      className="flex-1 min-h-screen flex h-screen overflow-hidden"
      style={{
        backgroundColor: "var(--bg-secondary)",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Documentation Panel */}
      <div
        className="flex-1 overflow-y-auto h-screen"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderRight: "1px solid var(--border-secondary)",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center gap-4"
          style={{ borderBottom: "1px solid var(--border-secondary)" }}
        >
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all"
            style={{
              backgroundColor: "var(--gray-50)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <ArrowLeft
              className="w-5 h-5"
              style={{ color: "var(--text-primary)" }}
            />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {challenge.title}
              </h2>
              <code
                className="px-2.5 py-1 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: "var(--gray-100)",
                  color: "var(--primary-700)",
                  fontFamily: "var(--font-code)",
                }}
              >
                {challenge.category}
              </code>
              <span
                className="px-2.5 py-1 rounded-md text-xs font-semibold"
                style={{
                  backgroundColor: "var(--error-600)",
                  color: "var(--fg-white)",
                }}
              >
                {challenge.difficulty}
              </span>
              {timerStartTime && elapsedTime && (
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5"
                  style={{
                    backgroundColor: "var(--primary-100)",
                    color: "var(--primary-700)",
                    border: "1px solid var(--primary-300)",
                  }}
                >
                  <Timer className="w-3.5 h-3.5" />
                  {elapsedTime}
                </span>
              )}
            </div>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              <span
                style={{
                  color: "var(--primary-600)",
                  fontFamily: "var(--font-code)",
                  fontWeight: 600,
                }}
              >
                {challenge.estimatedTime}
              </span>{" "}
              estimated time
            </p>
          </div>
        </div>

        {/* Documentation Content */}
        <div className="p-6">
          <div
            className="prose max-w-none"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-inter)",
            }}
          >
            <div
              className="whitespace-pre-wrap"
              style={{ color: "var(--text-secondary)" }}
            >
              <h2
                className="text-2xl font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Challenge Description
              </h2>
              <p className="mb-4">{challenge.description}</p>

              <h3
                className="text-lg font-semibold mt-4 mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Objective
              </h3>
              <p className="mb-4">{challenge.objective}</p>

              <h3
                className="text-lg font-semibold mt-4 mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {challenge.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-sm"
                    style={{
                      backgroundColor: "var(--gray-100)",
                      color: "var(--primary-700)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <h3
                className="text-lg font-semibold mt-4 mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Skills Being Validated
              </h3>
              <ul className="list-disc list-inside mb-4">
                {challenge.validatesSkills.map((skill, idx) => (
                  <li key={idx} style={{ color: "var(--text-secondary)" }}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Panel */}
      <div
        className="w-96 h-screen flex flex-col overflow-hidden"
        style={{ backgroundColor: "var(--gray-50)" }}
      >
        {/* Panel Header */}
        <div
          className="px-6 py-4 flex-shrink-0"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderBottom: "1px solid var(--border-secondary)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Terminal
              className="w-5 h-5"
              style={{ color: "var(--primary-600)" }}
            />
            <h3
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Submission Panel
            </h3>
          </div>
          <p className="text-xs" style={{ color: "var(--text-quaternary)" }}>
            Submit your proof of work
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Download Section */}
          <div
            className="p-6"
            style={{ borderBottom: "1px solid var(--border-secondary)" }}
          >
            <Label
              className="block mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Challenge Files
            </Label>
            <Button
              className="w-full h-11 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all hover:bg-gray-100"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
                boxShadow: "var(--shadow-xs)",
              }}
              onClick={async () => {
                try {
                  // Use challengeId as jobId for the API call
                  const token = localStorage.getItem("token");
                  const response = await fetch(
                    `${API_BASE_URL}/api/assignments/job/${challengeId}`,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    },
                  );
                  if (!response.ok) {
                    throw new Error("Failed to fetch assignment assets");
                  }
                  const data = await response.json();
                  if (!data.downloadAssets) {
                    throw new Error("No assets available for download");
                  }

                  let blob: Blob;
                  // Check if downloadAssets is base64 string or Uint8Array
                  if (typeof data.downloadAssets === "string") {
                    try {
                      // Try to decode as base64
                      const byteCharacters = atob(data.downloadAssets);
                      const byteNumbers = new Array(byteCharacters.length);
                      for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                      }
                      const byteArray = new Uint8Array(byteNumbers);
                      blob = new Blob([byteArray]);
                    } catch {
                      // If base64 fails, treat as plain text
                      blob = new Blob([data.downloadAssets]);
                    }
                  } else {
                    // Assume it's already binary data
                    blob = new Blob([data.downloadAssets]);
                  }

                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = data.job?.title
                    ? `${data.job.title}-assets.zip`
                    : "assets.zip";
                  document.body.appendChild(a);
                  a.click();
                  setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }, 100);
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Download failed");
                }
              }}
            >
              <Download className="w-4 h-4" />
              Download Assets
            </Button>
            <p
              className="text-xs mt-2"
              style={{ color: "var(--text-quaternary)" }}
            >
              Includes source code, binaries, and test data
            </p>
          </div>

          {/* Flag Input */}
          <div
            className="p-6"
            style={{ borderBottom: "1px solid var(--border-secondary)" }}
          >
            <Label
              htmlFor="flag"
              className="block mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Enter Flag
            </Label>
            <div className="relative">
              <Flag
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--text-quaternary)" }}
              />
              <Input
                id="flag"
                type="text"
                placeholder="CR_{...}"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="pl-10 h-11"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-code)",
                  boxShadow: "var(--shadow-xs)",
                }}
              />
            </div>
            <p
              className="text-xs mt-2"
              style={{ color: "var(--text-quaternary)" }}
            >
              Format: CR_&#123;YOUR_FLAG_HERE&#125;
            </p>
          </div>

          {/* File Upload */}
          <div className="p-6">
            <Label
              className="block mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Proof of Work
            </Label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary-300 transition-all"
              style={{
                borderColor: "var(--border-primary)",
                backgroundColor: "var(--bg-primary)",
              }}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".py,.diff,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "var(--text-quaternary)" }}
                />
                {file ? (
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {file.name}
                  </p>
                ) : (
                  <>
                    <p
                      className="text-sm mb-1 font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Drop your patch.diff here
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
            <p
              className="text-xs mt-2"
              style={{ color: "var(--text-quaternary)" }}
            >
              Accepted: .py, .diff, .txt
            </p>
          </div>
        </div>

        {/* Submit Button - Fixed at bottom */}
        <div
          className="p-6 flex-shrink-0"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderTop: "1px solid var(--border-secondary)",
          }}
        >
          <Button
            onClick={handleSubmit}
            disabled={!flag || !file}
            className="w-full h-11 rounded-lg flex items-center justify-center gap-2 font-semibold"
            style={{
              backgroundColor: isSubmitted
                ? "var(--success-600)"
                : "var(--primary-600)",
              color: "var(--fg-white)",
              opacity: !flag || !file ? 0.5 : 1,
              boxShadow: "var(--shadow-xs)",
            }}
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submitted!
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Submit Solution
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
