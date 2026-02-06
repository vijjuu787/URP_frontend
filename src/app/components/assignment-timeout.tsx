import { useState, useEffect } from "react";
import { AlertTriangle, Clock, RotateCcw, XCircle, Calendar } from "lucide-react";

interface AssignmentTimeoutProps {
  assignmentTitle: string;
  deadline: Date;
  onTimeout: () => void;
  onReset?: () => void;
}

export function AssignmentTimeout({
  assignmentTitle,
  deadline,
  onTimeout,
  onReset,
}: AssignmentTimeoutProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [percentage, setPercentage] = useState(100);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const deadlineTime = deadline.getTime();
      const remaining = deadlineTime - now;

      if (remaining <= 0) {
        setIsExpired(true);
        setTimeRemaining("Expired");
        setPercentage(0);
        onTimeout();
        return;
      }

      // Calculate time remaining
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      // Format display
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }

      // Calculate percentage (assuming 48 hours = 100%)
      const totalTime = 48 * 60 * 60 * 1000; // 48 hours
      const elapsed = totalTime - remaining;
      const pct = Math.max(0, Math.min(100, ((totalTime - elapsed) / totalTime) * 100));
      setPercentage(pct);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [deadline, onTimeout]);

  const getColorScheme = () => {
    if (isExpired) {
      return {
        bg: "var(--error-50)",
        border: "var(--error-300)",
        text: "var(--error-700)",
        icon: "var(--error-600)",
      };
    } else if (percentage < 25) {
      return {
        bg: "var(--error-50)",
        border: "var(--error-200)",
        text: "var(--error-700)",
        icon: "var(--error-600)",
      };
    } else if (percentage < 50) {
      return {
        bg: "var(--warning-50)",
        border: "var(--warning-200)",
        text: "var(--warning-700)",
        icon: "var(--warning-600)",
      };
    } else {
      return {
        bg: "var(--primary-50)",
        border: "var(--primary-200)",
        text: "var(--primary-700)",
        icon: "var(--primary-600)",
      };
    }
  };

  const colors = getColorScheme();

  if (isExpired) {
    return (
      <div
        className="rounded-lg border-2 p-6"
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--error-100)" }}
          >
            <XCircle className="w-6 h-6" style={{ color: colors.icon }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
              ⏰ Assignment Expired
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              <strong>{assignmentTitle}</strong> has exceeded the deadline and is no longer
              accepting submissions.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-4 h-4" style={{ color: "var(--text-quaternary)" }} />
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Deadline was: {deadline.toLocaleString()}
              </span>
            </div>
            <div
              className="p-4 rounded-lg mb-4"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-secondary)",
              }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                What happens next?
              </p>
              <ul className="text-sm space-y-1" style={{ color: "var(--text-secondary)" }}>
                <li>• Your assignment has been automatically marked as incomplete</li>
                <li>• This will be reflected in your candidate profile</li>
                <li>• Contact the admin if you believe this was an error</li>
              </ul>
            </div>
            {onReset && (
              <button
                onClick={onReset}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all hover:opacity-90"
                style={{
                  backgroundColor: "var(--primary-600)",
                  color: "var(--fg-white)",
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Request New Assignment
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border-2 p-5"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor:
              percentage < 25
                ? "var(--error-100)"
                : percentage < 50
                ? "var(--warning-100)"
                : "var(--primary-100)",
          }}
        >
          {percentage < 25 ? (
            <AlertTriangle className="w-5 h-5" style={{ color: colors.icon }} />
          ) : (
            <Clock className="w-5 h-5" style={{ color: colors.icon }} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: colors.text }}>
            {percentage < 25 ? "⚠️ Urgent: Time Running Out!" : "Time Remaining"}
          </p>
          <p className="text-2xl font-bold" style={{ color: colors.text }}>
            {timeRemaining}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full h-2 rounded-full mb-3 overflow-hidden"
        style={{ backgroundColor: "var(--gray-200)" }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: colors.icon,
          }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span style={{ color: "var(--text-tertiary)" }}>
          Deadline: {deadline.toLocaleString("en-US", { 
            month: "short", 
            day: "numeric", 
            hour: "2-digit", 
            minute: "2-digit" 
          })}
        </span>
        <span style={{ color: colors.text, fontWeight: 600 }}>
          {percentage.toFixed(0)}% remaining
        </span>
      </div>

      {percentage < 25 && (
        <div
          className="mt-4 p-3 rounded-lg"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--error-200)",
          }}
        >
          <p className="text-xs font-semibold" style={{ color: "var(--error-700)" }}>
            ⚠️ Critical: Less than 25% time remaining!
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Submit your work immediately to avoid automatic failure.
          </p>
        </div>
      )}
    </div>
  );
}
