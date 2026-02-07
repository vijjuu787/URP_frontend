import { useState } from "react";
import {
  Shield,
  ArrowRight,
  Github,
  Mail,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { parseResumeText } from "../utils/resume-parser";
import { apiCall } from "../utils/api";
import { API_BASE_URL } from "../../config/api";

interface SignupPageProps {
  onSignup: (data: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
    resumeUrl?: string;
  }) => Promise<void>;
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSignup, onSwitchToLogin }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [isProcessingResume, setIsProcessingResume] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // First, sign up the user
      await onSignup({
        fullName: name,
        email,
        password,
        role: "candidate",
        resumeUrl: "", // In production, you'd upload the file and get a URL
      });

      // If resume data was extracted, save it to the profile
      if (resumeData) {
        try {
          console.log("[SIGNUP] Saving extracted resume data to profile...");

          const profileData = {
            headline: resumeData.headline || "",
            summary: resumeData.summary || "",
            location: resumeData.location || "",
            phone: resumeData.phone || "",
            experiences: resumeData.experiences || [],
            educations: resumeData.educations || [],
            skills: resumeData.skills || {
              frontend: [],
              backend: [],
              tools: [],
            },
          };

          // Call the profile endpoint to save extracted data
          const profileResponse = await apiCall<any>(
            `${API_BASE_URL}/api/profile`,
            {
              method: "POST",
              body: JSON.stringify(profileData),
            },
          );

          console.log("[SIGNUP] Profile saved successfully:", profileResponse);
        } catch (profileErr) {
          // Log profile save error but don't fail signup
          console.error("[SIGNUP] Failed to save profile data:", profileErr);
          // Don't throw - user signup succeeded even if profile save fails
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or DOC file");
      return;
    }

    setResume(file);
    setIsProcessingResume(true);
    setError(null);

    try {
      // Extract text from resume file
      const resumeText = await extractResumeContent(file);

      // Parse the text to get structured data
      const parsed = parseResumeText(resumeText);

      console.log("[SIGNUP] Parsed resume data:", parsed);

      // Store parsed data for later use when signing up
      setResumeData(parsed);

      // Auto-fill form fields if they're empty
      if (!name && parsed.headline) {
        setName(parsed.headline);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to process resume";
      setError(errorMsg);
      setResume(null);
      setResumeData(null);
      console.error("[SIGNUP] Resume processing error:", err);
    } finally {
      setIsProcessingResume(false);
    }
  };

  /**
   * Extract text content from resume file
   * For PDF: requires pdf.js library
   * For demonstration, simulates extraction
   */
  const extractResumeContent = async (file: File): Promise<string> => {
    if (file.type === "application/pdf") {
      // TODO: Integrate pdf.js for actual PDF parsing
      // import * as pdfjsLib from 'pdfjs-dist';
      // pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      // const pdfData = await file.arrayBuffer();
      // const pdf = await pdfjsLib.getDocument(pdfData).promise;
      // ... extract text from all pages

      return "Senior Full Stack Developer\n\nExperience\nTechCorp Solutions - Senior Full Stack Developer | Jan 2023 - Present\nSan Francisco, CA\n• Led development of microservices\n• Improved system performance by 40%\n\nEducation\nBachelor of Science in Computer Science from UC Berkeley, 2016\n\nSkills: React, TypeScript, Node.js, Python, Docker, AWS";
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // TODO: Integrate docx parser for DOCX files
      // import { Document } from 'docx';
      // ... extract text from DOCX
      return "Resume content from DOCX file";
    } else if (file.type === "application/msword") {
      // Old DOC format
      return "Resume content from DOC file";
    }

    throw new Error("Unsupported file format");
  };

  const removeResume = () => {
    setResume(null);
    setResumeData(null);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "var(--gray-50)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div className="w-full max-w-md px-6">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
            style={{
              backgroundColor: "var(--primary-600)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <Shield className="w-8 h-8" style={{ color: "var(--fg-white)" }} />
          </div>
          <h1
            className="text-3xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Join the Elite
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Prove your skills. Get hired. No resume required.
          </p>
        </div>

        {/* Signup Form */}
        <div
          className="rounded-xl p-8"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          {/* Social Signup */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all hover:bg-gray-50"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all hover:bg-gray-50"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <Mail className="w-5 h-5" />
              Continue with Google
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full"
                style={{ borderTop: "1px solid var(--border-secondary)" }}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="px-2 font-medium"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-quaternary)",
                }}
              >
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="name"
                className="mb-1.5 block"
                style={{ color: "var(--text-secondary)" }}
              >
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            {/* Resume Upload Section */}
            <div>
              <Label
                className="mb-1.5 block"
                style={{ color: "var(--text-secondary)" }}
              >
                Upload Resume
              </Label>
              <p
                className="text-xs mb-2"
                style={{ color: "var(--text-quaternary)" }}
              >
                We'll auto-fill your profile from your resume
              </p>

              {!resume ? (
                <label
                  htmlFor="resume-upload"
                  className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed cursor-pointer transition-all hover:bg-gray-50"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: isProcessingResume
                      ? "var(--primary-400)"
                      : "var(--border-secondary)",
                    opacity: isProcessingResume ? 0.6 : 1,
                  }}
                >
                  <Upload
                    className="w-8 h-8 mb-2"
                    style={{ color: "var(--text-quaternary)" }}
                  />
                  <span
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {isProcessingResume
                      ? "Processing resume..."
                      : "Click to upload or drag and drop"}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-quaternary)" }}
                  >
                    {isProcessingResume
                      ? "Extracting data..."
                      : "PDF or DOC (max 5MB)"}
                  </span>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={isProcessingResume}
                    className="hidden"
                  />
                </label>
              ) : (
                <div
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{
                    backgroundColor: "var(--success-50)",
                    border: "1px solid var(--success-200)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--success-600)",
                      }}
                    >
                      <FileText
                        className="w-5 h-5"
                        style={{ color: "var(--fg-white)" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--success-700)" }}
                      >
                        {resume.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--success-600)" }}
                      >
                        {(resume.size / 1024).toFixed(2)} KB
                        {resumeData && " • Data extracted"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeResume}
                    className="p-1.5 rounded-lg hover:bg-white transition-colors"
                  >
                    <X
                      className="w-4 h-4"
                      style={{ color: "var(--success-700)" }}
                    />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 mr-2.5 rounded w-4 h-4 cursor-pointer"
                style={{ accentColor: "var(--primary-600)" }}
                required
              />
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-semibold"
                  style={{ color: "var(--primary-700)" }}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-semibold"
                  style={{ color: "var(--primary-700)" }}
                >
                  Privacy Policy
                </a>
              </span>
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
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="font-semibold"
                style={{ color: "var(--primary-700)" }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-6 text-sm"
          style={{ color: "var(--text-quaternary)" }}
        >
          Powered by Cypherock & Openvector
        </p>
      </div>
    </div>
  );
}
