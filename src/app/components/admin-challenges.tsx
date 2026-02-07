import { useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  MoreVertical,
  Trophy,
  Users,
  CheckCircle,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CreateChallengeModal, ChallengeData } from "./create-challenge-modal";
import {
  CreateAssignmentModal,
  AssignmentData,
} from "./create-assignment-modal";
import { apiCall } from "../utils/api";
import { API_BASE_URL } from "../../config/api";

interface AdminChallengesProps {
  onMenuClick?: () => void;
}

export function AdminChallenges({ onMenuClick }: AdminChallengesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "API Security Audit",
      difficulty: "Hard",
      category: "Security",
      tags: ["API", "Security", "Authentication"],
      participants: 234,
      successRate: 68,
      points: 500,
      status: "published",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "SQL Injection Prevention",
      difficulty: "Medium",
      category: "Security",
      tags: ["SQL", "Database", "Security"],
      participants: 412,
      successRate: 72,
      points: 300,
      status: "published",
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      title: "Cryptographic Implementation",
      difficulty: "Expert",
      category: "Cryptography",
      tags: ["Crypto", "Encryption", "Security"],
      participants: 156,
      successRate: 45,
      points: 800,
      status: "published",
      createdAt: "2024-01-08",
    },
    {
      id: 4,
      title: "Network Security Analysis",
      difficulty: "Hard",
      category: "Networking",
      tags: ["Network", "Security", "Analysis"],
      participants: 198,
      successRate: 61,
      points: 600,
      status: "draft",
      createdAt: "2024-01-05",
    },
    {
      id: 5,
      title: "Web Application Firewall",
      difficulty: "Medium",
      category: "Security",
      tags: ["WAF", "Security", "Web"],
      participants: 287,
      successRate: 78,
      points: 400,
      status: "published",
      createdAt: "2024-01-03",
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return {
          bg: "var(--success-50)",
          text: "var(--success-700)",
          border: "var(--success-200)",
        };
      case "Medium":
        return {
          bg: "var(--warning-50)",
          text: "var(--warning-700)",
          border: "var(--warning-200)",
        };
      case "Hard":
        return {
          bg: "var(--error-50)",
          text: "var(--error-700)",
          border: "var(--error-200)",
        };
      case "Expert":
        return {
          bg: "var(--purple-50)",
          text: "var(--purple-700)",
          border: "var(--purple-200)",
        };
      default:
        return {
          bg: "var(--gray-100)",
          text: "var(--text-secondary)",
          border: "var(--border-secondary)",
        };
    }
  };

  const handleCreateChallenge = async (data: ChallengeData) => {
    setIsCreating(true);
    try {
      console.log("[CREATE_CHALLENGE] Creating challenge with data:", data);

      // Map frontend form data to backend API fields
      const payload = {
        title: data.title,
        description: data.description,
        workType: data.workType,
        roleType: data.jobType, // Map jobType to roleType
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        salaryRange: data.salary,
        experienceLevel: data.experience,
        difficulty: data.difficulty,
        points: 500, // Default points value
        status: "draft", // New challenges start as draft
        postDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("[CREATE_CHALLENGE] Sending payload:", payload);

      const result = await apiCall<any>(`${API_BASE_URL}/api/job-postings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("[CREATE_CHALLENGE] Challenge created successfully:", result);

      // Add the new challenge to the challenges list
      const newChallenge = {
        id: challenges.length + 1,
        title: data.title,
        difficulty: data.difficulty,
        category: data.tags[0] || "General", // Use first tag as category
        tags: data.tags,
        participants: 0,
        successRate: 0,
        points: 500,
        status: "draft",
        createdAt: new Date().toLocaleDateString(),
      };

      setChallenges([newChallenge, ...challenges]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("[CREATE_CHALLENGE] Error creating challenge:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateAssignment = async (data: AssignmentData) => {
    setIsCreatingAssignment(true);
    try {
      console.log("[CREATE_ASSIGNMENT] Creating assignment with data:", data);

      // Map frontend form data to backend API fields
      const payload: any = {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        totalPoints: data.totalPoints,
        timeLimitHours: data.timeLimitHours,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("[CREATE_ASSIGNMENT] Sending payload:", payload);

      const result = await apiCall<any>(`${API_BASE_URL}/api/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(
        "[CREATE_ASSIGNMENT] Assignment created successfully:",
        result,
      );
      setShowAssignmentModal(false);
    } catch (error) {
      console.error("[CREATE_ASSIGNMENT] Error creating assignment:", error);
    } finally {
      setIsCreatingAssignment(false);
    }
  };

  return (
    <div
      className="flex-1 h-screen overflow-y-auto"
      style={{
        backgroundColor: "var(--gray-50)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {onMenuClick && (
                <button
                  onClick={onMenuClick}
                  className="lg:hidden p-2 rounded-lg hover:bg-white"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <h1
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Challenge Management
              </h1>
            </div>
            <p
              className="text-sm md:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              Create, edit, and manage challenges for candidates
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
            style={{
              backgroundColor: "var(--success-600)",
              color: "var(--fg-white)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <Plus className="w-4 h-4" />
            Create Challenge
          </Button>
        </div>

        {/* Filters & Search */}
        <div
          className="rounded-xl p-4 md:p-6 mb-4 md:mb-6"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "var(--text-quaternary)" }}
              />
              <Input
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-xs)",
                }}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border h-11"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                <option>All Difficulties</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Expert</option>
              </select>
              <select
                className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border h-11"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Challenges Table - Desktop */}
        <div
          className="hidden md:block rounded-xl overflow-hidden"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--gray-50)",
                    borderBottom: "1px solid var(--border-primary)",
                  }}
                >
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Challenge
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Difficulty
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Category
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Participants
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Success Rate
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Points
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((challenge) => {
                  const difficultyColor = getDifficultyColor(
                    challenge.difficulty,
                  );
                  return (
                    <tr
                      key={challenge.id}
                      style={{
                        borderBottom: "1px solid var(--border-secondary)",
                      }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <h3
                            className="font-semibold mb-1"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {challenge.title}
                          </h3>
                          <div className="flex flex-wrap gap-1">
                            {challenge.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-0.5 rounded"
                                style={{
                                  backgroundColor: "var(--primary-50)",
                                  color: "var(--primary-700)",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-lg text-xs font-semibold"
                          style={{
                            backgroundColor: difficultyColor.bg,
                            color: difficultyColor.text,
                            border: `1px solid ${difficultyColor.border}`,
                          }}
                        >
                          {challenge.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {challenge.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users
                            className="w-4 h-4"
                            style={{ color: "var(--text-quaternary)" }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {challenge.participants}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-full max-w-[80px] h-2 rounded-full overflow-hidden"
                            style={{ backgroundColor: "var(--gray-200)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${challenge.successRate}%`,
                                backgroundColor:
                                  challenge.successRate >= 70
                                    ? "var(--success-600)"
                                    : challenge.successRate >= 50
                                      ? "var(--warning-600)"
                                      : "var(--error-600)",
                              }}
                            />
                          </div>
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {challenge.successRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Trophy
                            className="w-4 h-4"
                            style={{ color: "var(--warning-600)" }}
                          />
                          <span
                            className="text-sm font-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {challenge.points}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 w-fit"
                          style={{
                            backgroundColor:
                              challenge.status === "published"
                                ? "var(--success-50)"
                                : "var(--gray-100)",
                            color:
                              challenge.status === "published"
                                ? "var(--success-700)"
                                : "var(--text-tertiary)",
                          }}
                        >
                          {challenge.status === "published" && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {challenge.status === "published"
                            ? "Published"
                            : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            style={{ color: "var(--text-quaternary)" }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            style={{ color: "var(--text-quaternary)" }}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            style={{ color: "var(--error-600)" }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Challenges Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {challenges.map((challenge) => {
            const difficultyColor = getDifficultyColor(challenge.difficulty);
            return (
              <div
                key={challenge.id}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="font-semibold text-base flex-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {challenge.title}
                  </h3>
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-semibold ml-2"
                    style={{
                      backgroundColor: difficultyColor.bg,
                      color: difficultyColor.text,
                      border: `1px solid ${difficultyColor.border}`,
                    }}
                  >
                    {challenge.difficulty}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {challenge.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: "var(--primary-50)",
                        color: "var(--primary-700)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p
                      className="text-xs mb-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Participants
                    </p>
                    <div className="flex items-center gap-1">
                      <Users
                        className="w-4 h-4"
                        style={{ color: "var(--text-quaternary)" }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {challenge.participants}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p
                      className="text-xs mb-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Success Rate
                    </p>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {challenge.successRate}%
                    </span>
                  </div>
                  <div>
                    <p
                      className="text-xs mb-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Points
                    </p>
                    <div className="flex items-center gap-1">
                      <Trophy
                        className="w-4 h-4"
                        style={{ color: "var(--warning-600)" }}
                      />
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {challenge.points}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p
                      className="text-xs mb-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Status
                    </p>
                    <span
                      className="px-2 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                      style={{
                        backgroundColor:
                          challenge.status === "published"
                            ? "var(--success-50)"
                            : "var(--gray-100)",
                        color:
                          challenge.status === "published"
                            ? "var(--success-700)"
                            : "var(--text-tertiary)",
                      }}
                    >
                      {challenge.status === "published" && (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      {challenge.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 pt-3 border-t"
                  style={{ borderColor: "var(--border-secondary)" }}
                >
                  <button
                    className="flex-1 p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View</span>
                  </button>
                  <button
                    className="flex-1 p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                  <button
                    className="flex-1 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    style={{ color: "var(--error-600)" }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Challenge Modal */}
      <CreateChallengeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateChallenge}
        isLoading={isCreating}
        onOpenAssignment={() => setShowAssignmentModal(true)}
      />

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onSubmit={handleCreateAssignment}
        isLoading={isCreatingAssignment}
      />
    </div>
  );
}
