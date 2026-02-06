import { useState } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  TrendingUp,
  Star,
  Filter,
  X,
  ChevronRight,
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface JobListingsProps {
  userSkills?: string[];
  preferredRole?: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  workType: string;
  jobType: string;
  salary: string;
  experience: string;
  postedDate: string;
  applicants: number;
  matchScore: number;
  tags: string[];
  description: string;
  requirements: string[];
  responsibilities: string[];
  featured: boolean;
}

export function JobListings({ userSkills = [], preferredRole = "" }: JobListingsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    workType: "",
    jobType: "",
    experience: "",
    salaryMin: "",
  });

  // Mock job data - would come from API based on skill assessment
  const jobs: Job[] = [
    {
      id: 1,
      title: "Senior Security Engineer",
      company: "CyberShield Inc.",
      logo: "CS",
      location: "San Francisco, CA",
      workType: "Remote",
      jobType: "Full-time",
      salary: "$140k - $180k",
      experience: "5-8 years",
      postedDate: "2 days ago",
      applicants: 23,
      matchScore: 95,
      featured: true,
      tags: ["Cybersecurity", "Python", "AWS", "Kubernetes"],
      description:
        "We're looking for a Senior Security Engineer to join our growing team and help build secure, scalable infrastructure for our enterprise clients.",
      requirements: [
        "5+ years of experience in cybersecurity",
        "Strong knowledge of Python and Go",
        "Experience with AWS security tools",
        "Kubernetes security expertise",
      ],
      responsibilities: [
        "Design and implement security architecture",
        "Conduct security audits and penetration testing",
        "Collaborate with DevOps team on secure CI/CD",
        "Mentor junior security engineers",
      ],
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "TechFlow Solutions",
      logo: "TF",
      location: "New York, NY",
      workType: "Hybrid",
      jobType: "Full-time",
      salary: "$120k - $160k",
      experience: "3-5 years",
      postedDate: "1 week ago",
      applicants: 45,
      matchScore: 88,
      featured: true,
      tags: ["React", "Node.js", "TypeScript", "AWS"],
      description:
        "Join our product team to build next-generation SaaS applications used by Fortune 500 companies.",
      requirements: [
        "3+ years of full-stack development",
        "Expert in React and Node.js",
        "TypeScript proficiency",
        "Experience with cloud platforms",
      ],
      responsibilities: [
        "Build scalable web applications",
        "Collaborate with design team on UX",
        "Write clean, maintainable code",
        "Participate in code reviews",
      ],
    },
    {
      id: 3,
      title: "DevOps Engineer",
      company: "CloudNative Systems",
      logo: "CN",
      location: "Austin, TX",
      workType: "Remote",
      jobType: "Full-time",
      salary: "$130k - $170k",
      experience: "5-8 years",
      postedDate: "3 days ago",
      applicants: 31,
      matchScore: 92,
      featured: false,
      tags: ["Kubernetes", "Docker", "AWS", "Terraform"],
      description:
        "We need a DevOps engineer to help scale our infrastructure and improve our deployment pipeline.",
      requirements: [
        "5+ years of DevOps experience",
        "Expert in Kubernetes and Docker",
        "AWS certification preferred",
        "Infrastructure as Code experience",
      ],
      responsibilities: [
        "Manage cloud infrastructure",
        "Optimize CI/CD pipelines",
        "Monitor system performance",
        "Automate deployment processes",
      ],
    },
    {
      id: 4,
      title: "Backend Engineer",
      company: "DataStream Analytics",
      logo: "DS",
      location: "Seattle, WA",
      workType: "Remote",
      jobType: "Full-time",
      salary: "$110k - $150k",
      experience: "3-5 years",
      postedDate: "5 days ago",
      applicants: 38,
      matchScore: 85,
      featured: false,
      tags: ["Python", "PostgreSQL", "Redis", "FastAPI"],
      description:
        "Build high-performance backend systems for real-time data processing and analytics.",
      requirements: [
        "3+ years of backend development",
        "Strong Python skills",
        "Database optimization experience",
        "API design expertise",
      ],
      responsibilities: [
        "Develop RESTful APIs",
        "Optimize database queries",
        "Implement caching strategies",
        "Write unit and integration tests",
      ],
    },
    {
      id: 5,
      title: "Systems Engineer",
      company: "InfraCore Technologies",
      logo: "IC",
      location: "Boston, MA",
      workType: "On-site",
      jobType: "Full-time",
      salary: "$125k - $165k",
      experience: "5-8 years",
      postedDate: "1 week ago",
      applicants: 19,
      matchScore: 80,
      featured: false,
      tags: ["Linux", "Networking", "C++", "Systems"],
      description:
        "Join our systems team to build low-level infrastructure and optimize performance.",
      requirements: [
        "5+ years of systems engineering",
        "Deep understanding of Linux internals",
        "C/C++ programming skills",
        "Networking protocols knowledge",
      ],
      responsibilities: [
        "Design system architecture",
        "Optimize system performance",
        "Troubleshoot complex issues",
        "Collaborate with hardware teams",
      ],
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesWorkType = !filters.workType || job.workType === filters.workType;
    const matchesJobType = !filters.jobType || job.jobType === filters.jobType;

    return matchesSearch && matchesWorkType && matchesJobType;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.matchScore - a.matchScore;
  });

  return (
    <div
      className="flex-1 h-screen overflow-hidden"
      style={{
        backgroundColor: "var(--gray-50)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div className="flex h-full">
        {/* Job Listings Sidebar */}
        <div
          className={`${
            selectedJob ? "hidden lg:flex" : "flex"
          } flex-col w-full lg:w-96 xl:w-[28rem] border-r overflow-hidden`}
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)",
          }}
        >
          {/* Header */}
          <div className="p-6 border-b" style={{ borderColor: "var(--border-primary)" }}>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Recommended Jobs
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Based on your skills and preferences
            </p>
          </div>

          {/* Search & Filters */}
          <div className="p-4 border-b space-y-3" style={{ borderColor: "var(--border-primary)" }}>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--text-quaternary)" }}
              />
              <Input
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
                style={{
                  backgroundColor: "var(--gray-50)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium w-full"
              style={{
                backgroundColor: showFilters ? "var(--primary-50)" : "var(--gray-100)",
                color: showFilters ? "var(--primary-700)" : "var(--text-secondary)",
                border: `1px solid ${showFilters ? "var(--primary-200)" : "var(--border-secondary)"}`,
              }}
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters && <X className="w-3 h-3 ml-auto" />}
            </button>

            {showFilters && (
              <div className="space-y-3 pt-2">
                <select
                  value={filters.workType}
                  onChange={(e) => setFilters({ ...filters, workType: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border text-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">All Work Types</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>

                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border text-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            )}
          </div>

          {/* Job List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {sortedJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="w-full text-left p-4 rounded-lg mb-2 transition-all"
                  style={{
                    backgroundColor:
                      selectedJob?.id === job.id ? "var(--primary-50)" : "transparent",
                    border:
                      selectedJob?.id === job.id
                        ? "1px solid var(--primary-200)"
                        : "1px solid transparent",
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center font-bold flex-shrink-0"
                      style={{
                        backgroundColor: "var(--primary-100)",
                        color: "var(--primary-700)",
                      }}
                    >
                      {job.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className="font-semibold truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {job.title}
                        </h3>
                        {job.featured && (
                          <Star
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: "var(--warning-500)", fill: "var(--warning-500)" }}
                          />
                        )}
                      </div>
                      <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.postedDate}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {job.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: "var(--gray-100)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded"
                      style={{
                        backgroundColor:
                          job.matchScore >= 90
                            ? "var(--success-50)"
                            : job.matchScore >= 80
                            ? "var(--primary-50)"
                            : "var(--warning-50)",
                        color:
                          job.matchScore >= 90
                            ? "var(--success-700)"
                            : job.matchScore >= 80
                            ? "var(--primary-700)"
                            : "var(--warning-700)",
                      }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs font-bold">{job.matchScore}%</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Details Panel */}
        <div className="flex-1 overflow-y-auto">
          {selectedJob ? (
            <div className="max-w-4xl mx-auto p-6 md:p-8">
              {/* Back button for mobile */}
              <button
                onClick={() => setSelectedJob(null)}
                className="lg:hidden flex items-center gap-2 mb-4 text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to jobs
              </button>

              {/* Job Header */}
              <div
                className="rounded-xl p-6 md:p-8 border mb-6"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0"
                    style={{
                      backgroundColor: "var(--primary-100)",
                      color: "var(--primary-700)",
                    }}
                  >
                    {selectedJob.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                          {selectedJob.title}
                        </h1>
                        <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
                          {selectedJob.company}
                        </p>
                      </div>
                      {selectedJob.featured && (
                        <span
                          className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
                          style={{
                            backgroundColor: "var(--warning-50)",
                            color: "var(--warning-700)",
                            border: "1px solid var(--warning-200)",
                          }}
                        >
                          <Zap className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm" style={{ color: "var(--text-tertiary)" }}>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {selectedJob.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        {selectedJob.workType}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {selectedJob.jobType}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Posted {selectedJob.postedDate}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div
                    className="flex-1 p-4 rounded-lg"
                    style={{
                      backgroundColor: "var(--gray-50)",
                      border: "1px solid var(--border-secondary)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4" style={{ color: "var(--text-quaternary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                        Salary Range
                      </span>
                    </div>
                    <p className="font-bold" style={{ color: "var(--text-primary)" }}>
                      {selectedJob.salary}
                    </p>
                  </div>

                  <div
                    className="flex-1 p-4 rounded-lg"
                    style={{
                      backgroundColor: "var(--gray-50)",
                      border: "1px solid var(--border-secondary)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4" style={{ color: "var(--text-quaternary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                        Match Score
                      </span>
                    </div>
                    <p className="font-bold" style={{ color: "var(--success-600)" }}>
                      {selectedJob.matchScore}% Match
                    </p>
                  </div>

                  <div
                    className="flex-1 p-4 rounded-lg"
                    style={{
                      backgroundColor: "var(--gray-50)",
                      border: "1px solid var(--border-secondary)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4" style={{ color: "var(--text-quaternary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                        Applicants
                      </span>
                    </div>
                    <p className="font-bold" style={{ color: "var(--text-primary)" }}>
                      {selectedJob.applicants} candidates
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedJob.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: "var(--primary-50)",
                        color: "var(--primary-700)",
                        border: "1px solid var(--primary-200)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 sm:flex-none px-6 py-3 rounded-lg font-semibold"
                    style={{
                      backgroundColor: "var(--primary-600)",
                      color: "var(--fg-white)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    Apply Now
                  </Button>
                  <Button
                    className="px-6 py-3 rounded-lg font-semibold"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-primary)",
                    }}
                  >
                    Save Job
                  </Button>
                </div>
              </div>

              {/* Job Description */}
              <div
                className="rounded-xl p-6 md:p-8 border mb-6"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                  About the Role
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {selectedJob.description}
                </p>
              </div>

              {/* Requirements */}
              <div
                className="rounded-xl p-6 md:p-8 border mb-6"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: "var(--success-600)" }}
                      />
                      <span style={{ color: "var(--text-secondary)" }}>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsibilities */}
              <div
                className="rounded-xl p-6 md:p-8 border"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                  Responsibilities
                </h2>
                <ul className="space-y-3">
                  {selectedJob.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                        style={{ backgroundColor: "var(--primary-600)" }}
                      />
                      <span style={{ color: "var(--text-secondary)" }}>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "var(--gray-100)" }}
                >
                  <Briefcase className="w-8 h-8" style={{ color: "var(--text-quaternary)" }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  Select a job to view details
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  Choose from {sortedJobs.length} recommended positions that match your skills
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
