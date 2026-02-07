import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Eye,
  Download,
  Calendar,
  AlertTriangle,
  Upload,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { AssignmentTimeout } from "./assignment-timeout";
import { apiCall } from "../utils/api";
import { API_BASE_URL } from "../../config/api";

interface SubmissionFile {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

interface Review {
  id: string;
  codeQualityScore: number;
  logicProblemSolvingScore: number;
  bestPracticesScore: number;
  totalScore: number;
  feedback: string;
  status: string;
  recommendation: string;
  reviewedAt: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  difficulty: "Expert" | "Hard" | "Medium";
  totalPoints: number;
  timeLimitHours: number;
}

interface JobPosting {
  id: string;
  title: string;
  description: string;
  roleType: string;
  requirements: string[];
  points: number;
}

interface BackendSubmission {
  id: string;
  candidateId: string;
  assignmentId: string;
  assignmentStartedAt: string;
  submittedAt: string | null;
  timeTakenMinutes: number | null;
  deadline: string | null;
  status:
    | "NOT_STARTED"
    | "PENDING"
    | "UNDER_REVIEW"
    | "REVIEWED"
    | "ACCEPTED"
    | "REJECTED"
    | "EXPIRED";
  candidateNotes: string | null;
  createdAt: string;
  updatedAt: string;
  submissionFiles: SubmissionFile[];
  reviews: Review[];
  candidate: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface Submission {
  id: string;
  challengeTitle: string;
  submittedAt: string;
  status:
    | "accepted"
    | "rejected"
    | "pending"
    | "not-submitted"
    | "expired"
    | "under-review";
  points: number;
  flag?: string;
  feedback?: string;
  difficulty: "Expert" | "Hard" | "Medium";
  deadline?: Date;
  hasDeadline?: boolean;
}

interface SubmissionsPageProps {
  candidateId?: string;
}

export function SubmissionsPage({ candidateId }: SubmissionsPageProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch submissions from backend
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!candidateId) {
        console.warn("[SUBMISSIONS_PAGE] No candidateId provided");
        setIsLoading(false);
        return;
      }

      try {
        console.log(
          "[SUBMISSIONS_PAGE] Fetching submissions for candidate:",
          candidateId,
        );
        setIsLoading(true);
        setError(null);

        const data = await apiCall<{ data: BackendSubmission[] }>(
          `${API_BASE_URL}/api/assignment/submissions/candidate/${candidateId}`,
          {
            method: "GET",
          },
        );

        console.log("[SUBMISSIONS_PAGE] Received submissions:", data);

        // Transform backend data to frontend format
        const transformedSubmissions: Submission[] = data.data.map(
          (submission) => {
            // Map backend status to frontend status
            const statusMap: Record<string, Submission["status"]> = {
              NOT_STARTED: "not-submitted",
              PENDING: "not-submitted",
              UNDER_REVIEW: "pending",
              REVIEWED: "pending",
              ACCEPTED: "accepted",
              REJECTED: "rejected",
              EXPIRED: "expired",
            };

            const mappedStatus =
              statusMap[submission.status] || "not-submitted";

            return {
              id: submission.id,
              challengeTitle: submission.candidateNotes || "Assignment",
              submittedAt: submission.submittedAt
                ? new Date(submission.submittedAt).toLocaleString()
                : "",
              status: mappedStatus,
              points: 0, // Points not in the backend submission model
              flag: submission.candidateNotes || undefined,
              feedback: submission.reviews?.[0]?.feedback || undefined,
              difficulty: "Medium" as const, // Default difficulty
              deadline: submission.deadline
                ? new Date(submission.deadline)
                : undefined,
              hasDeadline: !!submission.deadline,
            } as Submission;
          },
        );

        setSubmissions(transformedSubmissions);
      } catch (err) {
        console.error("[SUBMISSIONS_PAGE] Error fetching submissions:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch submissions",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [candidateId]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          label: "Accepted",
          color: "var(--success-700)",
          bgColor: "var(--success-50)",
          borderColor: "var(--success-300)",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-5 h-5" />,
          label: "Rejected",
          color: "var(--error-700)",
          bgColor: "var(--error-50)",
          borderColor: "var(--error-300)",
        };
      case "pending":
        return {
          icon: <Clock className="w-5 h-5" />,
          label: "Under Review",
          color: "var(--warning-700)",
          bgColor: "var(--warning-50)",
          borderColor: "var(--warning-300)",
        };
      case "not-submitted":
        return {
          icon: <Upload className="w-5 h-5" />,
          label: "Not Submitted",
          color: "var(--primary-700)",
          bgColor: "var(--primary-50)",
          borderColor: "var(--primary-200)",
        };
      case "expired":
        return {
          icon: <XCircle className="w-5 h-5" />,
          label: "Expired",
          color: "var(--error-700)",
          bgColor: "var(--error-50)",
          borderColor: "var(--error-300)",
        };
      default:
        return {
          icon: null,
          label: status,
          color: "var(--text-secondary)",
          bgColor: "transparent",
          borderColor: "var(--border-primary)",
        };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Expert":
        return "var(--error-600)";
      case "Hard":
        return "var(--warning-500)";
      case "Medium":
        return "var(--primary-600)";
      default:
        return "var(--success-600)";
    }
  };

