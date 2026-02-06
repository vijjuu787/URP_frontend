import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Briefcase,
  User,
  Download,
  ExternalLink,
  CheckCircle2,
  Save,
  Github,
  FileArchive,
  File,
} from "lucide-react";

interface Assignment {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobRole: string;
  assignmentTitle: string;
  assignmentDescription: string;
  submissionDate: string;
  submissionFiles: {
    name: string;
    url: string;
    type: "code" | "pdf" | "design" | "github" | "zip";
  }[];
  status: "pending" | "in-review" | "reviewed";
  score?: number;
  feedback?: string;
  codeQuality?: number;
  problemSolving?: number;
  bestPractices?: number;
}

interface ReviewScreenProps {
  assignment: Assignment;
  onBack: () => void;
  onSubmitReview: (
    assignmentId: string,
    score: number,
    feedback: string,
    codeQuality: number,
    problemSolving: number,
    bestPractices: number
  ) => void;
}

export function ReviewScreen({ assignment, onBack, onSubmitReview }: ReviewScreenProps) {
  const [score, setScore] = useState(assignment.score || 0);
  const [codeQuality, setCodeQuality] = useState(assignment.codeQuality || 0);
  const [problemSolving, setProblemSolving] = useState(assignment.problemSolving || 0);
  const [bestPractices, setBestPractices] = useState(assignment.bestPractices || 0);
  const [feedback, setFeedback] = useState(assignment.feedback || "");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const isReviewed = assignment.status === "reviewed";

  // Auto-calculate total score based on ratings
  const calculateTotalScore = (cq: number, ps: number, bp: number) => {
    return Math.round((cq + ps + bp) / 3);
  };

  const handleCodeQualityChange = (value: number) => {
    setCodeQuality(value);
    setScore(calculateTotalScore(value, problemSolving, bestPractices));
  };

  const handleProblemSolvingChange = (value: number) => {
    setProblemSolving(value);
    setScore(calculateTotalScore(codeQuality, value, bestPractices));
  };

  const handleBestPracticesChange = (value: number) => {
    setBestPractices(value);
    setScore(calculateTotalScore(codeQuality, problemSolving, value));
  };

  const handleSubmit = () => {
    onSubmitReview(assignment.id, score, feedback, codeQuality, problemSolving, bestPractices);
    setShowSuccessMessage(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "github":
        return <Github className="w-4 h-4" />;
      case "zip":
        return <FileArchive className="w-4 h-4" />;
      case "pdf":
        return <File className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div
      className="flex-1 flex flex-col h-screen overflow-hidden"
      style={{
        backgroundColor: "var(--gray-50)",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Header */}
      <div
        className="border-b"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-secondary)",
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
            </button>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {assignment.assignmentTitle}
              </h1>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Review candidate submission
              </p>
            </div>
            {isReviewed && (
              <div
                className="px-4 py-2 rounded-lg flex items-center gap-2"
                style={{
                  backgroundColor: "var(--success-50)",
                  border: "1px solid var(--success-200)",
                }}
              >
                <CheckCircle2
                  className="w-5 h-5"
                  style={{ color: "var(--success-600)" }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--success-700)" }}
                >
                  Reviewed
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div
          className="mx-6 mt-4 p-4 rounded-lg border-2 flex items-center gap-3"
          style={{
            backgroundColor: "var(--success-50)",
            borderColor: "var(--success-300)",
          }}
        >
          <CheckCircle2 className="w-6 h-6" style={{ color: "var(--success-600)" }} />
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--success-700)" }}
            >
              Review Submitted Successfully!
            </p>
            <p className="text-xs" style={{ color: "var(--success-600)" }}>
              Returning to dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Assignment Details */}
        <div
          className="w-1/2 border-r overflow-auto"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-secondary)",
          }}
        >
          <div className="p-6">
            {/* Candidate Profile */}
            <div
              className="p-5 rounded-lg border mb-6"
              style={{
                backgroundColor: "var(--gray-50)",
                borderColor: "var(--border-secondary)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-4"
                style={{ color: "var(--text-tertiary)" }}
              >
                Candidate Profile
              </p>
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{
                    backgroundColor: "var(--primary-100)",
                    color: "var(--primary-700)",
                    border: "3px solid var(--primary-200)",
                  }}
                >
                  {assignment.candidateName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {assignment.candidateName}
                  </h3>
                  <p
                    className="text-sm mb-3"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {assignment.candidateEmail}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Briefcase
                        className="w-4 h-4"
                        style={{ color: "var(--text-quaternary)" }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {assignment.jobRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: "var(--text-quaternary)" }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {assignment.submissionDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Description */}
            <div className="mb-6">
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: "var(--text-tertiary)" }}
              >
                Assignment Description
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {assignment.assignmentDescription}
              </p>
            </div>

            {/* Submission Files */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: "var(--text-tertiary)" }}
              >
                Submission Files ({assignment.submissionFiles.length})
              </p>
              <div className="space-y-2">
                {assignment.submissionFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border flex items-center justify-between hover:shadow-sm transition-all"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-secondary)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "var(--primary-50)" }}
                      >
                        <span style={{ color: "var(--primary-600)" }}>
                          {getFileIcon(file.type)}
                        </span>
                      </div>
                      <div>
                        <p
                          className="text-sm font-semibold mb-0.5"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {file.name}
                        </p>
                        <p
                          className="text-xs uppercase"
                          style={{ color: "var(--text-quaternary)" }}
                        >
                          {file.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Preview"
                      >
                        <ExternalLink
                          className="w-4 h-4"
                          style={{ color: "var(--text-quaternary)" }}
                        />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Download"
                      >
                        <Download
                          className="w-4 h-4"
                          style={{ color: "var(--text-quaternary)" }}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Evaluation */}
        <div className="w-1/2 overflow-auto" style={{ backgroundColor: "var(--gray-50)" }}>
          <div className="p-6">
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-4"
              style={{ color: "var(--text-tertiary)" }}
            >
              Evaluation
            </p>

            {/* Rating Sliders */}
            <div className="space-y-6 mb-6">
              {/* Code Quality */}
              <div
                className="p-5 rounded-lg border"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-secondary)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <label
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Code Quality
                  </label>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "var(--primary-600)" }}
                  >
                    {codeQuality}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={codeQuality}
                  onChange={(e) => handleCodeQualityChange(Number(e.target.value))}
                  disabled={isReviewed}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--primary-600) 0%, var(--primary-600) ${codeQuality}%, var(--gray-200) ${codeQuality}%, var(--gray-200) 100%)`,
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs" style={{ color: "var(--text-quaternary)" }}>
                    Poor
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-quaternary)" }}>
                    Excellent
                  </span>
                </div>
              </div>

              {/* Problem Solving */}
              <div
                className="p-5 rounded-lg border"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-secondary)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <label
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Logic & Problem Solving
                  </label>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "var(--primary-600)" }}
                  >
                    {problemSolving}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={problemSolving}
                  onChange={(e) => handleProblemSolvingChange(Number(e.target.value))}
                  disabled={isReviewed}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--primary-600) 0%, var(--primary-600) ${problemSolving}%, var(--gray-200) ${problemSolving}%, var(--gray-200) 100%)`,
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs" style={{ color: "var(--text-quaternary)" }}>
                    Poor
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-quaternary)" }}>
                    Excellent
                  </span>
                </div>
              </div>

              {/* Best Practices */}
              <div
                className="p-5 rounded-lg border"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-secondary)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <label
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Best Practices
                  </label>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "var(--primary-600)" }}
                  >
                    {bestPractices}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bestPractices}
                  onChange={(e) => handleBestPracticesChange(Number(e.target.value))}
                  disabled={isReviewed}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--primary-600) 0%, var(--primary-600) ${bestPractices}%, var(--gray-200) ${bestPractices}%, var(--gray-200) 100%)`,
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs" style={{ color: "var(--text-quaternary)" }}>
                    Poor
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-quaternary)" }}>
                    Excellent
                  </span>
                </div>
              </div>
            </div>

            {/* Total Score */}
            <div
              className="p-6 rounded-lg border-2 mb-6 text-center"
              style={{
                backgroundColor: "var(--primary-50)",
                borderColor: "var(--primary-300)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: "var(--primary-700)" }}
              >
                Total Score (Average)
              </p>
              <p className="text-5xl font-bold mb-1" style={{ color: "var(--primary-700)" }}>
                {score}
              </p>
              <p className="text-sm font-medium" style={{ color: "var(--primary-600)" }}>
                out of 100
              </p>
            </div>

            {/* Feedback */}
            <div
              className="p-5 rounded-lg border mb-6"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-secondary)",
              }}
            >
              <label
                className="text-sm font-semibold mb-3 block"
                style={{ color: "var(--text-primary)" }}
              >
                Feedback & Comments
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isReviewed}
                placeholder="Provide detailed feedback on the candidate's submission..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg border text-sm resize-none"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-secondary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Action Buttons */}
            {!isReviewed && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={score === 0 || feedback.trim() === ""}
                  className="flex-1 px-6 py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--primary-600)",
                    color: "var(--fg-white)",
                  }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Submit Review
                </button>
                <button
                  className="px-6 py-3.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all hover:shadow-sm border"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-secondary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Save className="w-5 h-5" />
                  Save Draft
                </button>
              </div>
            )}

            {isReviewed && (
              <div
                className="p-4 rounded-lg border text-center"
                style={{
                  backgroundColor: "var(--success-50)",
                  borderColor: "var(--success-200)",
                }}
              >
                <CheckCircle2
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "var(--success-600)" }}
                />
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--success-700)" }}
                >
                  This assignment has been reviewed
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--success-600)" }}>
                  All evaluations are now read-only
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
