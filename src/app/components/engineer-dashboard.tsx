import { useState } from "react";
import {
  FileText,
  Calendar,
  Briefcase,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Search,
  SlidersHorizontal,
  Award,
  TrendingUp,
} from "lucide-react";
import { ReviewScreen } from "./review-screen";

interface Assignment {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobRole: "Frontend Engineer" | "Backend Engineer" | "Full Stack Engineer";
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

const mockAssignments: Assignment[] = [
  {
    id: "a1",
    candidateName: "Sarah Chen",
    candidateEmail: "sarah.chen@email.com",
    jobRole: "Frontend Engineer",
    assignmentTitle: "React Component Library",
    assignmentDescription:
      "Build a reusable component library with React and TypeScript. Include at least 5 commonly used components (Button, Input, Card, Modal, Dropdown) with proper TypeScript types, accessibility features, and Storybook documentation.",
    submissionDate: "2026-01-14 10:30 AM",
    submissionFiles: [
      { name: "component-library.zip", url: "#", type: "zip" },
      { name: "README.md", url: "#", type: "code" },
      { name: "storybook-demo.pdf", url: "#", type: "pdf" },
    ],
    status: "pending",
  },
  {
    id: "a2",
    candidateName: "Michael Rodriguez",
    candidateEmail: "m.rodriguez@email.com",
    jobRole: "Backend Engineer",
    assignmentTitle: "API Rate Limiting System",
    assignmentDescription:
      "Implement a robust rate limiting system for a RESTful API using Redis. The solution should handle distributed systems, provide configurable limits per endpoint, and include proper error responses with retry-after headers.",
    submissionDate: "2026-01-13 02:15 PM",
    submissionFiles: [
      { name: "rate-limiter.js", url: "#", type: "code" },
      { name: "architecture-diagram.pdf", url: "#", type: "pdf" },
      { name: "github.com/mrodriguez/rate-limiter", url: "#", type: "github" },
    ],
    status: "in-review",
  },
  {
    id: "a3",
    candidateName: "Emily Watson",
    candidateEmail: "e.watson@email.com",
    jobRole: "Full Stack Engineer",
    assignmentTitle: "Real-time Collaboration Tool",
    assignmentDescription:
      "Create a real-time collaborative document editor using WebSockets. Include features like live cursor tracking, collaborative editing, user presence indicators, and conflict resolution. Frontend should use React and backend should use Node.js with Socket.io.",
    submissionDate: "2026-01-12 09:45 AM",
    submissionFiles: [
      { name: "github.com/ewatson/collab-editor", url: "#", type: "github" },
      { name: "demo-video.pdf", url: "#", type: "pdf" },
      { name: "technical-writeup.pdf", url: "#", type: "pdf" },
    ],
    status: "reviewed",
    score: 92,
    codeQuality: 95,
    problemSolving: 90,
    bestPractices: 91,
    feedback:
      "Excellent implementation of WebSocket architecture. The conflict resolution algorithm is well-thought-out and handles edge cases properly. Code is clean, well-documented, and follows best practices. Great use of TypeScript for type safety.",
  },
  {
    id: "a4",
    candidateName: "James Liu",
    candidateEmail: "james.liu@email.com",
    jobRole: "Backend Engineer",
    assignmentTitle: "Database Query Optimization",
    assignmentDescription:
      "Analyze and optimize slow database queries in a PostgreSQL database. Provide explain plans, index recommendations, query refactoring, and performance benchmarks. Include before/after metrics.",
    submissionDate: "2026-01-11 04:20 PM",
    submissionFiles: [
      { name: "optimization-report.pdf", url: "#", type: "pdf" },
      { name: "optimized-queries.sql", url: "#", type: "code" },
      { name: "performance-benchmarks.pdf", url: "#", type: "pdf" },
    ],
    status: "reviewed",
    score: 88,
    codeQuality: 85,
    problemSolving: 92,
    bestPractices: 87,
    feedback:
      "Strong analytical skills demonstrated. Index recommendations were spot-on and resulted in significant performance improvements. Could improve documentation slightly.",
  },
  {
    id: "a5",
    candidateName: "Priya Sharma",
    candidateEmail: "p.sharma@email.com",
    jobRole: "Frontend Engineer",
    assignmentTitle: "Responsive Dashboard Design",
    assignmentDescription:
      "Design and implement a responsive analytics dashboard with data visualization. Must include charts (line, bar, pie), filters, export functionality, and work seamlessly on mobile, tablet, and desktop.",
    submissionDate: "2026-01-10 11:00 AM",
    submissionFiles: [
      { name: "dashboard-app.zip", url: "#", type: "zip" },
      { name: "github.com/psharma/analytics-dash", url: "#", type: "github" },
      { name: "design-mockups.pdf", url: "#", type: "pdf" },
    ],
    status: "pending",
  },
];

interface EngineerDashboardProps {
  onMenuClick?: () => void;
}

export function EngineerDashboard({ onMenuClick }: EngineerDashboardProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesRole = filterRole === "all" || assignment.jobRole === filterRole;
    const matchesStatus = filterStatus === "all" || assignment.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      assignment.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const inReviewCount = assignments.filter((a) => a.status === "in-review").length;
  const reviewedCount = assignments.filter((a) => a.status === "reviewed").length;
  const avgScore =
    assignments.filter((a) => a.score).reduce((sum, a) => sum + (a.score || 0), 0) /
      assignments.filter((a) => a.score).length || 0;

  const handleSubmitReview = (
    assignmentId: string,
    score: number,
    feedback: string,
    codeQuality: number,
    problemSolving: number,
    bestPractices: number
  ) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: "reviewed" as const,
              score,
              feedback,
              codeQuality,
              problemSolving,
              bestPractices,
            }
          : a
      )
    );
    setSelectedAssignment(null);
  };

  const handleStartReview = (assignment: Assignment) => {
    if (assignment.status === "pending") {
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignment.id ? { ...a, status: "in-review" as const } : a))
      );
    }
    setSelectedAssignment(assignment);
  };

  if (selectedAssignment) {
    return (
      <ReviewScreen
        assignment={selectedAssignment}
        onBack={() => setSelectedAssignment(null)}
        onSubmitReview={handleSubmitReview}
      />
    );
  }

  return (
    <div
      className="flex-1 overflow-auto"
      style={{
        backgroundColor: "var(--gray-50)",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Header */}
      <div
        className="border-b sticky top-0 z-10"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-secondary)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                My Assigned Assignments
              </h1>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Review and evaluate candidate submissions assigned to you
              </p>
            </div>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-secondary)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: "var(--primary-600)",
                  color: "var(--fg-white)",
                }}
              >
                DK
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  David Kim
                </p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Senior Backend Engineer
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-secondary)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Total Assigned
                </p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "var(--primary-50)" }}
                >
                  <FileText
                    className="w-4 h-4"
                    style={{ color: "var(--primary-600)" }}
                  />
                </div>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {assignments.length}
              </p>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-secondary)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Pending Review
                </p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "var(--warning-50)" }}
                >
                  <Clock className="w-4 h-4" style={{ color: "var(--warning-600)" }} />
                </div>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {pendingCount}
              </p>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-secondary)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Reviewed
                </p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "var(--success-50)" }}
                >
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: "var(--success-600)" }}
                  />
                </div>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {reviewedCount}
              </p>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-secondary)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Avg Score
                </p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "var(--primary-50)" }}
                >
                  <Award className="w-4 h-4" style={{ color: "var(--primary-600)" }} />
                </div>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {avgScore > 0 ? avgScore.toFixed(0) : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="mb-6">
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-secondary)",
            }}
          >
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-quaternary)" }}
                />
                <input
                  type="text"
                  placeholder="Search by candidate or assignment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-secondary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Role Filter */}
              <div className="flex items-center gap-2">
                <Filter
                  className="w-4 h-4"
                  style={{ color: "var(--text-quaternary)" }}
                />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border text-sm font-medium"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-secondary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  className="w-4 h-4"
                  style={{ color: "var(--text-quaternary)" }}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border text-sm font-medium"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-secondary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Review</option>
                  <option value="in-review">In Review</option>
                  <option value="reviewed">Reviewed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Cards */}
        {filteredAssignments.length === 0 ? (
          <div
            className="text-center py-16 rounded-lg border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-secondary)",
            }}
          >
            <FileText
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--text-quaternary)" }}
            />
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              No assignments found
            </p>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-lg border overflow-hidden hover:shadow-md transition-all"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-secondary)",
                }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Candidate Avatar */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          backgroundColor: "var(--primary-100)",
                          color: "var(--primary-700)",
                          border: "2px solid var(--primary-200)",
                        }}
                      >
                        {assignment.candidateName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className="text-lg font-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {assignment.assignmentTitle}
                          </h3>
                          {assignment.status === "reviewed" && (
                            <div
                              className="px-2.5 py-1 rounded-md flex items-center gap-1.5"
                              style={{
                                backgroundColor: "var(--success-50)",
                                border: "1px solid var(--success-200)",
                              }}
                            >
                              <CheckCircle2
                                className="w-3.5 h-3.5"
                                style={{ color: "var(--success-600)" }}
                              />
                              <span
                                className="text-xs font-bold"
                                style={{ color: "var(--success-700)" }}
                              >
                                Reviewed
                              </span>
                            </div>
                          )}
                          {assignment.status === "in-review" && (
                            <div
                              className="px-2.5 py-1 rounded-md flex items-center gap-1.5"
                              style={{
                                backgroundColor: "var(--primary-50)",
                                border: "1px solid var(--primary-200)",
                              }}
                            >
                              <TrendingUp
                                className="w-3.5 h-3.5"
                                style={{ color: "var(--primary-600)" }}
                              />
                              <span
                                className="text-xs font-bold"
                                style={{ color: "var(--primary-700)" }}
                              >
                                In Review
                              </span>
                            </div>
                          )}
                          {assignment.status === "pending" && (
                            <div
                              className="px-2.5 py-1 rounded-md flex items-center gap-1.5"
                              style={{
                                backgroundColor: "var(--warning-50)",
                                border: "1px solid var(--warning-200)",
                              }}
                            >
                              <AlertCircle
                                className="w-3.5 h-3.5"
                                style={{ color: "var(--warning-600)" }}
                              />
                              <span
                                className="text-xs font-bold"
                                style={{ color: "var(--warning-700)" }}
                              >
                                Pending Review
                              </span>
                            </div>
                          )}
                        </div>

                        <p
                          className="text-sm font-medium mb-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Candidate: {assignment.candidateName}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-quaternary)" }}
                        >
                          {assignment.candidateEmail}
                        </p>
                      </div>
                    </div>

                    {assignment.status === "reviewed" && assignment.score && (
                      <div
                        className="px-4 py-3 rounded-lg text-center"
                        style={{
                          backgroundColor: "var(--success-50)",
                          border: "2px solid var(--success-200)",
                        }}
                      >
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{ color: "var(--success-700)" }}
                        >
                          Final Score
                        </p>
                        <p
                          className="text-3xl font-bold"
                          style={{ color: "var(--success-700)" }}
                        >
                          {assignment.score}
                        </p>
                        <p
                          className="text-xs font-medium"
                          style={{ color: "var(--success-600)" }}
                        >
                          / 100
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed mb-4 pl-16"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {assignment.assignmentDescription}
                  </p>

                  {/* Details Grid */}
                  <div
                    className="grid grid-cols-3 gap-6 mb-4 pl-16 py-4 rounded-lg"
                    style={{ backgroundColor: "var(--gray-50)" }}
                  >
                    <div className="px-4">
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-1.5"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Job Role
                      </p>
                      <div className="flex items-center gap-2">
                        <Briefcase
                          className="w-4 h-4"
                          style={{ color: "var(--primary-600)" }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {assignment.jobRole}
                        </span>
                      </div>
                    </div>

                    <div className="px-4">
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-1.5"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Submitted
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar
                          className="w-4 h-4"
                          style={{ color: "var(--text-quaternary)" }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {assignment.submissionDate}
                        </span>
                      </div>
                    </div>

                    <div className="px-4">
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-1.5"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Files Submitted
                      </p>
                      <div className="flex items-center gap-2">
                        <FileText
                          className="w-4 h-4"
                          style={{ color: "var(--text-quaternary)" }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {assignment.submissionFiles.length} file(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pl-16">
                    <button
                      onClick={() => handleStartReview(assignment)}
                      className="px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
                      style={{
                        backgroundColor: "var(--primary-600)",
                        color: "var(--fg-white)",
                      }}
                    >
                      {assignment.status === "reviewed"
                        ? "View Review"
                        : "Review Assignment"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
