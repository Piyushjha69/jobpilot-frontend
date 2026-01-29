"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Briefcase,
    Upload,
    FileText,
    Search,
    User,
    LogOut,
    BarChart2,
    Sparkles,
    Target,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowRight,
} from "lucide-react";
import { getResume, type Resume } from "@/services/resume";
import { analyzeJobMatch, type JobMatchAnalysis } from "@/services/jobs";

export default function AnalyzeJobMatchPage() {
    const router = useRouter();
    const [resume, setResume] = useState<Resume | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("accessToken")) {
                router.push("/login");
                return;
            }
        }
        fetchResume();
    }, [router]);

    const fetchResume = async () => {
        setIsLoading(true);
        try {
            const res = await getResume();
            if (res.success && res.data) {
                setResume(res.data);
            }
        } catch (err: any) {
            console.error("Failed to fetch resume");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            setError("Please paste a job description");
            return;
        }

        if (jobDescription.length < 50) {
            setError("Job description is too short. Please provide more details.");
            return;
        }

        setIsAnalyzing(true);
        setError("");
        setAnalysis(null);

        try {
            const res = await analyzeJobMatch(jobDescription);
            if (res.success && res.data) {
                setAnalysis(res.data);
            } else {
                setError(res.message || "Failed to analyze job match");
            }
        } catch (err: any) {
            setError("Failed to analyze job match");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return "text-emerald-400";
        if (score >= 70) return "text-violet-400";
        if (score >= 50) return "text-amber-400";
        return "text-red-400";
    };

    const getScoreGradient = (score: number) => {
        if (score >= 85) return "from-emerald-500 to-emerald-400";
        if (score >= 70) return "from-violet-500 to-fuchsia-400";
        if (score >= 50) return "from-amber-500 to-amber-400";
        return "from-red-500 to-red-400";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-white/60">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/5 z-40 hidden lg:block">
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-white/5">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <Briefcase className="w-4 h-4 text-[#0a0a0a]" />
                            </div>
                            <span className="text-lg font-semibold tracking-tight">JobPilot</span>
                        </Link>
                    </div>

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
                        <Link
                            href="/dashboard/analyze"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white"
                        >
                            <Sparkles className="w-5 h-5" />
                            <span className="font-medium">Analyze Match</span>
                        </Link>
                    </nav>

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

            {/* Main Content */}
            <main className="lg:pl-64">
                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold mb-2">Analyze Job Match</h1>
                        <p className="text-white/50">
                            Paste a job description to see how well your resume matches the requirements.
                        </p>
                    </div>

                    {!resume ? (
                        <Card className="bg-[#111111] border-white/5">
                            <CardContent className="p-12 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-6">
                                    <Upload className="w-8 h-8 text-violet-400" />
                                </div>
                                <h2 className="text-xl font-semibold mb-2">Upload Your Resume First</h2>
                                <p className="text-white/50 mb-6 max-w-md mx-auto">
                                    To analyze job matches, you need to upload your resume. We'll compare your skills and experience with job requirements.
                                </p>
                                <Button
                                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white gap-2"
                                    asChild
                                >
                                    <Link href="/dashboard/resume">
                                        <Upload className="w-4 h-4" />
                                        Upload Resume
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {/* Input Section */}
                            <Card className="bg-[#111111] border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-violet-400" />
                                        Job Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the full job description here..."
                                        className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 resize-none"
                                    />
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-white/40">
                                            {jobDescription.length} characters
                                        </p>
                                        <Button
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing || !jobDescription.trim()}
                                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white gap-2"
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4" />
                                                    Analyze Match
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Results Section */}
                            {analysis && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    {/* Overall Score */}
                                    <Card className="bg-gradient-to-br from-[#111111] to-[#0d0d0d] border-white/5 overflow-hidden">
                                        <CardContent className="p-8">
                                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                                {/* Circular Progress */}
                                                <div className="relative w-40 h-40">
                                                    <svg className="w-40 h-40 transform -rotate-90">
                                                        <circle
                                                            cx="80"
                                                            cy="80"
                                                            r="70"
                                                            stroke="currentColor"
                                                            strokeWidth="8"
                                                            fill="none"
                                                            className="text-white/5"
                                                        />
                                                        <circle
                                                            cx="80"
                                                            cy="80"
                                                            r="70"
                                                            stroke="url(#scoreGradient)"
                                                            strokeWidth="8"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeDasharray={`${2 * Math.PI * 70}`}
                                                            strokeDashoffset={`${2 * Math.PI * 70 * (1 - analysis.overallScore / 100)}`}
                                                            className="transition-all duration-1000 ease-out"
                                                        />
                                                        <defs>
                                                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor={analysis.overallScore >= 70 ? "#8b5cf6" : analysis.overallScore >= 50 ? "#f59e0b" : "#ef4444"} />
                                                                <stop offset="100%" stopColor={analysis.overallScore >= 70 ? "#d946ef" : analysis.overallScore >= 50 ? "#f59e0b" : "#ef4444"} />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                                                            {analysis.overallScore}%
                                                        </span>
                                                        <span className="text-sm text-white/40">Match</span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 text-center lg:text-left">
                                                    <h2 className="text-2xl font-bold mb-2">Overall Match Score</h2>
                                                    <p className="text-white/60 mb-4">{analysis.matchSummary}</p>
                                                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                                        <Badge className={`${analysis.overallScore >= 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                            {analysis.skillsMatch.matchPercentage}% Skills Match
                                                        </Badge>
                                                        <Badge className={`${analysis.keywordsAnalysis.matchPercentage >= 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                            {analysis.keywordsAnalysis.matchPercentage}% Keywords Match
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="grid lg:grid-cols-2 gap-6">
                                        {/* Skills Match */}
                                        <Card className="bg-[#111111] border-white/5">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Target className="w-5 h-5 text-violet-400" />
                                                    Skills Match
                                                    <Badge className="ml-auto bg-white/5 text-white/60">
                                                        {analysis.skillsMatch.matchPercentage}%
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {/* Progress Bar */}
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.skillsMatch.matchPercentage)} transition-all duration-1000`}
                                                        style={{ width: `${analysis.skillsMatch.matchPercentage}%` }}
                                                    />
                                                </div>

                                                {/* Matched Skills */}
                                                {analysis.skillsMatch.matched.length > 0 && (
                                                    <div>
                                                        <p className="text-sm text-white/50 mb-2 flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                            Matched Skills ({analysis.skillsMatch.matched.length})
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {analysis.skillsMatch.matched.map((skill, i) => (
                                                                <Badge
                                                                    key={i}
                                                                    className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Missing Skills */}
                                                {analysis.skillsMatch.missing.length > 0 && (
                                                    <div>
                                                        <p className="text-sm text-white/50 mb-2 flex items-center gap-2">
                                                            <XCircle className="w-4 h-4 text-red-400" />
                                                            Missing Skills ({analysis.skillsMatch.missing.length})
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {analysis.skillsMatch.missing.map((skill, i) => (
                                                                <Badge
                                                                    key={i}
                                                                    className="bg-red-500/10 text-red-400 border-red-500/20"
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {analysis.skillsMatch.matched.length === 0 && analysis.skillsMatch.missing.length === 0 && (
                                                    <p className="text-white/40 text-sm">No specific skills detected in the job description.</p>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Keywords Analysis */}
                                        <Card className="bg-[#111111] border-white/5">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Search className="w-5 h-5 text-fuchsia-400" />
                                                    Keywords Analysis
                                                    <Badge className="ml-auto bg-white/5 text-white/60">
                                                        {analysis.keywordsAnalysis.matchPercentage}%
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {/* Progress Bar */}
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.keywordsAnalysis.matchPercentage)} transition-all duration-1000`}
                                                        style={{ width: `${analysis.keywordsAnalysis.matchPercentage}%` }}
                                                    />
                                                </div>

                                                {/* Found Keywords */}
                                                {analysis.keywordsAnalysis.found.length > 0 && (
                                                    <div>
                                                        <p className="text-sm text-white/50 mb-2 flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                            Found in Resume ({analysis.keywordsAnalysis.found.length})
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {analysis.keywordsAnalysis.found.map((keyword, i) => (
                                                                <Badge
                                                                    key={i}
                                                                    className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                >
                                                                    {keyword}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Required Keywords */}
                                                {analysis.keywordsAnalysis.required.length > 0 && (
                                                    <div>
                                                        <p className="text-sm text-white/50 mb-2 flex items-center gap-2">
                                                            <AlertCircle className="w-4 h-4 text-amber-400" />
                                                            All Required Keywords ({analysis.keywordsAnalysis.required.length})
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {analysis.keywordsAnalysis.required.map((keyword, i) => (
                                                                <Badge
                                                                    key={i}
                                                                    className={analysis.keywordsAnalysis.found.includes(keyword) 
                                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                        : "bg-white/5 text-white/40 border-white/10"
                                                                    }
                                                                >
                                                                    {keyword}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {analysis.keywordsAnalysis.required.length === 0 && (
                                                    <p className="text-white/40 text-sm">No specific keywords detected.</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Recommendations */}
                                    <Card className="bg-[#111111] border-white/5">
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-amber-400" />
                                                Recommendations
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-3">
                                                {analysis.recommendations.map((rec, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <ArrowRight className="w-3 h-3 text-violet-400" />
                                                        </div>
                                                        <p className="text-white/70">{rec}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    {/* Save as Application */}
                                    <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/20">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="text-center sm:text-left">
                                                    <h3 className="font-semibold mb-1">Ready to Apply?</h3>
                                                    <p className="text-sm text-white/60">
                                                        Save this job to your applications to track your progress.
                                                    </p>
                                                </div>
                                                <Button
                                                    className="bg-white text-[#0a0a0a] hover:bg-white/90 gap-2"
                                                    asChild
                                                >
                                                    <Link href="/dashboard/jobs">
                                                        <Search className="w-4 h-4" />
                                                        Find Similar Jobs
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
