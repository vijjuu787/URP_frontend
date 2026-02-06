import { Shield, UserCog, Wrench } from "lucide-react";

interface RoleSelectorProps {
  onSelectRole: (role: "admin" | "engineer") => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "var(--gray-50)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div className="max-w-4xl w-full px-6">
        <div className="text-center mb-12">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--primary-600)" }}
          >
            <Shield className="w-8 h-8" style={{ color: "var(--fg-white)" }} />
          </div>
          <h1
            className="text-4xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            ProofSkill Review System
          </h1>
          <p className="text-lg" style={{ color: "var(--text-tertiary)" }}>
            Select your role to continue
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Admin Card */}
          <button
            onClick={() => onSelectRole("admin")}
            className="group rounded-xl border p-8 text-left transition-all hover:shadow-xl"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-secondary)",
            }}
          >
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-colors"
              style={{
                backgroundColor: "var(--primary-100)",
              }}
            >
              <UserCog
                className="w-7 h-7 transition-colors"
                style={{ color: "var(--primary-700)" }}
              />
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Admin Dashboard
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Manage candidate submissions, assign reviewers, and oversee the
              entire review process
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--primary-600)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  View all submissions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--primary-600)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Assign engineers to assignments
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--primary-600)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Filter and track progress
                </span>
              </div>
            </div>
          </button>

          {/* Engineer Card */}
          <button
            onClick={() => onSelectRole("engineer")}
            className="group rounded-xl border p-8 text-left transition-all hover:shadow-xl"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-secondary)",
            }}
          >
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-colors"
              style={{
                backgroundColor: "var(--success-100)",
              }}
            >
              <Wrench
                className="w-7 h-7 transition-colors"
                style={{ color: "var(--success-700)" }}
              />
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Engineer Dashboard
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Review assignments assigned to you, provide scores, and submit
              detailed feedback
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--success-600)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  View assigned submissions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--success-600)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Review code and files
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--success-600)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Score and provide feedback
                </span>
              </div>
            </div>
          </button>
        </div>

        <p
          className="text-center text-xs mt-8"
          style={{ color: "var(--text-quaternary)" }}
        >
          This is a demo environment. Real authentication is required in production.
        </p>
      </div>
    </div>
  );
}
