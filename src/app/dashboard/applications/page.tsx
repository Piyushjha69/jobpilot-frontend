"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronDown,
    MoreHorizontal,
    ExternalLink,
    Briefcase,
    Search,
    Upload,
    BarChart2,
    User,
    LogOut,
    AlertCircle,
    Filter,
} from "lucide-react";
import {
    getApplications,
    updateApplicationStatus,
    type Application,
} from "@/services/applications";

type StatusFilter = "ALL" | Application["status"];

const STATUS_OPTIONS: Application["status"][] = ["SAVED", "APPLIED", "INTERVIEW", "REJECTED", "OFFER"];

export default function ApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("accessToken")) {
                router.push("/login");
                return;
            }
        }
        fetchApplications();
    }, [router]);

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const fetchApplications = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await getApplications();
            if (res.success && res.data) {
                setApplications(res.data);
            } else {
                setError(res.message || "Failed to fetch applications");
            }
        } catch (err: any) {
            setError("Failed to load applications");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: Application["status"]) => {
        setUpdatingId(id);
        setOpenDropdownId(null);
        try {
            const res = await updateApplicationStatus(id, newStatus);
            if (res.success && res.data) {
                setApplications((prev) =>
                    prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
                );
            }
        } catch (err) {
            // Silent fail, could add toast notification
        } finally {
            setUpdatingId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
    };

    const filteredApplications =
        statusFilter === "ALL"
            ? applications
            : applications.filter((app) => app.status === statusFilter);

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
                    <span className="text-white/60">Loading applications...</span>
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
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                            <span>Find Jobs</span>
                        </Link>
                        <Link
                            href="/dashboard/applications"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white"
                        >
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">Applications</span>
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
                                <User className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">User</p>
                                <p className="text-xs text-white/40 truncate">View Profile</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors mt-1"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50">
                <div className="flex items-center justify-between h-full px-4">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-[#0a0a0a]" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight">JobPilot</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="lg:pl-64 pt-16 lg:pt-0">
                <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Applications</h1>
                            <p className="text-white/50">
                                Track and manage your job applications
                            </p>
                        </div>
                        <Button
                            className="bg-white text-[#0a0a0a] hover:bg-white/90 gap-2"
                            asChild
                        >
                            <Link href="/dashboard/jobs">
                                <Search className="w-4 h-4" />
                                Find Jobs
                            </Link>
                        </Button>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-400">{error}</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={fetchApplications}
                                className="ml-auto text-red-400 hover:text-red-300"
                            >
                                Retry
                            </Button>
                        </div>
                    )}

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                        <div className="flex items-center gap-1 text-white/40 mr-2">
                            <Filter className="w-4 h-4" />
                        </div>
                        {(["ALL", ...STATUS_OPTIONS] as StatusFilter[]).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                    statusFilter === status
                                        ? "bg-white text-[#0a0a0a]"
                                        : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                                {status !== "ALL" && (
                                    <span className="ml-2 text-xs opacity-60">
                                        {applications.filter((a) => a.status === status).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Applications List */}
                    <Card className="bg-[#111111] border-white/5">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">
                                {statusFilter === "ALL" ? "All Applications" : `${statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Applications`}
                                <span className="ml-2 text-sm font-normal text-white/40">
                                    ({filteredApplications.length})
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {filteredApplications.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <FileText className="w-8 h-8 text-white/30" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">No applications found</h3>
                                    <p className="text-white/50 mb-6 max-w-sm mx-auto">
                                        {statusFilter === "ALL"
                                            ? "Start your job search and save jobs you're interested in."
                                            : `You don't have any ${statusFilter.toLowerCase()} applications yet.`}
                                    </p>
                                    <Button
                                        className="bg-white text-[#0a0a0a] hover:bg-white/90 gap-2"
                                        asChild
                                    >
                                        <Link href="/dashboard/jobs">
                                            <Search className="w-4 h-4" />
                                            Browse Jobs
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredApplications.map((app) => (
                                        <div
                                            key={app._id}
                                            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
                                        >
                                            {/* Company Icon */}
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-lg font-semibold text-white/80">
                                                    {app.company.charAt(0)}
                                                </span>
                                            </div>

                                            {/* Job Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium truncate">{app.jobTitle}</h4>
                                                    {app.jobUrl && (
                                                        <a
                                                            href={app.jobUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-white/30 hover:text-white transition-colors"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                                <p className="text-sm text-white/40">{app.company}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-white/30">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {formatDate(app.appliedAt || app.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Match Score */}
                                            <div className="flex items-center gap-4 sm:gap-6">
                                                <div className="text-center">
                                                    <div className={`text-lg font-bold ${getMatchScoreColor(app.matchScore)}`}>
                                                        {app.matchScore}%
                                                    </div>
                                                    <div className="text-xs text-white/30">match</div>
                                                </div>

                                                {/* Status Dropdown */}
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenDropdownId(openDropdownId === app._id ? null : app._id);
                                                        }}
                                                        disabled={updatingId === app._id}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${getStatusColor(app.status)} ${
                                                            updatingId === app._id ? "opacity-50" : "hover:opacity-80"
                                                        }`}
                                                    >
                                                        {updatingId === app._id ? (
                                                            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            getStatusIcon(app.status)
                                                        )}
                                                        <span className="text-sm">
                                                            {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                                                        </span>
                                                        <ChevronDown className="w-3.5 h-3.5" />
                                                    </button>

                                                    {openDropdownId === app._id && (
                                                        <div
                                                            className="absolute right-0 top-full mt-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {STATUS_OPTIONS.map((status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => handleStatusUpdate(app._id, status)}
                                                                    className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors ${
                                                                        app.status === status ? "bg-white/5" : ""
                                                                    }`}
                                                                >
                                                                    <span className={getStatusColor(status).split(" ")[1]}>
                                                                        {status === "OFFER" && <CheckCircle2 className="w-4 h-4" />}
                                                                        {status === "INTERVIEW" && <Calendar className="w-4 h-4" />}
                                                                        {status === "APPLIED" && <Clock className="w-4 h-4" />}
                                                                        {status === "REJECTED" && <XCircle className="w-4 h-4" />}
                                                                        {status === "SAVED" && <FileText className="w-4 h-4" />}
                                                                    </span>
                                                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                                                    {app.status === status && (
                                                                        <CheckCircle2 className="w-4 h-4 ml-auto text-white/40" />
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* More Options */}
                                                <button className="p-2 text-white/30 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/5 z-50">
                <div className="flex items-center justify-around h-full">
                    <Link
                        href="/dashboard"
                        className="flex flex-col items-center gap-1 text-white/40"
                    >
                        <BarChart2 className="w-5 h-5" />
                        <span className="text-xs">Dashboard</span>
                    </Link>
                    <Link
                        href="/dashboard/jobs"
                        className="flex flex-col items-center gap-1 text-white/40"
                    >
                        <Search className="w-5 h-5" />
                        <span className="text-xs">Jobs</span>
                    </Link>
                    <Link
                        href="/dashboard/applications"
                        className="flex flex-col items-center gap-1 text-white"
                    >
                        <FileText className="w-5 h-5" />
                        <span className="text-xs font-medium">Applications</span>
                    </Link>
                    <Link
                        href="/dashboard/resume"
                        className="flex flex-col items-center gap-1 text-white/40"
                    >
                        <Upload className="w-5 h-5" />
                        <span className="text-xs">Resume</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