  const handleTimeout = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              status: "expired" as const,
              feedback:
                "Assignment expired. Deadline was exceeded without submission.",
            }
          : sub,
      ),
    );
  };

  const handleReset = (submissionId: string) => {
    // Reset the assignment with a new deadline (48 hours from now)
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              status: "not-submitted" as const,
              deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
              feedback: undefined,
            }
          : sub,
      ),
    );
  };

  const stats = {
    total: submissions.length,
    accepted: submissions.filter((s) => s.status === "accepted").length,
    pending: submissions.filter((s) => s.status === "pending").length,
    notSubmitted: submissions.filter((s) => s.status === "not-submitted")
      .length,
    expired: submissions.filter((s) => s.status === "expired").length,
  };

  return (
    <div
      className="flex-1 min-h-screen overflow-y-auto"
      style={{
        backgroundColor: "var(--bg-secondary)",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Header */}
      <div
        className="px-8 py-6"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-secondary)",
        }}
      >
        <h1
          className="text-3xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          My Submissions
        </h1>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          Track your challenge submissions and review feedback
        </p>
      </div>

      <div className="p-8">
        {/* Error State */}
        {error && (
          <div
            className="rounded-lg p-6 mb-8"
            style={{
              backgroundColor: "var(--error-50)",
              border: "1px solid var(--error-200)",
            }}
          >
            <p
              className="text-base font-semibold"
              style={{ color: "var(--error-700)" }}
            >
              Error loading submissions
            </p>
            <p style={{ color: "var(--error-600)" }} className="text-sm mt-2">
              {error}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div
              className="text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              <div className="mb-4">
                <div
                  className="w-12 h-12 rounded-full mx-auto animate-spin"
                  style={{
                    borderWidth: "3px",
                    borderColor: "var(--primary-200)",
                    borderTopColor: "var(--primary-600)",
                  }}
                />
              </div>
              <p className="font-medium">Loading your submissions...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div
                className="rounded-lg p-5"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Total
                    </p>
                    <p
                      className="text-3xl font-semibold"
                      style={{
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-code)",
                      }}
                    >
                      {stats.total}
                    </p>
                  </div>
                  <FileText
                    className="w-8 h-8"
                    style={{ color: "var(--primary-300)", opacity: 0.5 }}
                  />
                </div>
              </div>

              <div
                className="rounded-lg p-5"
                style={{
                  backgroundColor: "var(--success-50)",
                  border: "1px solid var(--success-200)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "var(--success-700)" }}
                    >
                      Accepted
                    </p>
                    <p
                      className="text-3xl font-semibold"
                      style={{
                        color: "var(--success-700)",
                        fontFamily: "var(--font-code)",
                      }}
                    >
                      {stats.accepted}
                    </p>
                  </div>
                  <CheckCircle2
                    className="w-8 h-8"
                    style={{ color: "var(--success-600)", opacity: 0.5 }}
                  />
                </div>
              </div>

              <div
                className="rounded-lg p-5"
                style={{
                  backgroundColor: "var(--warning-50)",
                  border: "1px solid var(--warning-200)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "var(--warning-700)" }}
                    >
                      Pending
                    </p>
                    <p
                      className="text-3xl font-semibold"
                      style={{
                        color: "var(--warning-700)",
                        fontFamily: "var(--font-code)",
                      }}
                    >
                      {stats.pending}
                    </p>
                  </div>
                  <Clock
                    className="w-8 h-8"
                    style={{ color: "var(--warning-600)", opacity: 0.5 }}
                  />
                </div>
              </div>

              <div
                className="rounded-lg p-5"
                style={{
                  backgroundColor: "var(--primary-50)",
                  border: "1px solid var(--primary-200)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "var(--primary-700)" }}
                    >
                      Not Submitted
                    </p>
                    <p
                      className="text-3xl font-semibold"
                      style={{
                        color: "var(--primary-700)",
                        fontFamily: "var(--font-code)",
                      }}
                    >
                      {stats.notSubmitted}
                    </p>
                  </div>
                  <Upload
                    className="w-8 h-8"
                    style={{ color: "var(--primary-600)", opacity: 0.5 }}
                  />
                </div>
              </div>

              <div
                className="rounded-lg p-5"
                style={{
                  backgroundColor: "var(--error-50)",
                  border: "1px solid var(--error-200)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "var(--error-700)" }}
                    >
                      Expired
                    </p>
                    <p
                      className="text-3xl font-semibold"
                      style={{
                        color: "var(--error-700)",
                        fontFamily: "var(--font-code)",
                      }}
                    >
                      {stats.expired}
                    </p>
                  </div>
                  <AlertTriangle
                    className="w-8 h-8"
                    style={{ color: "var(--error-600)", opacity: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-6">
              {submissions.map((submission) => {
                const statusConfig = getStatusConfig(submission.status);

                return (
                  <div key={submission.id}>
                    {/* Timeout Warning for Active Assignments */}
                    {submission.hasDeadline &&
                      submission.deadline &&
                      (submission.status === "not-submitted" ||
                        submission.status === "expired") && (
                        <AssignmentTimeout
                          assignmentTitle={submission.challengeTitle}
                          deadline={submission.deadline}
                          onTimeout={() => handleTimeout(submission.id)}
                          onReset={
                            submission.status === "expired"
                              ? () => handleReset(submission.id)
                              : undefined
                          }
                        />
                      )}

                    {/* Submission Card */}
                    {submission.status !== "expired" && (
                      <div
                        className="rounded-lg overflow-hidden transition-all hover:shadow-lg"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          border: `1px solid ${statusConfig.borderColor}`,
                          boxShadow: "var(--shadow-sm)",
                        }}
                      >
                        {/* Main Content */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              {/* Title and Badges */}
                              <div className="flex items-center gap-3 mb-3">
                                <h3
                                  className="text-lg font-semibold"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {submission.challengeTitle}
                                </h3>
                                <span
                                  className="px-2.5 py-1 rounded-md text-xs font-semibold"
                                  style={{
                                    backgroundColor: getDifficultyColor(
                                      submission.difficulty,
                                    ),
                                    color: "var(--fg-white)",
                                  }}
                                >
                                  {submission.difficulty}
                                </span>
                              </div>

                              {/* Metadata */}
                              <div className="flex items-center gap-6 text-sm mb-4">
                                {submission.submittedAt && (
                                  <div className="flex items-center gap-2">
                                    <Calendar
                                      className="w-4 h-4"
                                      style={{
                                        color: "var(--text-quaternary)",
                                      }}
                                    />
                                    <span
                                      style={{ color: "var(--text-tertiary)" }}
                                    >
                                      {submission.submittedAt}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <span
                                    style={{ color: "var(--text-tertiary)" }}
                                  >
                                    Points:{" "}
                                    <span
                                      style={{
                                        color: "var(--primary-600)",
                                        fontFamily: "var(--font-code)",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {submission.points}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              {/* Flag */}
                              {submission.flag && (
                                <div className="flex items-center gap-3 mb-4">
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: "var(--text-tertiary)" }}
                                  >
                                    Submitted Flag:
                                  </span>
                                  <code
                                    className="px-3 py-1.5 rounded-md text-sm"
                                    style={{
                                      backgroundColor: "var(--gray-100)",
                                      color: "var(--success-700)",
                                      fontFamily: "var(--font-code)",
                                      border: "1px solid var(--success-200)",
                                    }}
                                  >
                                    {submission.flag}
                                  </code>
                                </div>
                              )}

                              {/* Feedback */}
                              {submission.feedback && (
                                <div
                                  className="rounded-lg p-4 mt-4"
                                  style={{
                                    backgroundColor: statusConfig.bgColor,
                                    border: `1px solid ${statusConfig.borderColor}`,
                                  }}
                                >
                                  <p
                                    className="text-sm font-semibold mb-1"
                                    style={{ color: statusConfig.color }}
                                  >
                                    Feedback
                                  </p>
                                  <p
                                    className="text-sm"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    {submission.feedback}
                                  </p>
                                </div>
                              )}

                              {/* Not Submitted Message */}
                              {submission.status === "not-submitted" && (
                                <div
                                  className="rounded-lg p-4 mt-4"
                                  style={{
                                    backgroundColor: statusConfig.bgColor,
                                    border: `1px solid ${statusConfig.borderColor}`,
                                  }}
                                >
                                  <p
                                    className="text-sm font-semibold mb-1"
                                    style={{ color: statusConfig.color }}
                                  >
                                    ⏳ Awaiting Submission
                                  </p>
                                  <p
                                    className="text-sm"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    Complete and submit this assignment before
                                    the deadline to earn your points.
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Status Badge */}
                            <div
                              className="px-4 py-2 rounded-lg flex items-center gap-2"
                              style={{
                                backgroundColor: statusConfig.bgColor,
                                border: `1px solid ${statusConfig.borderColor}`,
                              }}
                            >
                              <span style={{ color: statusConfig.color }}>
                                {statusConfig.icon}
                              </span>
                              <span
                                className="font-semibold text-sm"
                                style={{ color: statusConfig.color }}
                              >
                                {statusConfig.label}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div
                            className="flex items-center gap-3 pt-4"
                            style={{
                              borderTop: "1px solid var(--border-secondary)",
                            }}
                          >
                            {submission.status === "not-submitted" ? (
                              <Button
                                className="rounded-lg px-4 py-2.5 flex items-center gap-2 transition-all hover:opacity-90 font-semibold text-sm"
                                style={{
                                  backgroundColor: "var(--primary-600)",
                                  color: "var(--fg-white)",
                                  border: "none",
                                  boxShadow: "var(--shadow-xs)",
                                }}
                              >
                                <Send className="w-4 h-4" />
                                Submit Assignment
                              </Button>
                            ) : (
                              <>
                                <Button
                                  className="rounded-lg px-4 py-2.5 flex items-center gap-2 transition-all hover:opacity-90 font-semibold text-sm"
                                  style={{
                                    backgroundColor: "var(--primary-600)",
                                    color: "var(--fg-white)",
                                    border: "none",
                                    boxShadow: "var(--shadow-xs)",
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </Button>
                                <Button
                                  variant="outline"
                                  className="rounded-lg px-4 py-2.5 flex items-center gap-2 transition-all hover:bg-gray-50 font-semibold text-sm"
                                  style={{
                                    backgroundColor: "var(--bg-primary)",
                                    border: "1px solid var(--border-primary)",
                                    color: "var(--text-secondary)",
                                    boxShadow: "var(--shadow-xs)",
                                  }}
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {submissions.length === 0 && (
              <div className="text-center py-16">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "var(--gray-100)" }}
                >
                  <FileText
                    className="w-10 h-10"
                    style={{ color: "var(--text-quaternary)" }}
                  />
                </div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  No submissions yet
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  Start a challenge to submit your first proof of work!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
