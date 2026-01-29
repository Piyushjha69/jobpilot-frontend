"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Briefcase,
    MapPin,
    Building2,
    ExternalLink,
    Bookmark,
    Clock,
    Filter,
    ChevronDown,
    Loader2,
    AlertCircle,
    FileText,
    Upload,
    BarChart2,
    User,
    LogOut,
} from "lucide-react";
import { getJobs, getMatchedJobs, type Job, type JobFilters } from "@/services/jobs";
import { createApplication, type CreateApplicationInput } from "@/services/applications";
import { getResume, type Resume } from "@/services/resume";

const JOBS_PER_PAGE = 10;

export default function JobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [resume, setResume] = useState<Resume | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState("");
    const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [displayCount, setDisplayCount] = useState(JOBS_PER_PAGE);

    const [filters, setFilters] = useState<JobFilters>({
        keyword: "",
        location: "",
        company: "",
    });
    const [activeFilters, setActiveFilters] = useState<JobFilters>({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("accessToken")) {
                router.push("/login");
                return;
            }
        }

        fetchInitialData();
    }, [router]);

    const fetchInitialData = async () => {
        setIsLoading(true);
        setError("");

        try {
            const [resumeRes, jobsRes] = await Promise.all([
                getResume(),
                getJobs(),
            ]);

            if (resumeRes.success && resumeRes.data) {
                setResume(resumeRes.data);
                const matchedRes = await getMatchedJobs();
                if (matchedRes.success && matchedRes.data) {
                    setJobs(matchedRes.data);
                } else if (jobsRes.success && jobsRes.data) {
                    setJobs(jobsRes.data);
                }
            } else if (jobsRes.success && jobsRes.data) {
                setJobs(jobsRes.data);
            }
        } catch (err: any) {
            setError("Failed to load jobs");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setError("");
        setDisplayCount(JOBS_PER_PAGE);

        try {
            const searchFilters: JobFilters = {};
            if (filters.keyword?.trim()) searchFilters.keyword = filters.keyword.trim();
            if (filters.location?.trim()) searchFilters.location = filters.location.trim();
            if (filters.company?.trim()) searchFilters.company = filters.company.trim();

            setActiveFilters(searchFilters);

            const res = await getJobs(searchFilters);
            if (res.success && res.data) {
                setJobs(res.data);
            } else {
                setError(res.message || "Failed to search jobs");
            }
        } catch (err: any) {
            setError("Failed to search jobs");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async (job: Job) => {
        if (!resume) {
            router.push("/dashboard/resume");
            return;
        }

        setApplyingJobId(job._id);
        setError("");

        try {
            const input: CreateApplicationInput = {
                jobId: job._id,
                jobTitle: job.title,
                company: job.company,
                jobUrl: job.applyUrl,
                resumeId: resume._id,
            };

            const res = await createApplication(input);
            if (res.success) {
                setAppliedJobs((prev) => new Set([...prev, job._id]));
            } else {
                setError(res.message || "Failed to apply");
            }
        } catch (err: any) {
            setError("Failed to apply to job");
        } finally {
            setApplyingJobId(null);
        }
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setDisplayCount((prev) => prev + JOBS_PER_PAGE);
            setIsLoadingMore(false);
        }, 300);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 85) return "text-emerald-400";
        if (score >= 70) return "text-violet-400";
        if (score >= 50) return "text-amber-400";
        return "text-red-400";
    };

    const getMatchScoreBg = (score: number) => {
        if (score >= 85) return "bg-emerald-500/10 border-emerald-500/20";
        if (score >= 70) return "bg-violet-500/10 border-violet-500/20";
        if (score >= 50) return "bg-amber-500/10 border-amber-500/20";
        return "bg-red-500/10 border-red-500/20";
    };

    const displayedJobs = jobs.slice(0, displayCount);
    const hasMore = displayCount < jobs.length;

    if (isLoading && jobs.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-white/60">Loading jobs...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Subtle grain texture overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/5 z-40 hidden lg:block">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/5">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <Briefcase className="w-4 h-4 text-[#0a0a0a]" />
                            </div>
                            <span className="text-lg font-semibold tracking-tight">JobPilot</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <BarChart2 className="w-5 h-5" />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            href="/dashboard/jobs"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white"
                        >
                            <Search className="w-5 h-5" />
                            <span className="font-medium">Find Jobs</span>
                        </Link>
                        <Link
                            href="/dashboard/applications"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <FileText className="w-5 h-5" />
                            <span>Applications</span>
                        </Link>
                        <Link
                            href="/dashboard/resume"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Upload className="w-5 h-5" />
                            <span>My Resume</span>
                        </Link>
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-white/5">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">User</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-white/40 hover:text-white transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between p-4">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-[#0a0a0a]" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight">JobPilot</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-white/40 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex gap-1 px-4 pb-3 overflow-x-auto">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 text-sm whitespace-nowrap"
                    >
                        <BarChart2 className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/jobs"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white text-sm whitespace-nowrap"
                    >
                        <Search className="w-4 h-4" />
                        Find Jobs
                    </Link>
                    <Link
                        href="/dashboard/applications"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 text-sm whitespace-nowrap"
                    >
                        <FileText className="w-4 h-4" />
                        Applications
                    </Link>
                    <Link
                        href="/dashboard/resume"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 text-sm whitespace-nowrap"
                    >
                        <Upload className="w-4 h-4" />
                        Resume
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Find Jobs</h1>
                        <p className="text-white/50">
                            {resume
                                ? "Jobs are matched based on your resume"
                                : "Upload your resume to see match scores"}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <Card className="bg-[#111111] border-white/5 mb-6">
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-4">
                                {/* Main Search Row */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="text"
                                            placeholder="Job title, keywords..."
                                            value={filters.keyword || ""}
                                            onChange={(e) =>
                                                setFilters((prev) => ({ ...prev, keyword: e.target.value }))
                                            }
                                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 transition-colors"
                                        />
                                    </div>
                                    <Button
                                        onClick={() => setShowFilters(!showFilters)}
                                        variant="secondary"
                                        className="gap-2 border-white/10 sm:w-auto"
                                    >
                                        <Filter className="w-4 h-4" />
                                        Filters
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${
                                                showFilters ? "rotate-180" : ""
                                            }`}
                                        />
                                    </Button>
                                    <Button
                                        onClick={handleSearch}
                                        className="bg-white text-[#0a0a0a] hover:bg-white/90 gap-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Search className="w-4 h-4" />
                                        )}
                                        Search
                                    </Button>
                                </div>

                                {/* Expanded Filters */}
                                {showFilters && (
                                    <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-white/5">
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <input
                                                type="text"
                                                placeholder="Location..."
                                                value={filters.location || ""}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({ ...prev, location: e.target.value }))
                                                }
                                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <input
                                                type="text"
                                                placeholder="Company..."
                                                value={filters.company || ""}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({ ...prev, company: e.target.value }))
                                                }
                                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Filters Display */}
                    {Object.keys(activeFilters).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {activeFilters.keyword && (
                                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 gap-1">
                                    <Search className="w-3 h-3" />
                                    {activeFilters.keyword}
                                </Badge>
                            )}
                            {activeFilters.location && (
                                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {activeFilters.location}
                                </Badge>
                            )}
                            {activeFilters.company && (
                                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 gap-1">
                                    <Building2 className="w-3 h-3" />
                                    {activeFilters.company}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* No Resume Warning */}
                    {!resume && (
                        <div className="flex items-center gap-3 p-4 mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-amber-400">
                                    Upload your resume to see match scores and apply to jobs
                                </p>
                            </div>
                            <Button
                                size="sm"
                                className="bg-amber-500 text-black hover:bg-amber-400 gap-2"
                                asChild
                            >
                                <Link href="/dashboard/resume">
                                    <Upload className="w-4 h-4" />
                                    Upload
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-white/50">
                            {jobs.length === 0
                                ? "No jobs found"
                                : `Showing ${displayedJobs.length} of ${jobs.length} jobs`}
                        </p>
                    </div>

                    {/* Job Cards */}
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i} className="bg-[#111111] border-white/5 animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/10" />
                                            <div className="flex-1 space-y-3">
                                                <div className="h-5 bg-white/10 rounded w-1/3" />
                                                <div className="h-4 bg-white/5 rounded w-1/4" />
                                                <div className="h-4 bg-white/5 rounded w-full" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : jobs.length === 0 ? (
                        <Card className="bg-[#111111] border-white/5">
                            <CardContent className="py-16 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="w-8 h-8 text-white/40" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                                <p className="text-white/50 mb-6">
                                    Try adjusting your search filters or check back later
                                </p>
                                <Button
                                    onClick={() => {
                                        setFilters({ keyword: "", location: "", company: "" });
                                        setActiveFilters({});
                                        fetchInitialData();
                                    }}
                                    variant="secondary"
                                    className="border-white/10"
                                >
                                    Clear Filters
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {displayedJobs.map((job) => (
                                <Card
                                    key={job._id}
                                    className="bg-[#111111] border-white/5 hover:border-white/10 transition-colors group"
                                >
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Company Logo Placeholder */}
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-lg font-semibold text-white/80">
                                                    {job.company.charAt(0)}
                                                </span>
                                            </div>

                                            {/* Job Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg group-hover:text-violet-400 transition-colors">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/50 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <Building2 className="w-3.5 h-3.5" />
                                                                {job.company}
                                                            </span>
                                                            {job.location && (
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="w-3.5 h-3.5" />
                                                                    {job.location}
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {new Date(job.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Match Score */}
                                                    {resume && job.matchScore !== undefined && (
                                                        <div
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getMatchScoreBg(
                                                                job.matchScore
                                                            )}`}
                                                        >
                                                            <span
                                                                className={`text-sm font-semibold ${getMatchScoreColor(
                                                                    job.matchScore
                                                                )}`}
                                                            >
                                                                {job.matchScore}% match
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Description Preview */}
                                                <p className="text-sm text-white/60 line-clamp-2 mb-4">
                                                    {job.description}
                                                </p>

                                                {/* Actions */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {appliedJobs.has(job._id) ? (
                                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5">
                                                            <Bookmark className="w-3.5 h-3.5" />
                                                            Applied
                                                        </Badge>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 gap-2"
                                                            onClick={() => handleApply(job)}
                                                            disabled={applyingJobId === job._id}
                                                        >
                                                            {applyingJobId === job._id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Briefcase className="w-4 h-4" />
                                                            )}
                                                            Apply
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="border-white/10 gap-2"
                                                        asChild
                                                    >
                                                        <a
                                                            href={job.applyUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            View Original
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="text-center pt-4">
                                    <Button
                                        onClick={handleLoadMore}
                                        variant="secondary"
                                        className="border-white/10 gap-2"
                                        disabled={isLoadingMore}
                                    >
                                        {isLoadingMore ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                        Load More ({jobs.length - displayCount} remaining)
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
