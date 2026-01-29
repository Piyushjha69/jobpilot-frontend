"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Briefcase,
    Upload,
    FileText,
    TrendingUp,
    Search,
    User,
    LogOut,
    Plus,
    BarChart2,
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    ChevronRight,
    Sparkles,
    Target,
    ArrowUpRight,
    MoreHorizontal,
    AlertCircle,
} from "lucide-react";
import { getApplications, getApplicationStats, type Application, type ApplicationStats } from "@/services/applications";
import { getResume, uploadResume, type Resume } from "@/services/resume";
import { getProfile } from "@/services/auth";
import Notifications from "@/components/Notifications";

export default function DashboardPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userName, setUserName] = useState("User");
    const [applications, setApplications] = useState<Application[]>([]);
    const [resume, setResume] = useState<Resume | null>(null);
    const [stats, setStats] = useState<ApplicationStats>({
        totalApplications: 0,
        interviews: 0,
        avgMatchScore: 0,
        thisWeek: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("accessToken")) {
                router.push("/login");
                return;
            }
        }

        fetchDashboardData();
    }, [router]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        setError("");

        try {
            const [applicationsRes, statsRes, resumeRes, profileRes] = await Promise.all([
                getApplications(),
                getApplicationStats(),
                getResume(),
                getProfile(),
            ]);

            if (applicationsRes.success && applicationsRes.data) {
                setApplications(applicationsRes.data);
            }

            if (statsRes.success && statsRes.data) {
                setStats(statsRes.data);
            }

            if (resumeRes.success && resumeRes.data) {
                setResume(resumeRes.data);
            }

            if (profileRes.success && profileRes.data) {
                setUserName(profileRes.data.name);
            }
        } catch (err: any) {
            setError("Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file");
            return;
        }

        setIsUploading(true);
        setError("");

        try {
            const res = await uploadResume(file);
            if (res.success && res.data) {
                setResume(res.data);
            } else {
                setError(res.message || "Failed to upload resume");
            }
        } catch (err: any) {
            setError("Failed to upload resume");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const getStatusColor = (status: Application["status"]) => {
        switch (status) {
            case "OFFER":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "INTERVIEW":
                return "bg-violet-500/10 text-violet-400 border-violet-500/20";
            case "APPLIED":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "REJECTED":
                return "bg-red-500/10 text-red-400 border-red-500/20";
            case "SAVED":
            default:
                return "bg-white/5 text-white/60 border-white/10";
        }
    };

    const getStatusIcon = (status: Application["status"]) => {
        switch (status) {
            case "OFFER":
                return <CheckCircle2 className="w-3.5 h-3.5" />;
            case "INTERVIEW":
                return <Calendar className="w-3.5 h-3.5" />;
            case "APPLIED":
                return <Clock className="w-3.5 h-3.5" />;
            case "REJECTED":
                return <XCircle className="w-3.5 h-3.5" />;
            case "SAVED":
            default:
                return <FileText className="w-3.5 h-3.5" />;
        }
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 85) return "text-emerald-400";
        if (score >= 70) return "text-violet-400";
        if (score >= 50) return "text-amber-400";
        return "text-red-400";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-white/60">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelect}
            />

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
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white"
                        >
                            <BarChart2 className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                            href="/dashboard/jobs"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                            <span>Find Jobs</span>
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
                                <p className="text-sm font-medium truncate">{userName}</p>
                                <p className="text-xs text-white/40">Free Plan</p>
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
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-40">
                <div className="flex items-center justify-between h-full px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-[#0a0a0a]" />
                        </div>
                        <span className="font-semibold">JobPilot</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Notifications />
                        <button
                            onClick={handleLogout}
                            className="p-2 text-white/60 hover:text-white"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="lg:pl-64 pt-16 lg:pt-0">
                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <span className="text-red-400 text-sm">{error}</span>
                            <button
                                onClick={() => setError("")}
                                className="ml-auto text-red-400 hover:text-red-300"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold mb-1">
                                Welcome back, {userName}
                            </h1>
                            <p className="text-white/50">
                                Here&apos;s what&apos;s happening with your job search
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Notifications />
                            <Button
                                size="sm"
                                className="bg-white text-[#0a0a0a] hover:bg-white/90 gap-2"
                                asChild
                            >
                                <Link href="/dashboard/jobs">
                                    <Plus className="w-4 h-4" />
                                    <span>New Application</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-[#111111] border-white/5">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-violet-400" />
                                    </div>
                                    {stats.totalApplications > 0 && (
                                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Active
                                        </span>
                                    )}
                                </div>
                                <div className="text-2xl font-bold mb-1">{stats.totalApplications}</div>
                                <div className="text-xs text-white/40">Total Applications</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#111111] border-white/5">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-emerald-400" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold mb-1">{stats.interviews}</div>
                                <div className="text-xs text-white/40">Interviews Scheduled</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#111111] border-white/5">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <Target className="w-5 h-5 text-amber-400" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold mb-1">{stats.avgMatchScore}%</div>
                                <div className="text-xs text-white/40">Avg Match Score</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#111111] border-white/5">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-blue-400" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold mb-1">{stats.thisWeek}</div>
                                <div className="text-xs text-white/40">Applied This Week</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Recent Applications */}
                        <div className="lg:col-span-2">
                            <Card className="bg-[#111111] border-white/5">
                                <CardHeader className="flex flex-row items-center justify-between pb-4">
                                    <CardTitle className="text-lg">Recent Applications</CardTitle>
                                    <Link
                                        href="/dashboard/applications"
                                        className="text-sm text-white/50 hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        View all
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {applications.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                                <FileText className="w-6 h-6 text-white/40" />
                                            </div>
                                            <p className="text-white/50 mb-4">No applications yet</p>
                                            <Button
                                                size="sm"
                                                className="bg-white text-[#0a0a0a] hover:bg-white/90 gap-2"
                                                asChild
                                            >
                                                <Link href="/dashboard/jobs">
                                                    <Search className="w-4 h-4" />
                                                    Find Jobs
                                                </Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {applications.slice(0, 5).map((app) => (
                                                <div
                                                    key={app._id}
                                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-semibold text-white/80">
                                                            {app.company.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-medium truncate">{app.jobTitle}</h4>
                                                        </div>
                                                        <p className="text-sm text-white/40">{app.company}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right hidden sm:block">
                                                            <div className={`text-sm font-semibold ${getMatchScoreColor(app.matchScore)}`}>
                                                                {app.matchScore}%
                                                            </div>
                                                            <div className="text-xs text-white/30">match</div>
                                                        </div>
                                                        <Badge
                                                            className={`${getStatusColor(app.status)} gap-1.5`}
                                                        >
                                                            {getStatusIcon(app.status)}
                                                            {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                                                        </Badge>
                                                        <button className="p-1.5 text-white/30 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Resume Card */}
                            <Card className="bg-[#111111] border-white/5">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Your Resume</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {resume ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-emerald-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{resume.name}</p>
                                                    <p className="text-xs text-white/40">
                                                        Updated {formatDate(resume.updatedAt || resume.createdAt)}
                                                    </p>
                                                </div>
                                                <ArrowUpRight className="w-4 h-4 text-white/40" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/40 mb-2">Top Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {resume.skills.slice(0, 4).map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2.5 py-1 bg-white/5 text-xs rounded-lg text-white/60"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {resume.skills.length > 4 && (
                                                        <span className="px-2.5 py-1 bg-white/5 text-xs rounded-lg text-white/40">
                                                            +{resume.skills.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="w-full border-white/10 gap-2"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4" />
                                                        Update Resume
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                                <Upload className="w-6 h-6 text-white/40" />
                                            </div>
                                            <p className="text-sm text-white/50 mb-4">
                                                Upload your resume to get started
                                            </p>
                                            <Button
                                                size="sm"
                                                className="bg-white text-[#0a0a0a] hover:bg-white/90 gap-2"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4" />
                                                        Upload Resume
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="bg-[#111111] border-white/5">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-2">
                                    <Link
                                        href="/dashboard/jobs"
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                            <Search className="w-4 h-4 text-violet-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Find New Jobs</p>
                                            <p className="text-xs text-white/40">Browse matching opportunities</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/30" />
                                    </Link>
                                    <Link
                                        href="/dashboard/analyze"
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Analyze Job Match</p>
                                            <p className="text-xs text-white/40">Check your fit for a role</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/30" />
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Pro Tip */}
                            <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/20">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-4 h-4 text-violet-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm mb-1">Pro Tip</h4>
                                            <p className="text-xs text-white/60 leading-relaxed">
                                                Apply to jobs with 80%+ match scores to increase your
                                                interview chances by 3x.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
