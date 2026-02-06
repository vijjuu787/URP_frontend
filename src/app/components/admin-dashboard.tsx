import { useState } from "react";
import {
  Users,
  Briefcase,
  Calendar,
  Filter,
  UserPlus,
  CheckCircle2,
  Clock,
  FileText,
  ChevronDown,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Eye,
  UserCheck,
  AlertCircle,
  Download,
} from "lucide-react";
import { Button } from "./ui/button";

interface Assignment {
  id: string;
  candidateName: string;
  jobRole: string;
  assignmentTitle: string;
  submissionDate: string;
  status: "pending" | "reviewed";
  assignedEngineer?: {
    id: string;
    name: string;
    role: string;
    experience: string;
  };
  score?: number;
}

interface Engineer {
  id: string;
  name: string;
  role: string;
  experience: string;
}

const mockEngineers: Engineer[] = [
  { id: "eng1", name: "Sarah Chen", role: "Senior Security Engineer", experience: "8 years" },
  { id: "eng2", name: "Michael Rodriguez", role: "Lead Systems Architect", experience: "12 years" },
  { id: "eng3", name: "Emily Watson", role: "Principal DevOps Engineer", experience: "10 years" },
  { id: "eng4", name: "David Kim", role: "Senior Backend Engineer", experience: "6 years" },
];

const mockAssignments: Assignment[] = [
  {
    id: "a1",
    candidateName: "John Doe",
    jobRole: "Security Engineer",
    assignmentTitle: "Kubernetes Security Hardening",
    submissionDate: "2026-01-14 10:30 AM",
    status: "pending",
  },
  {
    id: "a2",
    candidateName: "Jane Smith",
    jobRole: "DevOps Engineer",
    assignmentTitle: "CI/CD Pipeline Optimization",
    submissionDate: "2026-01-13 03:45 PM",
    status: "reviewed",
    assignedEngineer: mockEngineers[2],
    score: 87,
  },
  {
    id: "a3",
    candidateName: "Robert Johnson",
    jobRole: "Backend Engineer",
    assignmentTitle: "API Rate Limiting Implementation",
    submissionDate: "2026-01-13 09:15 AM",
    status: "pending",
    assignedEngineer: mockEngineers[3],
  },
  {
    id: "a4",
    candidateName: "Maria Garcia",
    jobRole: "Security Engineer",
    assignmentTitle: "Zero Trust Network Architecture",
    submissionDate: "2026-01-12 02:20 PM",
    status: "reviewed",
    assignedEngineer: mockEngineers[0],
    score: 92,
  },
  {
    id: "a5",
    candidateName: "Alex Turner",
    jobRole: "Systems Architect",
    assignmentTitle: "Microservices Migration Strategy",
    submissionDate: "2026-01-12 11:00 AM",
    status: "pending",
  },
];

interface AdminDashboardProps {
  onMenuClick?: () => void;
}

type SortField = 'candidate' | 'role' | 'assignment' | 'date' | 'status' | null;
type SortDirection = 'asc' | 'desc';

