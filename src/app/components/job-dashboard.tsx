import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Check,
  X,
  Building2,
} from "lucide-react";
import { Input } from "./ui/input";
import { apiCall } from "../utils/api";

interface JobDashboardProps {
  onApplyForJob: (job: Job) => void;
  currentUser: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  workType: "Remote" | "Hybrid" | "On-site";
  jobType: "Full-time" | "Contract" | "Part-time";
  experienceRequired: string;
  salaryRange: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  postedDate: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
}

export function JobDashboard({
  onApplyForJob,
  currentUser,
}: JobDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    workType: "",
    jobType: "",
    minMatch: 0,
  });

  // Fetch jobs from API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("[JOB_DASHBOARD] Fetching jobs from API");

        const result = await apiCall<any>(
          "http://localhost:5100/api/job-postings",
          {
            method: "GET",
          },
        );

        console.log("[JOB_DASHBOARD] Jobs fetched:", result);

        // Transform API data to match Job interface
        const transformedJobs: Job[] = (result || []).map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company || "Unknown Company",
          companyLogo: job.company?.substring(0, 2).toUpperCase() || "UC",
          location: job.location || "Remote",
          workType: job.workType || "Remote",
          jobType: job.jobType || "Full-time",
          experienceRequired: job.experienceLevel || "Not specified",
          salaryRange: job.salaryRange || "Competitive",
          matchScore: job.matchScore || 75,
          matchedSkills: job.matchedSkills || [],
          missingSkills: job.missingSkills || [],
          postedDate: job.postDate
            ? new Date(job.postDate).toLocaleDateString()
            : "Recently posted",
          description: job.description || "",
          requirements: job.requirements || [],
          responsibilities: job.responsibilities || [],
          benefits: job.benefits || [],
        }));

        setJobs(transformedJobs);
      } catch (err) {
        console.error("[JOB_DASHBOARD] Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
        // Fall back to empty array if API fails
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch applied assignments for current candidate
  useEffect(() => {
    if (currentUser?.id) {
      const fetchAppliedJobs = async () => {
        try {
          console.log(
            "[JOB_DASHBOARD] Fetching applied assignments for candidate:",
            currentUser.id,
          );

          const result = await apiCall<any>(
            `http://localhost:5100/api/assignment-starts/candidate/${currentUser.id}`,
            {
              method: "GET",
            },
          );

          console.log("[JOB_DASHBOARD] Applied assignments fetched:", result);

          // Extract job IDs from the assignment starts
          const appliedIds = (result?.data || [])
            .filter((item: any) => item.job?.id)
            .map((item: any) => item.job.id);

          console.log("[JOB_DASHBOARD] Applied job IDs:", appliedIds);
          setAppliedJobIds(appliedIds);
        } catch (err) {
          console.error(
            "[JOB_DASHBOARD] Error fetching applied assignments:",
            err,
          );
          // Don't show error to user, just log it
          setAppliedJobIds([]);
        }
      };

      fetchAppliedJobs();
    }
  }, [currentUser?.id]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.matchedSkills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesWorkType =
      !filters.workType || job.workType === filters.workType;
    const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
    const matchesMinScore = job.matchScore >= filters.minMatch;

    return (
      matchesSearch && matchesWorkType && matchesJobType && matchesMinScore
    );
  });

  const sortedJobs = [...filteredJobs].sort(
    (a, b) => b.matchScore - a.matchScore,
  );

  return (
    <div
      className="flex-1 h-screen overflow-hidden flex flex-col"
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
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="mb-4">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Recommended Jobs for You
            </h1>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              Based on your skills, experience, and preferences
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "var(--text-quaternary)" }}
              />
              <Input
                placeholder="Search by job title, company, or skills..."
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

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 h-11 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: showFilters
                  ? "var(--gray-700)"
                  : "var(--bg-primary)",
                color: showFilters
                  ? "var(--fg-white)"
                  : "var(--text-secondary)",
                border: `1px solid ${showFilters ? "var(--gray-700)" : "var(--border-primary)"}`,
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div
              className="mt-4 p-4 rounded-lg border"
              style={{
                backgroundColor: "var(--gray-50)",
                borderColor: "var(--border-secondary)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Work Type
                  </label>
                  <select
                    value={filters.workType}
                    onChange={(e) =>
                      setFilters({ ...filters, workType: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border text-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="">All</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) =>
                      setFilters({ ...filters, jobType: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border text-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="">All</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Minimum Match
                  </label>
                  <select
                    value={filters.minMatch}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minMatch: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border text-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="0">Any Match</option>
                    <option value="70">70% or higher</option>
                    <option value="80">80% or higher</option>
                    <option value="90">90% or higher</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() =>
                      setFilters({ workType: "", jobType: "", minMatch: 0 })
                    }
                    className="w-full h-10 px-4 rounded-lg font-medium text-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-primary)",
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-12">
              <p style={{ color: "var(--text-secondary)" }}>Loading jobs...</p>
            </div>
          ) : error ? (
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: "var(--error-50)",
                border: "1px solid var(--error-200)",
                color: "var(--error-700)",
              }}
            >
              <p className="font-medium">{error}</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {sortedJobs.length} {sortedJobs.length === 1 ? "job" : "jobs"}{" "}
                  found
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Sorted by match score
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sortedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-lg border p-6 transition-all hover:border-gray-400"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-primary)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className="w-12 h-12 rounded flex items-center justify-center font-bold flex-shrink-0"
                          style={{
                            backgroundColor: "var(--gray-100)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {job.companyLogo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-bold text-lg mb-1 leading-tight"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {job.title}
                          </h3>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {job.company}
                          </p>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div
                        className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 flex-shrink-0"
                        style={{
                          backgroundColor:
                            job.matchScore >= 85
                              ? "var(--success-50)"
                              : job.matchScore >= 75
                                ? "var(--primary-50)"
                                : "var(--warning-50)",
                          border: `1px solid ${
                            job.matchScore >= 85
                              ? "var(--success-300)"
                              : job.matchScore >= 75
                                ? "var(--primary-300)"
                                : "var(--warning-300)"
                          }`,
                        }}
                      >
                        <TrendingUp
                          className="w-4 h-4"
                          style={{
                            color:
                              job.matchScore >= 85
                                ? "var(--success-700)"
                                : job.matchScore >= 75
                                  ? "var(--primary-700)"
                                  : "var(--warning-700)",
                          }}
                        />
                        <span
                          className="text-sm font-bold"
                          style={{
                            color:
                              job.matchScore >= 85
                                ? "var(--success-700)"
                                : job.matchScore >= 75
                                  ? "var(--primary-700)"
                                  : "var(--warning-700)",
                          }}
                        >
                          {job.matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Job Meta */}
                    <div
                      className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.workType}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{job.jobType}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        <span>{job.experienceRequired}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {job.salaryRange}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Posted {job.postedDate}
                      </p>
                    </div>

                    <p
                      className="text-sm mb-4 leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {job.description}
                    </p>

                    {/* Matched Skills */}
                    <div className="mb-3">
                      <p
                        className="text-xs font-semibold mb-2 flex items-center gap-1.5"
                        style={{ color: "var(--success-700)" }}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Matched Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.matchedSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: "var(--success-50)",
                              color: "var(--success-700)",
                              border: "1px solid var(--success-200)",
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    {job.missingSkills.length > 0 && (
                      <div className="mb-4">
                        <p
                          className="text-xs font-semibold mb-2 flex items-center gap-1.5"
                          style={{ color: "var(--warning-700)" }}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Missing Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {job.missingSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: "var(--warning-50)",
                                color: "var(--warning-700)",
                                border: "1px solid var(--warning-200)",
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Apply Button */}
                    <button
                      onClick={() => onApplyForJob(job)}
                      className="w-full h-11 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                      style={{
                        backgroundColor: appliedJobIds.includes(job.id)
                          ? "var(--success-600)"
                          : "var(--gray-900)",
                        color: "var(--fg-white)",
                        boxShadow: "var(--shadow-xs)",
                      }}
                    >
                      {appliedJobIds.includes(job.id) ? (
                        <>
                          <Check className="w-4 h-4" />
                          Applied
                        </>
                      ) : (
                        <>
                          Apply Now
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
