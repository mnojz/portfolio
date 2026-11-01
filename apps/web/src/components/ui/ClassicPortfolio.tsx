"use client";

import React, { useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  Trophy,
  GraduationCap,
  Heart,
  Compass,
  ArrowRight,
  Send,
  CheckCircle,
  Sparkles,
  MapPin,
} from "lucide-react";
import { PROFILE } from "@/content/profile";
import { PROJECTS } from "@/content/projects";
import { SKILL_GROUPS } from "@/content/skills";
import { EDUCATION_LIST } from "@/content/education";
import { ACHIEVEMENTS } from "@/content/achievements";
import { HOBBIES } from "@/content/hobbies";
import { useGameStore } from "@/stores/useGameStore";

export const ClassicPortfolio: React.FC = () => {
  const setViewMode = useGameStore((s) => s.setViewMode);
  const [projectCat, setProjectCat] = useState("All");

  // Guestbook
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    try {
      await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: name || "Recruiter / Visitor", message: msg }),
      });
      setSent(true);
      setMsg("");
      setTimeout(() => setSent(false), 4000);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#090D12] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Floating Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090D12]/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌲</span>
            <div>
              <span className="font-serif font-bold text-amber-200 text-lg tracking-wide">
                {PROFILE.name}
              </span>
              <span className="hidden sm:inline-block text-[11px] text-stone-400 ml-2">
                — Full-Stack Engineer
              </span>
            </div>
          </div>

          <button
            onClick={() => setViewMode("3d")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Enter 3D World</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{PROFILE.status}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            Hi, I&apos;m {PROFILE.name}. <br />
            <span className="text-amber-400">{PROFILE.tagline}</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            {PROFILE.bio}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`mailto:${PROFILE.email}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Mail className="w-4 h-4" /> Email Manoj
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs transition-colors"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>

          {/* Metric Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/5">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-3xl font-bold font-mono text-amber-400">{PROFILE.stats.yearsOfExperience}</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold mt-1">Years Experience</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-3xl font-bold font-mono text-amber-400">{PROFILE.stats.projectsBuilt}</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold mt-1">Projects Built</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-3xl font-bold font-mono text-amber-400">{PROFILE.stats.commitsCount}</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold mt-1">Git Commits</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-3xl font-bold font-mono text-amber-400">{PROFILE.stats.cupsOfChai}</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold mt-1">Cups of Chai</div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white">Featured Engineering Projects</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Distributed backends, 3D systems, and high-performance apps</p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {["All", "Full-Stack", "3D & Graphics", "Systems & Real-Time", "AI & Tools"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProjectCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    projectCat === cat
                      ? "bg-amber-500 text-slate-950 font-bold shadow"
                      : "bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROJECTS.filter((p) => projectCat === "All" || p.category === projectCat).map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      {project.title}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        project.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : project.status === "ongoing"
                          ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="text-xs text-amber-400/90 font-medium">{project.tagline}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{project.description}</p>
                  {project.metrics && (
                    <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/20 px-3 py-1 rounded-xl border border-emerald-800/30">
                      ⚡ {project.metrics}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px] font-semibold border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-1 text-xs">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold transition-colors"
                      >
                        <Github className="w-4 h-4" /> Source
                      </a>
                    )}
                    {project.demo && project.demo !== "#" && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Knowledge */}
        <section id="skills" className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">Skills & Technologies</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Tools and vernaculars I use to build systems</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILL_GROUPS.map((grp) => (
              <div key={grp.category} className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
                <h3 className="font-serif font-bold text-base text-amber-400">{grp.category}</h3>
                <p className="text-xs text-slate-400">{grp.description}</p>
                <div className="space-y-2 pt-1">
                  {grp.skills.map((s) => (
                    <div key={s.name} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs">
                      <div>
                        <span className="font-bold text-white">{s.name}</span>
                        {s.highlight && <div className="text-[10px] text-slate-400">{s.highlight}</div>}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                          s.level === "Mastery"
                            ? "bg-amber-400 text-slate-950"
                            : s.level === "Proficient"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                            : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                        }`}
                      >
                        {s.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Achievements */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" /> Education
              </h2>
              {EDUCATION_LIST.map((edu) => (
                <div key={edu.id} className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white text-sm">{edu.degree}</div>
                      <div className="text-xs text-amber-400">{edu.institution}</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      {edu.period}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 pt-1">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-amber-500">•</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Milestones & Honors
              </h2>
              <div className="space-y-2.5">
                {ACHIEVEMENTS.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-white">{ach.title}</span>
                      <span className="text-[10px] font-mono text-amber-400">{ach.year}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{ach.issuer}</div>
                    <p className="text-xs text-slate-300">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Guestbook Section */}
        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white">Leave a Message in the Mailbox</h2>
          <p className="text-xs text-slate-400">
            Messages sent here are recorded in the portfolio guestbook and appear in the 3D Post Office!
          </p>

          {sent ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Your note has been received! Thank you for visiting.
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-3">
              <input
                type="text"
                placeholder="Your name or handle..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <textarea
                rows={3}
                placeholder="Your note..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={!msg.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Drop Dispatch in Mailbox
              </button>
            </form>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-xs text-slate-500 font-sans">
        <p>© 2026 {PROFILE.name} • Mosswood — A Living, Multiplayer 3D Developer Portfolio</p>
      </footer>
    </div>
  );
};
