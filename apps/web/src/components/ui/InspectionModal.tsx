"use client";

import React, { useState } from "react";
import {
  X,
  ExternalLink,
  Github,
  Mail,
  Linkedin,
  Sparkles,
  BookOpen,
  Trophy,
  Heart,
  Send,
  Code2,
  CheckCircle,
} from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";
import { PROFILE } from "@/content/profile";
import { PROJECTS } from "@/content/projects";
import { SKILL_GROUPS } from "@/content/skills";
import { HOBBIES } from "@/content/hobbies";
import { EDUCATION_LIST } from "@/content/education";
import { ACHIEVEMENTS } from "@/content/achievements";

export const InspectionModal: React.FC = () => {
  const activeModal = useGameStore((s) => s.activeModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const selectedProject = useGameStore((s) => s.selectedProject);
  const activeEasterEgg = useGameStore((s) => s.activeEasterEgg);
  const randomJournalEntry = useGameStore((s) => s.randomJournalEntry);

  // Guestbook local state
  const [guestAuthor, setGuestAuthor] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [guestSubmitted, setGuestSubmitted] = useState(false);

  // Project Category Filter
  const [projectFilter, setProjectFilter] = useState<string>("All");

  if (!activeModal) return null;

  const handlePostGuestbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestMessage.trim()) return;
    try {
      await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: guestAuthor || "Wandering Traveler",
          message: guestMessage,
        }),
      });
      setGuestSubmitted(true);
      setGuestMessage("");
      setTimeout(() => setGuestSubmitted(false), 4000);
    } catch (err) {
      console.warn("Guestbook submit error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-amber-50 text-slate-900 border-4 border-amber-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Parchment Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-amber-700/30 bg-amber-100/90">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {activeModal === "home" && "🏡"}
              {activeModal === "workshop" && "⚙️"}
              {activeModal === "pond" && "🎣"}
              {activeModal === "library" && "📚"}
              {activeModal === "post_office" && "✉️"}
              {activeModal === "lookout" && "🏔️"}
              {activeModal === "project_detail" && "💻"}
              {activeModal === "easter_egg" && "✨"}
              {activeModal === "journal" && "📖"}
            </span>
            <h2 className="text-lg font-serif font-black tracking-wide text-amber-950">
              {activeModal === "home" && "The Home — About Manoj"}
              {activeModal === "workshop" && "The Workshop — Engineering Projects"}
              {activeModal === "pond" && "The Pond — Personal Side & Hobbies"}
              {activeModal === "library" && "The Library — Knowledge & Stack"}
              {activeModal === "post_office" && "The Post Office — Contact & Guestbook"}
              {activeModal === "lookout" && "The Lookout — Journey & Milestones"}
              {activeModal === "project_detail" && selectedProject?.title}
              {activeModal === "easter_egg" && (activeEasterEgg?.title || "Secret Discovery")}
              {activeModal === "journal" && "The Forgotten Journal"}
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parchment Body Scrollable */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 text-sm font-sans leading-relaxed text-amber-950">
          {/* 1. THE HOME (About Manoj) */}
          {activeModal === "home" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300">
                <div className="text-xs uppercase font-bold tracking-widest text-amber-700">Developer Profile</div>
                <div className="text-xl font-serif font-bold text-amber-950 mt-1">{PROFILE.name}</div>
                <div className="text-xs font-semibold text-amber-800">{PROFILE.tagline}</div>
                <div className="text-xs text-amber-700 mt-0.5">📍 {PROFILE.location}</div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-amber-900 mb-2">My Story & Philosophy</h3>
                {PROFILE.story.map((paragraph, i) => (
                  <p key={i} className="mb-2 text-slate-800 text-xs sm:text-sm">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-3 rounded-xl bg-amber-100 border border-amber-300/80 text-center">
                  <div className="text-lg font-black text-amber-900 font-mono">{PROFILE.stats.yearsOfExperience}</div>
                  <div className="text-[10px] uppercase font-bold text-amber-700">Experience</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-100 border border-amber-300/80 text-center">
                  <div className="text-lg font-black text-amber-900 font-mono">{PROFILE.stats.projectsBuilt}</div>
                  <div className="text-[10px] uppercase font-bold text-amber-700">Projects Built</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-100 border border-amber-300/80 text-center">
                  <div className="text-lg font-black text-amber-900 font-mono">{PROFILE.stats.commitsCount}</div>
                  <div className="text-[10px] uppercase font-bold text-amber-700">Commits</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-100 border border-amber-300/80 text-center">
                  <div className="text-lg font-black text-amber-900 font-mono">{PROFILE.stats.cupsOfChai}</div>
                  <div className="text-[10px] uppercase font-bold text-amber-700">Cups of Chai</div>
                </div>
              </div>
            </div>
          )}

          {/* 2. THE WORKSHOP (Projects) */}
          {activeModal === "workshop" && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {["All", "Full-Stack", "3D & Graphics", "Systems & Real-Time", "AI & Tools"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProjectFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      projectFilter === cat
                        ? "bg-amber-800 text-amber-50"
                        : "bg-amber-200/80 hover:bg-amber-300 text-amber-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 gap-3">
                {PROJECTS.filter((p) => projectFilter === "All" || p.category === projectFilter).map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-2xl bg-amber-100/80 border border-amber-300/80 hover:border-amber-500 transition-all shadow-sm space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-serif text-base text-amber-950">{project.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              project.status === "completed"
                                ? "bg-emerald-200 text-emerald-900"
                                : project.status === "ongoing"
                                ? "bg-sky-200 text-sky-900"
                                : "bg-purple-200 text-purple-900"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <div className="text-xs text-amber-800 font-medium">{project.tagline}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-800">{project.description}</p>

                    {project.metrics && (
                      <div className="text-[11px] font-medium text-amber-900 bg-amber-200/60 px-2 py-1 rounded-lg">
                        ⚡ {project.metrics}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.technologies.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 text-[10px] font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1 text-xs">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-amber-900 hover:text-amber-700 font-semibold underline"
                        >
                          <Github className="w-3.5 h-3.5" /> Source
                        </a>
                      )}
                      {project.demo && project.demo !== "#" && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-amber-900 hover:text-amber-700 font-semibold underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. THE POND (Hobbies & Music) */}
          {activeModal === "pond" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-700 italic">
                &quot;The Pond is where the compilers rest. Here are the stories, melodies, and worlds that keep me inspired outside the IDE.&quot;
              </p>
              {HOBBIES.map((grp) => (
                <div key={grp.category} className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300">
                  <h3 className="font-serif font-bold text-base text-amber-900 mb-2">{grp.category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {grp.items.map((it) => (
                      <div key={it.title} className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
                        <div className="font-bold text-xs text-amber-950">{it.title}</div>
                        {it.subtitle && <div className="text-[10px] text-amber-700 font-semibold">{it.subtitle}</div>}
                        <div className="text-xs text-slate-700 mt-1">{it.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. THE LIBRARY (Skills & Tech Stack) */}
          {activeModal === "library" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SKILL_GROUPS.map((grp) => (
                  <div key={grp.category} className="p-3.5 rounded-2xl bg-amber-100/70 border border-amber-300">
                    <h3 className="font-serif font-bold text-sm text-amber-950 mb-1">{grp.category}</h3>
                    <p className="text-[10px] text-amber-800 mb-2">{grp.description}</p>
                    <div className="space-y-1.5">
                      {grp.skills.map((s) => (
                        <div key={s.name} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-amber-50/90">
                          <div>
                            <span className="font-bold text-amber-950">{s.name}</span>
                            {s.highlight && <div className="text-[10px] text-slate-600">{s.highlight}</div>}
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                              s.level === "Mastery"
                                ? "bg-amber-300 text-amber-950"
                                : s.level === "Proficient"
                                ? "bg-emerald-200 text-emerald-900"
                                : "bg-purple-200 text-purple-900"
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
            </div>
          )}

          {/* 5. THE POST OFFICE (Contact & Guestbook) */}
          {activeModal === "post_office" && (
            <div className="space-y-5">
              {/* Direct Links */}
              <div className="p-4 rounded-2xl bg-amber-100/80 border border-amber-300">
                <h3 className="font-serif font-bold text-base text-amber-950 mb-2">Send a Dispatch</h3>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-bold transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Email Manoj
                  </a>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-50 text-xs font-bold transition-colors"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-800 hover:bg-sky-900 text-sky-50 text-xs font-bold transition-colors"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                </div>
              </div>

              {/* Guestbook Form */}
              <div className="p-4 rounded-2xl bg-amber-100/80 border border-amber-300">
                <h3 className="font-serif font-bold text-base text-amber-950 mb-1">Leave a Note in the Mailbox</h3>
                <p className="text-xs text-slate-700 mb-3">
                  Say hi, share where you&apos;re visiting from, or leave feedback on the world!
                </p>

                {guestSubmitted ? (
                  <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Thank you! Your note has been dropped into Manoj&apos;s mailbox.
                  </div>
                ) : (
                  <form onSubmit={handlePostGuestbook} className="space-y-2.5">
                    <input
                      type="text"
                      placeholder="Your name or handle (e.g. Alice)"
                      value={guestAuthor}
                      onChange={(e) => setGuestAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 focus:outline-none focus:border-amber-700"
                    />
                    <textarea
                      rows={3}
                      placeholder="Your note for Manoj..."
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      maxLength={300}
                      className="w-full px-3 py-2 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 focus:outline-none focus:border-amber-700 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={!guestMessage.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-amber-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Drop in Mailbox
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* 6. THE LOOKOUT (Journey & Milestones) */}
          {activeModal === "lookout" && (
            <div className="space-y-5">
              {/* Education */}
              <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300">
                <h3 className="font-serif font-bold text-base text-amber-950 mb-3">🎓 Education</h3>
                <div className="space-y-3">
                  {EDUCATION_LIST.map((edu) => (
                    <div key={edu.id} className="p-3 rounded-xl bg-amber-50/90 border border-amber-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-sm text-amber-950">{edu.degree}</div>
                          <div className="text-xs text-amber-800 font-semibold">{edu.institution}</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-amber-200 px-2 py-0.5 rounded text-amber-900">
                          {edu.period}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-slate-700">
                        {edu.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-amber-600">•</span> {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements & Certifications */}
              <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300">
                <h3 className="font-serif font-bold text-base text-amber-950 mb-3">🏆 Achievements & Milestones</h3>
                <div className="space-y-2.5">
                  {ACHIEVEMENTS.map((ach) => (
                    <div key={ach.id} className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-200 text-amber-900 shrink-0">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-amber-950">{ach.title}</span>
                          <span className="text-[10px] font-mono font-bold text-amber-800">{ach.year}</span>
                        </div>
                        <div className="text-[11px] text-amber-700 font-medium">{ach.issuer}</div>
                        <p className="text-xs text-slate-700 mt-1">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. EASTER EGG DISCOVERY */}
          {activeModal === "easter_egg" && activeEasterEgg && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-200 border-2 border-amber-500 flex items-center justify-center text-2xl shadow-inner">
                ✨
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                  {activeEasterEgg.discoveryTag}
                </span>
                <h3 className="font-serif font-bold text-xl text-amber-950 mt-1">{activeEasterEgg.title}</h3>
                <p className="text-xs text-amber-800 italic mt-0.5">{activeEasterEgg.locationHint}</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-100/80 border border-amber-300 text-sm text-slate-800 text-left font-serif leading-relaxed">
                {activeEasterEgg.content}
              </div>
            </div>
          )}

          {/* 8. FORGOTTEN JOURNAL */}
          {activeModal === "journal" && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-200 border-2 border-amber-500 flex items-center justify-center text-2xl shadow-inner">
                📖
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                  Random Diary Page
                </span>
                <h3 className="font-serif font-bold text-xl text-amber-950 mt-1">The Forgotten Journal</h3>
              </div>
              <div className="p-5 rounded-2xl bg-amber-100/90 border border-amber-300 text-sm sm:text-base text-slate-900 italic font-serif leading-relaxed shadow-sm">
                &ldquo;{randomJournalEntry}&rdquo;
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

