import { Lock, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Clock, TrendingUp, Sparkles, User, Target } from "lucide-react";

export interface Challenge {
  id: string;
  title: string;
  topic: string;
  difficulty: "Expert" | "Hard" | "Medium" | "Easy";
  points: number;
  solvers: number;
  description: string;
  status: "locked" | "available" | "solved";
  technologies: string[];
  estimatedTime: string;
  successRate: number;
  isNew?: boolean;
  isTrending?: boolean;
  author?: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onStart: (id: string, challenge: Challenge) => void;
}

const difficultyColors = {
  Expert: { bg: "var(--error-600)", text: "var(--fg-white)" },
  Hard: { bg: "var(--warning-500)", text: "var(--fg-white)" },
  Medium: { bg: "var(--primary-600)", text: "var(--fg-white)" },
  Easy: { bg: "var(--success-600)", text: "var(--fg-white)" },
};

export function ChallengeCard({ challenge, onStart }: ChallengeCardProps) {
  const diffColor = difficultyColors[challenge.difficulty];
  const isLocked = challenge.status === "locked";
  const isSolved = challenge.status === "solved";

  return (
    <div
      className={`rounded-lg overflow-hidden transition-all ${isLocked ? "opacity-50 blur-[2px] pointer-events-none" : "hover:shadow-lg"}`}
      style={{
        backgroundColor: "var(--bg-primary)",
        border: `1px solid ${isSolved ? "var(--success-300)" : "var(--border-primary)"}`,
        fontFamily: "var(--font-inter)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Status Badges */}
        {(challenge.isNew || challenge.isTrending) && (
          <div className="flex items-center gap-2 mb-3">
            {challenge.isNew && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor: "var(--primary-50)",
                  border: "1px solid var(--primary-200)",
                }}
              >
                <Sparkles
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--primary-600)" }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--primary-700)" }}
                >
                  New
                </span>
              </div>
            )}
            {challenge.isTrending && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor: "var(--warning-50)",
                  border: "1px solid var(--warning-200)",
                }}
              >
                <TrendingUp
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--warning-600)" }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--warning-700)" }}
                >
                  Trending
                </span>
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {challenge.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <code
                className="px-2.5 py-1 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: "var(--gray-100)",
                  color: "var(--primary-700)",
                  fontFamily: "var(--font-code)",
                }}
              >
                {challenge.topic}
              </code>
              <span
                className="px-2.5 py-1 rounded-md text-xs font-semibold"
                style={{
                  backgroundColor: diffColor.bg,
                  color: diffColor.text,
                }}
              >
                {challenge.difficulty}
              </span>
            </div>
          </div>
          {isSolved && (
            <CheckCircle2
              className="w-6 h-6"
              style={{ color: "var(--success-600)" }}
            />
          )}
          {isLocked && (
            <Lock
              className="w-6 h-6"
              style={{ color: "var(--text-quaternary)" }}
            />
          )}
        </div>

        {/* Technology Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {challenge.technologies?.map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: "var(--gray-100)",
                color: "var(--text-tertiary)",
                border: "1px solid var(--border-secondary)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Description */}
        <p
          className="text-sm mb-4 leading-relaxed flex-grow"
          style={{ color: "var(--text-secondary)" }}
        >
          {challenge.description}
        </p>

        {/* Metadata Row */}
        <div
          className="flex items-center gap-3 mb-4 pb-3"
          style={{ borderBottom: "1px solid var(--border-secondary)" }}
        >
          <div className="flex items-center gap-1.5">
            <Clock
              className="w-3.5 h-3.5"
              style={{ color: "var(--text-quaternary)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {challenge.estimatedTime}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <User
              className="w-3.5 h-3.5"
              style={{ color: "var(--text-quaternary)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {challenge.author || "Anonymous"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div
          className="flex items-center justify-between pb-4"
          style={{ borderBottom: "1px solid var(--border-secondary)" }}
        >
          <div className="flex gap-6 text-sm">
            <div className="flex flex-col">
              <span
                className="text-xs font-medium mb-0.5"
                style={{ color: "var(--text-quaternary)" }}
              >
                Points
              </span>
              <span
                style={{
                  color: "var(--primary-600)",
                  fontFamily: "var(--font-code)",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                {challenge.points}
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="text-xs font-medium mb-0.5"
                style={{ color: "var(--text-quaternary)" }}
              >
                Solvers
              </span>
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-code)",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                {challenge.solvers}
              </span>
            </div>
          </div>

          {/* Success Rate Badge */}
          <div
            className="px-3 py-1.5 rounded-lg"
            style={{
              backgroundColor:
                challenge.successRate >= 70
                  ? "var(--success-50)"
                  : challenge.successRate >= 40
                    ? "var(--warning-50)"
                    : "var(--error-50)",
              border: `1px solid ${challenge.successRate >= 70 ? "var(--success-200)" : challenge.successRate >= 40 ? "var(--warning-200)" : "var(--error-200)"}`,
            }}
          >
            <span
              className="text-xs font-semibold"
              style={{
                color:
                  challenge.successRate >= 70
                    ? "var(--success-700)"
                    : challenge.successRate >= 40
                      ? "var(--warning-700)"
                      : "var(--error-700)",
              }}
            >
              {challenge.successRate}%
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-auto">
          <Button
            onClick={() => onStart(challenge.id, challenge)}
            disabled={isLocked}
            className="w-full rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 font-semibold text-sm transition-all"
            style={{
              backgroundColor: isSolved
                ? "var(--success-600)"
                : "var(--primary-600)",
              color: "var(--fg-white)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            {isSolved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                View Solution
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                Start Challenge
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
