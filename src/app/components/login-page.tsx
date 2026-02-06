import { useState } from "react";
import { Shield, ArrowRight, User, UserCog } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginPageProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
  onSwitchToSignup: () => void;
}

export function LoginPage({ onLogin, onSwitchToSignup }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReviewLogin, setShowReviewLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    console.log("handleSubmit called with", { email, password });

    try {
      console.log("Calling onLogin...");
      await onLogin({ email, password });
      console.log("onLogin succeeded");
    } catch (err) {
      console.error("onLogin failed:", err);
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (
    userType: "candidate" | "admin" | "review-admin" | "engineer",
  ) => {
    console.log("Quick login as", userType);
    let quickEmail = "";
    let quickPassword = "";

    if (userType === "candidate") {
      quickEmail = "sarah.johnson@email.com";
      quickPassword = "candidate123";
    } else if (userType === "engineer") {
      quickEmail = "engineer@review.com";
      quickPassword = "engineer123";
    }

    setEmail(quickEmail);
    setPassword(quickPassword);
    setError(null);
    setIsLoading(true);

    try {
      await onLogin({ email: quickEmail, password: quickPassword });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "var(--gray-50)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-6 md:mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl mb-3 md:mb-4"
            style={{
              backgroundColor: "var(--primary-600)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <Shield
              className="w-7 h-7 md:w-8 md:h-8"
              style={{ color: "var(--fg-white)" }}
            />
          </div>
          <h1
            className="text-2xl md:text-3xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Welcome Back
          </h1>
          <p
            className="text-sm md:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign in to continue your proof-of-skill journey
          </p>
        </div>

        {/* Quick Login Options */}
        <div className="mb-5 md:mb-6 space-y-3">
          <p
            className="text-xs font-semibold uppercase tracking-wide text-center mb-3"
            style={{ color: "var(--text-quaternary)" }}
          >
            Quick Login (Demo)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickLogin("candidate")}
              className="rounded-lg p-3 md:p-4 border-2 transition-all hover:scale-105"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--primary-200)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <User
                className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2"
                style={{ color: "var(--primary-600)" }}
              />
              <p
                className="text-xs md:text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Candidate
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Sarah Johnson
              </p>
            </button>
            <button
              onClick={() => handleQuickLogin("admin")}
              className="rounded-lg p-3 md:p-4 border-2 transition-all hover:scale-105"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--success-200)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <UserCog
                className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2"
                style={{ color: "var(--success-600)" }}
              />
              <p
                className="text-xs md:text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Admin
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Organization
              </p>
            </button>
          </div>

          {/* Engineer Demo Highlight */}
          <div
            className="p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02]"
            onClick={() => handleQuickLogin("review-engineer")}
            style={{
              backgroundColor: "var(--success-50)",
              borderColor: "var(--success-300)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: "var(--success-600)",
                  color: "var(--fg-white)",
                }}
              >
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-1"
                  style={{ color: "var(--success-700)" }}
                >
                  🎯 Try Engineer Portal
                </p>
                <p
                  className="text-sm font-bold mb-0.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  David Kim - Senior Backend Engineer
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Review assignments • Score submissions • Provide feedback
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-5 md:my-6">
          <div className="absolute inset-0 flex items-center">
            <div
              className="w-full border-t"
              style={{ borderColor: "var(--border-secondary)" }}
            ></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span
              className="px-2"
              style={{
                backgroundColor: "var(--gray-50)",
                color: "var(--text-quaternary)",
              }}
            >
              Or continue with
            </span>
          </div>
        </div>

        {/* Login Form */}
        <div
          className="rounded-xl p-6 md:p-8"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="email"
                className="mb-1.5 block"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="security@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-xs)",
                }}
                required
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="mb-1.5 block"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-xs)",
                }}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 rounded w-4 h-4 cursor-pointer"
                  style={{ accentColor: "var(--primary-600)" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm font-semibold"
                style={{ color: "var(--primary-700)" }}
              >
                Forgot password?
              </a>
            </div>

            {error && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--error-50)",
                  border: "1px solid var(--error-200)",
                  color: "var(--error-700)",
                }}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
              style={{
                backgroundColor: "var(--primary-600)",
                color: "var(--fg-white)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Don't have an account?{" "}
              <button
                onClick={onSwitchToSignup}
                className="font-semibold"
                style={{ color: "var(--primary-700)" }}
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Review System Access */}
          <div
            className="mt-6 pt-6 border-t"
            style={{ borderColor: "var(--border-secondary)" }}
          >
            <button
              onClick={() => setShowReviewLogin(!showReviewLogin)}
              className="w-full text-xs font-semibold uppercase tracking-wide mb-3"
              style={{ color: "var(--text-tertiary)" }}
            >
              {showReviewLogin
                ? "− Hide Review System"
                : "+ Access Review System"}
            </button>
            {showReviewLogin && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleQuickLogin("review-admin")}
                  className="rounded-lg p-3 border transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--gray-50)",
                    borderColor: "var(--border-secondary)",
                  }}
                >
                  <UserCog
                    className="w-5 h-5 mx-auto mb-2"
                    style={{ color: "var(--primary-600)" }}
                  />
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Review Admin
                  </p>
                </button>
                <button
                  onClick={() => handleQuickLogin("review-engineer")}
                  className="rounded-lg p-3 border transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--gray-50)",
                    borderColor: "var(--border-secondary)",
                  }}
                >
                  <User
                    className="w-5 h-5 mx-auto mb-2"
                    style={{ color: "var(--success-600)" }}
                  />
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Engineer
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-5 md:mt-6 text-xs md:text-sm"
          style={{ color: "var(--text-quaternary)" }}
        >
          Powered by Cypherock & Openvector
        </p>
      </div>
    </div>
  );
}
