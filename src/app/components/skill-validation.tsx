import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  Code,
  Terminal,
  Shield,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Timer,
} from "lucide-react";
import { Button } from "./ui/button";
import { apiCall } from "../utils/api";

interface JobDetails {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  workType: string;
  jobType: string;
  experienceRequired: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
}

interface SkillValidationProps {
  jobDetails: JobDetails;
  requiredSkills: string[];
  lockedChallengeId?: string;
  timerStartTime?: number;
  onCancel: () => void;
  onStartChallenge: (challengeId: string, challenge: Challenge) => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Medium" | "Hard" | "Expert";
  techStack: string[];
  estimatedTime: string;
  category: string;
  objective: string;
  validatesSkills: string[];
}

export type { Challenge };

export function SkillValidation({
  jobDetails,
  requiredSkills,
  lockedChallengeId,
  timerStartTime,
  onCancel,
  onStartChallenge,
}: SkillValidationProps) {
  // Fallback challenge in case API fetch fails or no jobId provided
  const defaultChallenge: Challenge = {
    id: jobDetails?.id?.toString() || "default",
    title: "Loading Challenge...",
    description: "Fetching your assignment details from the server...",
    difficulty: "Medium",
    techStack: [],
    estimatedTime: "TBD",
    category: "Assignment",
    objective: "Complete your skill validation challenge",
    validatesSkills: requiredSkills || [],
  };

  // State for the challenge fetched from the API
  const [selectedChallenge, setSelectedChallenge] =
    useState<Challenge>(defaultChallenge);

  // Fetch assignment data from API using jobDetails.id
  useEffect(() => {
    if (!jobDetails?.id) {
      console.warn("[SKILL_VALIDATION] No jobDetails.id provided");
      return;
    }

    let cancelled = false;

    const mapAssignmentToChallenge = (assignment: any): Challenge => {
      return {
        id: assignment.id || jobDetails.id.toString(),
        title: assignment.title || `Assignment ${assignment.id}`,
        description: assignment.description || "",
        difficulty: (assignment.difficulty as any) || "Medium",
        techStack: Array.isArray(assignment.techStack)
          ? assignment.techStack
          : [],
        estimatedTime: assignment.timeLimitHours
          ? `${assignment.timeLimitHours} hours`
          : assignment.estimatedTime || "TBD",
        category: assignment.category || "Assignment",
        objective: assignment.objective || assignment.description || "",
        validatesSkills: requiredSkills || [],
      } as Challenge;
    };

    const fetchAssignment = async () => {
      try {
        console.log(
          "[SKILL_VALIDATION] Fetching assignment for job:",
          jobDetails.id,
        );
        const result = await apiCall<any>(
          `http://localhost:5100/api/assignments/job/${jobDetails.id}`,
          { method: "GET" },
        );

        console.log("[SKILL_VALIDATION] Fetched assignment:", result);

        if (!cancelled && result) {
          const mapped = mapAssignmentToChallenge(result);
          setSelectedChallenge(mapped);
        }
      } catch (err) {
        console.error("[SKILL_VALIDATION] Error fetching assignment:", err);
        // Keep the loading state or minimal fallback visible
      }
    };

    fetchAssignment();

    return () => {
      cancelled = true;
    };
  }, [jobDetails?.id, requiredSkills]);

  const [isJobDetailsExpanded, setIsJobDetailsExpanded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<string>("");

  // Use props directly - they contain all the necessary job details
  const displayJobDetails = jobDetails;

  // Timer logic - updates every second when challenge is started
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Medium":
        return {
          bg: "var(--primary-50)",
          border: "var(--primary-300)",
          text: "var(--primary-700)",
        };
      case "Hard":
        return {
          bg: "var(--warning-50)",
          border: "var(--warning-300)",
          text: "var(--warning-700)",
        };
      case "Expert":
        return {
          bg: "var(--error-50)",
          border: "var(--error-300)",
          text: "var(--error-700)",
        };
      default:
        return {
          bg: "var(--gray-50)",
          border: "var(--gray-300)",
          text: "var(--gray-700)",
        };
    }
  };

  const difficultyColors = getDifficultyColor(selectedChallenge.difficulty);

  return (
    <div
      className="flex-1 h-screen overflow-y-auto"
      style={{
        backgroundColor: "var(--gray-50)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={onCancel}
          className="flex items-center gap-2 mb-6 text-sm font-medium transition-colors hover:opacity-70"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        {/* Header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4"
            style={{
              backgroundColor: "var(--gray-700)",
              color: "var(--fg-white)",
            }}
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Skill Validation Required
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Skill Validation Required
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Complete a short challenge to validate your skills for this role.
          </p>
        </div>

        {/* Job Context */}
        <div
          className="rounded-lg border p-5 mb-6"
          style={{
            backgroundColor: "var(--primary-50)",
            borderColor: "var(--primary-200)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: "var(--primary-600)",
              }}
            >
              <Target
                className="w-5 h-5"
                style={{ color: "var(--fg-white)" }}
              />
            </div>
            <div className="flex-1">
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: "var(--primary-700)" }}
              >
                Applying for
              </p>
              <p
                className="font-bold text-lg mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {displayJobDetails.title}
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                This challenge will validate{" "}
                {requiredSkills.slice(0, 3).join(", ")} skills
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Job Description - Expandable */}
        <div
          className="rounded-xl border overflow-hidden mb-6"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Job Header - Always Visible */}
          <button
            onClick={() => setIsJobDetailsExpanded(!isJobDetailsExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded flex items-center justify-center font-bold text-lg flex-shrink-0"
                style={{
                  backgroundColor: "var(--gray-100)",
                  color: "var(--text-primary)",
                }}
              >
                {displayJobDetails.companyLogo}
              </div>
              <div className="text-left">
                <h3
                  className="font-bold text-xl mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {displayJobDetails.title}
                </h3>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {displayJobDetails.company}
                </p>
              </div>
            </div>
            {isJobDetailsExpanded ? (
              <ChevronUp
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "var(--text-quaternary)" }}
              />
            ) : (
              <ChevronDown
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "var(--text-quaternary)" }}
              />
            )}
          </button>

          {/* Expandable Job Details */}
          {isJobDetailsExpanded && (
            <div
              className="border-t"
              style={{ borderColor: "var(--border-secondary)" }}
            >
              {/* Job Quick Info */}
              <div
                className="px-6 py-4 border-b grid grid-cols-2 md:grid-cols-4 gap-4"
                style={{
                  backgroundColor: "var(--gray-50)",
                  borderColor: "var(--border-secondary)",
                }}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--text-quaternary)" }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Location
                    </span>
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {displayJobDetails.location}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Briefcase
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--text-quaternary)" }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Work Type
                    </span>
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {displayJobDetails.workType}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--text-quaternary)" }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Job Type
                    </span>
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {displayJobDetails.jobType}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <DollarSign
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--text-quaternary)" }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Salary
                    </span>
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {displayJobDetails.salaryRange}
                  </p>
                </div>
              </div>

              {/* Job Description */}
              <div className="px-6 py-5">
                <h4
                  className="text-sm font-bold mb-3 uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  About the Role
                </h4>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {displayJobDetails.description}
                </p>

                {/* Requirements */}
                <h4
                  className="text-sm font-bold mb-3 uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Requirements
                </h4>
                <ul className="space-y-2 mb-6">
                  {(Array.isArray(displayJobDetails.requirements)
                    ? displayJobDetails.requirements
                    : []
                  ).map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: "var(--success-600)" }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Responsibilities */}
                <h4
                  className="text-sm font-bold mb-3 uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Responsibilities
                </h4>
                <ul className="space-y-2 mb-6">
                  {(Array.isArray(displayJobDetails.responsibilities)
                    ? displayJobDetails.responsibilities
                    : []
                  ).map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                        style={{ backgroundColor: "var(--primary-600)" }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {resp}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Benefits (if provided) */}
                {displayJobDetails.benefits &&
                  Array.isArray(displayJobDetails.benefits) &&
                  displayJobDetails.benefits.length > 0 && (
                    <>
                      <h4
                        className="text-sm font-bold mb-3 uppercase tracking-wide"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Benefits
                      </h4>
                      <ul className="space-y-2">
                        {displayJobDetails.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2
                              className="w-4 h-4 flex-shrink-0 mt-0.5"
                              style={{ color: "var(--primary-600)" }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div
          className="rounded-lg border p-4 mb-8 flex items-start gap-3"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)",
          }}
        >
          <AlertCircle
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color: "var(--text-quaternary)" }}
          />
          <div>
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              How it works
            </p>
            <ul
              className="text-sm space-y-1"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>
                • One challenge selected based on your strongest skills and role
                requirements
              </li>
              <li>
                • Your solution is auto-graded against test cases in real-time
              </li>
              <li>
                • Passing score: 70% or higher to proceed with application
              </li>
              <li>• You may retry once if unsuccessful (24-hour cooldown)</li>
            </ul>
          </div>
        </div>

        {/* Challenge Card */}
        <div
          className="rounded-xl border overflow-hidden mb-8"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Challenge Header */}
          <div
            className="px-6 py-4 border-b"
            style={{
              backgroundColor: "var(--gray-50)",
              borderColor: "var(--border-secondary)",
              filter: !timerStartTime ? "blur(8px)" : "none",
              pointerEvents: !timerStartTime ? "none" : "auto",
              userSelect: !timerStartTime ? "none" : "auto",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: difficultyColors.bg,
                      color: difficultyColors.text,
                      border: `1px solid ${difficultyColors.border}`,
                    }}
                  >
                    {selectedChallenge.difficulty}
                  </span>
                  <span
                    className="px-2.5 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: "var(--gray-100)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {selectedChallenge.category}
                  </span>
                  {timerStartTime && elapsedTime && (
                    <span
                      className="px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5"
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
                <h2
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {selectedChallenge.title}
                </h2>
              </div>
            </div>

            <div
              className="flex flex-wrap gap-4 text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span className="font-medium">
                  {selectedChallenge.estimatedTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Code className="w-4 h-4" />
                <span className="font-medium">
                  {selectedChallenge.techStack.length} technologies
                </span>
              </div>
            </div>
          </div>

          {/* Challenge Body */}
          <div
            className="px-6 py-6"
            style={{
              filter: !timerStartTime ? "blur(8px)" : "none",
              pointerEvents: !timerStartTime ? "none" : "auto",
              userSelect: !timerStartTime ? "none" : "auto",
            }}
          >
            <div className="mb-6">
              <h3
                className="text-sm font-bold mb-2 uppercase tracking-wide"
                style={{ color: "var(--text-tertiary)" }}
              >
                Challenge Description
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {selectedChallenge.description}
              </p>
            </div>

            <div className="mb-6">
              <h3
                className="text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: "var(--text-tertiary)" }}
              >
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedChallenge.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"
                    style={{
                      backgroundColor: "var(--gray-900)",
                      color: "var(--fg-white)",
                    }}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3
                className="text-sm font-bold mb-2 uppercase tracking-wide"
                style={{ color: "var(--text-tertiary)" }}
              >
                Objective
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {selectedChallenge.objective}
              </p>
            </div>

            <div>
              <h3
                className="text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: "var(--text-tertiary)" }}
              >
                Validates Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedChallenge.validatesSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5"
                    style={{
                      backgroundColor: "var(--success-50)",
                      color: "var(--success-700)",
                      border: "1px solid var(--success-200)",
                    }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Challenge Footer */}
          <div
            className="px-6 py-4 border-t"
            style={{
              backgroundColor: "var(--gray-50)",
              borderColor: "var(--border-secondary)",
            }}
          >
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              <TrendingUp className="w-4 h-4" />
              <span>
                <strong style={{ color: "var(--text-primary)" }}>
                  Passing Rate:
                </strong>{" "}
                68% of candidates complete this challenge successfully
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() =>
              onStartChallenge(selectedChallenge.id, selectedChallenge)
            }
            className="flex-1 h-12 rounded-lg font-bold text-base flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--gray-900)",
              color: "var(--fg-white)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <Code className="w-5 h-5" />
            {timerStartTime ? "Continue Challenge" : "Start Challenge"}
          </Button>

          <Button
            onClick={onCancel}
            className="sm:w-40 h-12 rounded-lg font-semibold text-base"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            Cancel Application
          </Button>
        </div>

        {/* Bottom Notice */}
        <div
          className="mt-6 p-4 rounded-lg border"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-secondary)",
          }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--text-tertiary)" }}
          >
            <strong style={{ color: "var(--text-primary)" }}>Note:</strong> You
            have 48 hours (2 days) to complete this challenge from the moment
            you start. The countdown timer cannot be paused. Ensure you have a
            stable internet connection and uninterrupted time before beginning.
            Your code will be auto-saved every 30 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
