"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Briefcase,
    ArrowRight,
    ChevronRight,
    BarChart2,
    Zap,
    FileCheck,
    CircleDot,
    Layers,
    Shield,
} from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-violet-500/30">
            {/* Subtle grain texture overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }} />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-[#0a0a0a]" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight">JobPilot</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm">
                        <a href="#features" className="text-white/60 hover:text-white transition-colors">Features</a>
                        <a href="#process" className="text-white/60 hover:text-white transition-colors">How it Works</a>
                        <a href="#pricing" className="text-white/60 hover:text-white transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button size="sm" className="bg-white text-[#0a0a0a] hover:bg-white/90" asChild>
                            <Link href="/register">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Accent line */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-[2px] bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                        <span className="text-sm font-medium text-white/50 uppercase tracking-widest">AI-Powered Hiring</span>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                                Know your
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400">
                                    match score
                                </span>
                                <br />
                                before you apply
                            </h1>

                            <p className="text-lg text-white/50 max-w-md mb-10 leading-relaxed">
                                Stop applying blindly. Our AI analyzes your resume against job descriptions and tells you exactly how relevant you are.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="bg-white text-[#0a0a0a] hover:bg-white/90 gap-2" asChild>
                                    <Link href="/register">
                                        Start for free
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="secondary" className="border-white/10 gap-2">
                                    See how it works
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-white/5">
                                <div>
                                    <div className="text-2xl font-bold">50k+</div>
                                    <div className="text-xs text-white/40 uppercase tracking-wide">Resumes Analyzed</div>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div>
                                    <div className="text-2xl font-bold">94%</div>
                                    <div className="text-xs text-white/40 uppercase tracking-wide">Accuracy Rate</div>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div>
                                    <div className="text-2xl font-bold">3x</div>
                                    <div className="text-xs text-white/40 uppercase tracking-wide">More Interviews</div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20 rounded-3xl blur-3xl opacity-50" />
                            
                            <Card className="relative bg-[#111111] border-white/5 overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Header bar */}
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                                        <div className="flex items-center gap-2">
                                            <CircleDot className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm font-medium">Match Analysis</span>
                                        </div>
                                        <span className="text-xs text-white/40">Live</span>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Score display */}
                                        <div className="text-center py-8">
                                            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-emerald-500/20 relative">
                                                <div className="absolute inset-2 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                                                <div className="text-center">
                                                    <div className="text-4xl font-bold text-emerald-400">87%</div>
                                                    <div className="text-xs text-white/40 uppercase">Match</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job card */}
                                        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-semibold">Senior Product Designer</h4>
                                                    <p className="text-sm text-white/40">Stripe • San Francisco</p>
                                                </div>
                                                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded">High Match</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-white/5 text-xs rounded text-white/60">Figma</span>
                                                <span className="px-2 py-1 bg-white/5 text-xs rounded text-white/60">Design Systems</span>
                                                <span className="px-2 py-1 bg-white/5 text-xs rounded text-white/60">Prototyping</span>
                                            </div>
                                        </div>

                                        {/* Skills breakdown */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-white/60">Skills Match</span>
                                                <span className="font-medium text-emerald-400">92%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full w-[92%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-white/60">Experience</span>
                                                <span className="font-medium text-violet-400">85%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full w-[85%] bg-gradient-to-r from-violet-500 to-fuchsia-400 rounded-full" />
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-white/60">Keywords</span>
                                                <span className="font-medium text-amber-400">78%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full w-[78%] bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-2xl mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-[2px] bg-violet-500" />
                            <span className="text-sm font-medium text-white/50 uppercase tracking-widest">Features</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Apply smarter,<br />not harder
                        </h2>
                        <p className="text-lg text-white/50">
                            Our AI understands what recruiters look for and helps you stand out.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
                        {[
                            {
                                icon: BarChart2,
                                title: "Relevance Score",
                                description: "Get an instant percentage match between your resume and any job description.",
                                accent: "from-violet-500 to-fuchsia-500"
                            },
                            {
                                icon: Zap,
                                title: "Instant Analysis",
                                description: "Results in seconds. Paste a job description and see your fit immediately.",
                                accent: "from-amber-500 to-orange-500"
                            },
                            {
                                icon: FileCheck,
                                title: "Gap Detection",
                                description: "Identify missing skills and keywords that could boost your application.",
                                accent: "from-emerald-500 to-teal-500"
                            },
                            {
                                icon: Layers,
                                title: "Resume Optimization",
                                description: "Get actionable suggestions to tailor your resume for each role.",
                                accent: "from-blue-500 to-cyan-500"
                            },
                            {
                                icon: Shield,
                                title: "Privacy First",
                                description: "Your data stays yours. We never share or sell your information.",
                                accent: "from-rose-500 to-pink-500"
                            },
                            {
                                icon: Briefcase,
                                title: "Application Tracking",
                                description: "Keep all your applications organized in one dashboard.",
                                accent: "from-indigo-500 to-violet-500"
                            }
                        ].map((feature, i) => (
                            <Card 
                                key={i} 
                                className="bg-[#111111] border-white/5 hover:bg-[#151515] transition-colors group"
                            >
                                <CardContent className="p-8">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} p-[1px] mb-6`}>
                                        <div className="w-full h-full bg-[#111111] rounded-xl flex items-center justify-center group-hover:bg-[#151515] transition-colors">
                                            <feature.icon className="w-5 h-5 text-white/80" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-24 px-6 bg-[#080808]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-8 h-[2px] bg-violet-500" />
                            <span className="text-sm font-medium text-white/50 uppercase tracking-widest">Process</span>
                            <div className="w-8 h-[2px] bg-violet-500" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Three steps to your next role
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Upload Resume", desc: "Drop your resume in PDF or Word format" },
                            { step: "02", title: "Paste Job Description", desc: "Copy the job posting you're interested in" },
                            { step: "03", title: "Get Your Score", desc: "See your match percentage and improvement tips" }
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                <div className="text-7xl font-bold text-white/[0.03] absolute -top-4 left-0">{item.step}</div>
                                <div className="relative pt-12">
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-white/50">{item.desc}</p>
                                </div>
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-16 -right-4 w-8">
                                        <ArrowRight className="w-5 h-5 text-white/20" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Ready to land your
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> dream job</span>?
                    </h2>
                    <p className="text-lg text-white/50 mb-10">
                        Join thousands of job seekers who are applying smarter with JobPilot.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-white text-[#0a0a0a] hover:bg-white/90 gap-2" asChild>
                            <Link href="/register">
                                Get started free
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                    <p className="text-sm text-white/30 mt-6">No credit card required</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                            <Briefcase className="w-3 h-3 text-[#0a0a0a]" />
                        </div>
                        <span className="text-sm font-medium">JobPilot</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-white/40">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                    <div className="text-sm text-white/30">
                        © 2025 JobPilot
                    </div>
                </div>
            </footer>
        </div>
    );
}
