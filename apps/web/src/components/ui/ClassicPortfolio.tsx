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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner with 3D Switch */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌲</span>
            <span className="font-bold text-amber-400 font-serif text-lg tracking-wide">
              {PROFILE.name}
            </span>
          </div>

          <button
            onClick={() => setViewMode("3d")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Enter 3D Multiplayer World</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <span>✨</span>
            <span>{PROFILE.status}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-serif">
            Hi, I&apos;m {PROFILE.name}. <br />
            <span className="text-amber-400">{PROFILE.tagline}</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            {PROFILE.bio}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`mailto:${PROFILE.email}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-colors"
            >
              <Mail className="w-4 h-4" /> Get in Touch
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-semibold text-sm transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-semibold text-sm transition-colors"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>

          {/* Metric Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
            <div>
              <div className="text-2xl font-black text-amber-400 font-mono">{PROFILE.stats.yearsOfExperience}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Years of Experience</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400 font-mono">{PROFILE.stats.projectsBuilt}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Production Projects</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400 font-mono">{PROFILE.stats.commitsCount}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Git Commits</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400 font-mono">{PROFILE.stats.cupsOfChai}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Cups of Chai</div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-serif text-white">Featured Engineering Projects</h2>
              <p className="text-sm text-slate-400 mt-1">High-throughput microservices, 3D graphics engines, and web apps</p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {["All", "Full-Stack", "3D & Graphics", "Systems & Real-Time", "AI & Tools"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProjectCat(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    projectCat === cat
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
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
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-white font-serif">{project.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        project.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : project.status === "ongoing"
                          ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="text-xs text-amber-400 font-medium">{project.tagline}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{project.description}</p>
                  {project.metrics && (
                    <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                      ⚡ {project.metrics}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
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
                        className="flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold"
                      >
                        <Github className="w-4 h-4" /> Source
                      </a>
                    )}
                    {project.demo && project.demo !== "#" && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold"
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
            <h2 className="text-2xl font-bold font-serif text-white">Skills & Technologies</h2>
            <p className="text-sm text-slate-400 mt-1">Tools and vernaculars I use to build scalable systems</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILL_GROUPS.map((grp) => (
              <div key={grp.category} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="font-bold text-sm text-amber-400 font-serif">{grp.category}</h3>
                <p className="text-xs text-slate-400">{grp.description}</p>
                <div className="space-y-2 pt-1">
                  {grp.skills.map((s) => (
                    <div key={s.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 text-xs">
                      <div>
                        <span className="font-bold text-white">{s.name}</span>
                        {s.highlight && <div className="text-[10px] text-slate-400">{s.highlight}</div>}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.level === "Mastery"
                            ? "bg-amber-400 text-slate-950"
                            : s.level === "Proficient"
                            ? "bg-emerald-400/20 text-emerald-300"
                            : "bg-purple-400/20 text-purple-300"
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
            {/* Education */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" /> Education
              </h2>
              {EDUCATION_LIST.map((edu) => (
                <div key={edu.id} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white text-sm">{edu.degree}</div>
                      <div className="text-xs text-amber-400">{edu.institution}</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
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

            {/* Achievements */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Milestones & Awards
              </h2>
              <div className="space-y-2.5">
                {ACHIEVEMENTS.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
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

        {/* Guestbook Form */}
        <section className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-white">Leave a Message</h2>
          <p className="text-xs text-slate-400">
            Send a note to Manoj&apos;s virtual mailbox. Messages appear in the 3D Post Office!
          </p>

          {sent ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Your note has been received! Thank you for visiting.
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-3">
              <input
                type="text"
                placeholder="Your name or company..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <textarea
                rows={3}
                placeholder="Your message..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
              <button
                type="submit"
                disabled={!msg.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send Note
              </button>
            </form>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 text-center text-xs text-slate-500">
        <p>© 2026 {PROFILE.name} • Mosswood — A Living, Multiplayer 3D Developer Portfolio</p>
      </footer>
    </div>
  );
};