export function AdminDashboard({ onMenuClick }: AdminDashboardProps) {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterEngineer, setFilterEngineer] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [assigningTo, setAssigningTo] = useState<string | null>(null);
  const [selectedEngineer, setSelectedEngineer] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const jobRoles = Array.from(new Set(assignments.map((a) => a.jobRole)));

  const filteredAssignments = assignments.filter((assignment) => {
    if (filterRole !== "all" && assignment.jobRole !== filterRole) return false;
    if (filterEngineer !== "all" && assignment.assignedEngineer?.id !== filterEngineer)
      return false;
    if (filterStatus !== "all" && assignment.status !== filterStatus) return false;
    return true;
  });

  const handleAssignEngineer = (assignmentId: string) => {
    if (!selectedEngineer) return;

    const engineer = mockEngineers.find((e) => e.id === selectedEngineer);
    if (!engineer) return;

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId ? { ...a, assignedEngineer: engineer } : a
      )
    );

    setAssigningTo(null);
    setSelectedEngineer("");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAssignments = filteredAssignments.sort((a, b) => {
    if (!sortField) return 0;

    let comparison = 0;
    switch (sortField) {
      case 'candidate':
        comparison = a.candidateName.localeCompare(b.candidateName);
        break;
      case 'role':
        comparison = a.jobRole.localeCompare(b.jobRole);
        break;
      case 'assignment':
        comparison = a.assignmentTitle.localeCompare(b.assignmentTitle);
        break;
      case 'date':
        comparison = new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        return 0;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div
      className="min-h-screen"
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Assignment Review Panel
              </h1>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Manage candidate submissions and assign reviewers
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: "var(--primary-50)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Total Submissions
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--primary-700)" }}
                >
                  {assignments.length}
                </p>
              </div>
              <div
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: "var(--warning-50)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Pending Review
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--warning-700)" }}
                >
                  {assignments.filter((a) => a.status === "pending").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div
          className="p-4 rounded-lg border mb-6"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-secondary)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
            <h3
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: "var(--text-tertiary)" }}
            >
              Filters
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Job Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="all">All Roles</option>
                {jobRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Assigned Engineer
              </label>
              <select
                value={filterEngineer}
                onChange={(e) => setFilterEngineer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="all">All Engineers</option>
                {mockEngineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-secondary)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Table Header */}
          <div
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b text-xs font-bold uppercase tracking-wide"
            style={{
              backgroundColor: "var(--gray-50)",
              borderColor: "var(--border-secondary)",
              color: "var(--text-tertiary)",
            }}
          >
            <button
              onClick={() => handleSort('candidate')}
              className="col-span-2 flex items-center gap-1.5 hover:text-primary-600 transition-colors cursor-pointer"
            >
              Candidate
              {sortField === 'candidate' ? (
                sortDirection === 'asc' ? (
                  <ArrowUp className="w-3.5 h-3.5" style={{ color: "var(--primary-600)" }} />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5" style={{ color: "var(--primary-600)" }} />
                )
              ) : (
                <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
              )}
            </button>
            <button
              onClick={() => handleSort('role')}
              className="col-span-2 flex items-center gap-1.5 hover:text-primary-600 transition-colors cursor-pointer"
            >
              Job Role
              {sortField === 'role' ? (
                sortDirection === 'asc' ? (
                  <ArrowUp className="w-3.5 h-3.5" style={{ color: "var(--primary-600)" }} />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5" style={{ color: "var(--primary-600)" }} />
                )
              ) : (
                <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
              )}
            </button>
            <button
              onClick={() => handleSort('assignment')}
              className="col-span-2 flex items-center gap-1.5 hover:text-primary-600 transition-colors cursor-pointer"
            >
              Assignment
              {sortField === 'assignment' ? (
                sortDirection === 'asc' ? (
                  <ArrowUp className="w-3.5 h-3.5" style={{ color: "var(--primary-600)" }} />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5" style={{ color: "var(--primary-600)" }} />
                )
              ) : (
                <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
              )}
            </button>
            <button
              onClick={() => handleSort('date')}
              className="col-span-2 flex items-center gap-1.5 hover:text-primary-600 transition-colors cursor-pointer"
            >
              Submitted
              {sortField === 'date' ? (
                sortDirection === 'asc' ? (
                  <ArrowUp className="w-3.5 h-3.5" style={{ color: "var(--primary-600)" }} />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5" style={{ color: "var(--primary-600)" }} />
                )
              ) : (
                <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
              )}
            </button>
            <div className="col-span-2">Assigned To</div>
            <button
              onClick={() => handleSort('status')}
              className="col-span-1 flex items-center gap-1.5 hover:text-primary-600 transition-colors cursor-pointer"
            >
              Status
              {sortField === 'status' ? (
                sortDirection === 'asc' ? (
                  <ArrowUp className="w-3.5 h-3.5" style={{ color: "var(--primary-600)" }} />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5" style={{ color: "var(--primary-600)" }} />
                )
              ) : (
                <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
              )}
            </button>
            <div className="col-span-1">Action</div>
          </div>

          {/* Table Body */}
          {sortedAssignments.length === 0 ? (
            <div className="py-16 text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: "var(--gray-100)" }}
              >
                <FileText
                  className="w-8 h-8"
                  style={{ color: "var(--text-quaternary)" }}
                />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                No assignments found
              </h3>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Try adjusting your filters to see more results
              </p>
            </div>
          ) : (
            <div>
              {sortedAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b hover:shadow-sm transition-all group relative"
                  style={{
                    borderColor: "var(--border-secondary)",
                    backgroundColor: "var(--bg-primary)",
                  }}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                >
                  {/* Candidate */}
                  <div className="col-span-2 flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
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
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-semibold leading-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {assignment.candidateName}
                      </span>
                      <span
                        className="text-xs mt-0.5"
                        style={{ color: "var(--text-quaternary)" }}
                      >
                        ID: {assignment.id.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Job Role */}
                  <div className="col-span-2 flex items-center">
                    <div
                      className="px-3 py-1.5 rounded-md flex items-center gap-2"
                      style={{
                        backgroundColor: "var(--gray-50)",
                        border: "1px solid var(--border-secondary)",
                      }}
                    >
                      <Briefcase
                        className="w-3.5 h-3.5"
                        style={{ color: "var(--primary-600)" }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {assignment.jobRole}
                      </span>
                    </div>
                  </div>

                  {/* Assignment */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <span
                      className="text-sm font-semibold leading-tight mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {assignment.assignmentTitle}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: "var(--primary-50)",
                          color: "var(--primary-700)",
                        }}
                      >
                        Technical
                      </div>
                    </div>
                  </div>

                  {/* Submitted Date */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar
                        className="w-3.5 h-3.5"
                        style={{ color: "var(--text-quaternary)" }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {assignment.submissionDate}
                      </span>
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-quaternary)" }}
                    >
                      {(() => {
                        const date = new Date(assignment.submissionDate);
                        const now = new Date();
                        const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
                        if (diffHours < 24) return `${diffHours}h ago`;
                        const diffDays = Math.floor(diffHours / 24);
                        return `${diffDays}d ago`;
                      })()}
                    </span>
                  </div>

                  {/* Assigned Engineer */}
                  <div className="col-span-2 flex items-center">
                    {assignment.assignedEngineer ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: "var(--success-100)",
                            color: "var(--success-700)",
                            border: "2px solid var(--success-200)",
                          }}
                        >
                          {assignment.assignedEngineer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex flex-col">
                          <span
                            className="text-xs font-semibold leading-tight"
                            style={{ color: "var(--success-700)" }}
                          >
                            {assignment.assignedEngineer.name}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-quaternary)" }}
                          >
                            {assignment.assignedEngineer.role.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="px-3 py-1.5 rounded-md border-dashed border-2 flex items-center gap-2"
                        style={{
                          borderColor: "var(--border-secondary)",
                          backgroundColor: "var(--gray-50)",
                        }}
                      >
                        <AlertCircle
                          className="w-3.5 h-3.5"
                          style={{ color: "var(--warning-600)" }}
                        />
                        <span
                          className="text-xs font-medium"
                          style={{ color: "var(--text-quaternary)" }}
                        >
                          Unassigned
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex items-center">
                    {assignment.status === "reviewed" ? (
                      <div
                        className="px-2.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
                        style={{
                          backgroundColor: "var(--success-50)",
                          border: "1.5px solid var(--success-300)",
                        }}
                      >
                        <CheckCircle2
                          className="w-4 h-4"
                          style={{ color: "var(--success-600)" }}
                        />
                        <div className="flex flex-col leading-none">
                          <span
                            className="text-xs font-bold"
                            style={{ color: "var(--success-700)" }}
                          >
                            {assignment.score}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "var(--success-600)" }}
                          >
                            /100
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="px-2.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
                        style={{
                          backgroundColor: "var(--warning-50)",
                          border: "1.5px solid var(--warning-300)",
                        }}
                      >
                        <Clock
                          className="w-4 h-4"
                          style={{ color: "var(--warning-600)" }}
                        />
                        <span
                          className="text-xs font-bold whitespace-nowrap"
                          style={{ color: "var(--warning-700)" }}
                        >
                          Pending
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="col-span-1 flex items-center justify-end relative">
                    {assignment.status === "pending" &&
                    !assignment.assignedEngineer ? (
                      <button
                        onClick={() => setAssigningTo(assignment.id)}
                        className="px-2 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                        style={{
                          backgroundColor: "var(--primary-600)",
                          color: "var(--fg-white)",
                        }}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Assign
                      </button>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActionMenuOpen(
                              actionMenuOpen === assignment.id ? null : assignment.id
                            )
                          }
                          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {actionMenuOpen === assignment.id && (
                          <div
                            className="absolute right-0 top-full mt-1 w-48 rounded-lg border shadow-lg z-10 overflow-hidden"
                            style={{
                              backgroundColor: "var(--bg-primary)",
                              borderColor: "var(--border-secondary)",
                            }}
                          >
                            <button
                              className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-3 hover:bg-gray-50 transition-colors"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            {assignment.assignedEngineer && (
                              <button
                                onClick={() => setAssigningTo(assignment.id)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-3 hover:bg-gray-50 transition-colors"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                <UserCheck className="w-4 h-4" />
                                Reassign Engineer
                              </button>
                            )}
                            <button
                              className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-3 hover:bg-gray-50 transition-colors"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <Download className="w-4 h-4" />
                              Export Report
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assign Engineer Modal */}
      {assigningTo && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="w-full max-w-md rounded-lg p-6"
            style={{
              backgroundColor: "var(--bg-primary)",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Assign Reviewer
              </h3>
              <button
                onClick={() => {
                  setAssigningTo(null);
                  setSelectedEngineer("");
                }}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: "var(--text-tertiary)" }} />
              </button>
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Select Engineer
              </label>
              <select
                value={selectedEngineer}
                onChange={(e) => setSelectedEngineer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="">Choose an engineer...</option>
                {mockEngineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} - {eng.role} ({eng.experience})
                  </option>
                ))}
              </select>
            </div>

            {selectedEngineer && (
              <div
                className="p-3 rounded-lg mb-4"
                style={{
                  backgroundColor: "var(--gray-50)",
                  border: "1px solid var(--border-secondary)",
                }}
              >
                {(() => {
                  const engineer = mockEngineers.find((e) => e.id === selectedEngineer);
                  return engineer ? (
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {engineer.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {engineer.role}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Experience: {engineer.experience}
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAssigningTo(null);
                  setSelectedEngineer("");
                }}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-secondary)",
                  color: "var(--text-secondary)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignEngineer(assigningTo)}
                disabled={!selectedEngineer}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "var(--primary-600)",
                  color: "var(--fg-white)",
                }}
              >
                Assign Engineer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}