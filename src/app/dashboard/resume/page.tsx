"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Briefcase,
    Upload,
    FileText,
    Trash2,
    Download,
    Eye,
    EyeOff,
    CheckCircle2,
    XCircle,
    Search,
    BarChart2,
    User,
    LogOut,
    AlertCircle,
    File,
    Calendar,
} from "lucide-react";
import { getResume, uploadResume, type Resume } from "@/services/resume";

export default function ResumePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [resume, setResume] = useState<Resume | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("accessToken")) {
                router.push("/login");
                return;
            }
        }

        fetchResume();
    }, [router]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const fetchResume = async () => {
        setIsLoading(true);
        setError("");

        try {
            const res = await getResume();
            if (res.success && res.data) {
                setResume(res.data);
            }
        } catch (err: any) {
            setError("Failed to load resume");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
    };

    const handleFileUpload = async (file: File) => {
        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file");
            return;
        }

        setIsUploading(true);
        setError("");
        setSuccessMessage("");

        try {
            const res = await uploadResume(file);
            if (res.success && res.data) {
                setResume(res.data);
                setSuccessMessage("Resume uploaded successfully!");
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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    }, []);

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
                    <span className="text-white/60">Loading resume...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelect}
            />

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
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white"
                        >
                            <Upload className="w-5 h-5" />
                            <span className="font-medium">My Resume</span>
                        </Link>
                    </nav>

                    <div className="p-4 border-t border-white/5">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">User</p>
                                <p className="text-xs text-white/40 truncate">Account</p>
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
            <main className="lg:ml-64 min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4 lg:hidden">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <Briefcase className="w-4 h-4 text-[#0a0a0a]" />
                                </div>
                            </Link>
                        </div>
                        <div className="hidden lg:block">
                            <h1 className="text-xl font-semibold">My Resume</h1>
                            <p className="text-sm text-white/50">Manage your resume and skills</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-[#0a0a0a] hover:bg-white/90 gap-2"
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
                                        {resume ? "Replace Resume" : "Upload Resume"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <p className="text-sm text-emerald-400">{successMessage}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {resume ? (
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Resume Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="bg-[#111111] border-white/5">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg">Resume Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-6">
                                        {/* File Info */}
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                                <File className="w-6 h-6 text-emerald-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{resume.name}</p>
                                                <div className="flex items-center gap-2 text-sm text-white/40">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Uploaded {formatDate(resume.createdAt)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowPreview(!showPreview)}
                                                    className="text-white/60 hover:text-white gap-2"
                                                >
                                                    {showPreview ? (
                                                        <>
                                                            <EyeOff className="w-4 h-4" />
                                                            <span className="hidden sm:inline">Hide</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="w-4 h-4" />
                                                            <span className="hidden sm:inline">Preview</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        {resume.email && (
                                            <div>
                                                <p className="text-xs text-white/40 mb-2">Contact Email</p>
                                                <p className="text-sm">{resume.email}</p>
                                            </div>
                                        )}

                                        {/* Skills */}
                                        <div>
                                            <p className="text-xs text-white/40 mb-3">Extracted Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {resume.skills.length > 0 ? (
                                                    resume.skills.map((skill, i) => (
                                                        <Badge
                                                            key={i}
                                                            variant="secondary"
                                                            className="bg-white/5 text-white/70 border-white/10"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-white/40">No skills extracted</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Resume Preview */}
                                        {showPreview && resume.text && (
                                            <div>
                                                <p className="text-xs text-white/40 mb-3">Resume Text</p>
                                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 max-h-96 overflow-y-auto">
                                                    <pre className="text-sm text-white/70 whitespace-pre-wrap font-sans leading-relaxed">
                                                        {resume.text}
                                                    </pre>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Experience Section */}
                                {resume.experience && resume.experience.length > 0 && (
                                    <Card className="bg-[#111111] border-white/5">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-lg">Experience</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="space-y-4">
                                                {resume.experience.map((exp, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                                                            <Briefcase className="w-5 h-5 text-violet-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium">{exp.position}</p>
                                                            <p className="text-sm text-white/50">{exp.company}</p>
                                                            {exp.duration && (
                                                                <p className="text-xs text-white/40 mt-1">{exp.duration}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Right Sidebar */}
                            <div className="space-y-6">
                                {/* Upload New Resume */}
                                <Card className="bg-[#111111] border-white/5">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg">Update Resume</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`
                                                relative p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all
                                                ${isDragging
                                                    ? "border-violet-500 bg-violet-500/10"
                                                    : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                                                }
                                            `}
                                        >
                                            <div className="flex flex-col items-center text-center">
                                                <div className={`
                                                    w-12 h-12 rounded-xl flex items-center justify-center mb-3
                                                    ${isDragging ? "bg-violet-500/20" : "bg-white/5"}
                                                `}>
                                                    <Upload className={`w-6 h-6 ${isDragging ? "text-violet-400" : "text-white/40"}`} />
                                                </div>
                                                <p className="text-sm font-medium mb-1">
                                                    {isDragging ? "Drop your resume here" : "Drag & drop your resume"}
                                                </p>
                                                <p className="text-xs text-white/40">or click to browse</p>
                                                <p className="text-xs text-white/30 mt-2">PDF files only</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Stats */}
                                <Card className="bg-[#111111] border-white/5">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg">Resume Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                                            <span className="text-sm text-white/50">Skills</span>
                                            <span className="font-semibold">{resume.skills.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                                            <span className="text-sm text-white/50">Experience</span>
                                            <span className="font-semibold">{resume.experience?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                                            <span className="text-sm text-white/50">Last Updated</span>
                                            <span className="text-sm">{formatDate(resume.updatedAt || resume.createdAt)}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Tips Card */}
                                <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/20">
                                    <CardContent className="p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                                <AlertCircle className="w-4 h-4 text-violet-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm mb-1">Keep it Updated</h4>
                                                <p className="text-xs text-white/60 leading-relaxed">
                                                    Update your resume regularly to ensure accurate job matching and better recommendations.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        /* No Resume - Upload Zone */
                        <Card className="bg-[#111111] border-white/5">
                            <CardContent className="p-8">
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`
                                        relative p-12 rounded-xl border-2 border-dashed cursor-pointer transition-all
                                        ${isDragging
                                            ? "border-violet-500 bg-violet-500/10"
                                            : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                                        }
                                    `}
                                >
                                    <div className="flex flex-col items-center text-center max-w-md mx-auto">
                                        <div className={`
                                            w-16 h-16 rounded-2xl flex items-center justify-center mb-4
                                            ${isDragging ? "bg-violet-500/20" : "bg-white/5"}
                                        `}>
                                            <Upload className={`w-8 h-8 ${isDragging ? "text-violet-400" : "text-white/40"}`} />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            {isDragging ? "Drop your resume here" : "Upload Your Resume"}
                                        </h3>
                                        <p className="text-sm text-white/50 mb-4">
                                            Drag and drop your resume here, or click to browse your files
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-white/30">
                                            <FileText className="w-4 h-4" />
                                            <span>PDF files only (max 10MB)</span>
                                        </div>
                                        <Button
                                            className="mt-6 bg-white text-[#0a0a0a] hover:bg-white/90 gap-2"
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
                                                    Select File
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
