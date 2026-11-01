"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Github,
  Mail,
  Linkedin,
  Sparkles,
  Trophy,
  GraduationCap,
  Heart,
  Send,
  Code2,
  CheckCircle,
  FolderGit2,
  BookOpen,
  MapPin,
  Coffee,
  Calendar,
} from "lucide-react";
import { useGameStore, ModalType } from "@/stores/useGameStore";
import { PROFILE } from "@/content/profile";
import { PROJECTS } from "@/content/projects";
import { SKILL_GROUPS } from "@/content/skills";
import { HOBBIES } from "@/content/hobbies";
import { EDUCATION_LIST } from "@/content/education";
import { ACHIEVEMENTS } from "@/content/achievements";

export const InspectionModal: React.FC = () => {
  const activeModal = useGameStore((s) => s.activeModal);
  const openModal = useGameStore((s) => s.openModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const selectedProject = useGameStore((s) => s.selectedProject);
  const activeEasterEgg = useGameStore((s) => s.activeEasterEgg);
  const randomJournalEntry = useGameStore((s) => s.randomJournalEntry);

  // Tab Navigation
  const [activeTab, setActiveTab] = useState<string>("home");

  // Keep activeTab in sync with activeModal when opened from 3D world
  useEffect(() => {
    if (activeModal && ["home", "workshop", "pond", "library", "post_office", "lookout"].includes(activeModal)) {
      setActiveTab(activeModal);
    }
  }, [activeModal]);

  // Project Category Filter
  const [projectFilter, setProjectFilter] = useState<string>("All");

  // Guestbook
  const [guestAuthor, setGuestAuthor] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [guestSubmitted, setGuestSubmitted] = useState(false);

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

  const isSpecialView = ["project_detail", "easter_egg", "journal"].includes(activeModal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl max-h-[88vh] rounded-3xl bg-[#FAF7F2] text-slate-800 border border-stone-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.8)_inset] flex flex-col overflow-hidden animate-modal-pop">
        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-stone-200/80 bg-[#F4EFEA]/80">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">
                {activeTab === "home" && "🏡"}
                {activeTab === "workshop" && "⚙️"}
                {activeTab === "pond" && "🎣"}
                {activeTab === "library" && "📚"}
                {activeTab === "post_office" && "✉️"}
                {activeTab === "lookout" && "🏔️"}
                {activeModal === "project_detail" && "💻"}
                {activeModal === "easter_egg" && "✨"}
                {activeModal === "journal" && "📖"}
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-amber-950 leading-tight">
                  {isSpecialView ? (
                    activeModal === "project_detail"
                      ? selectedProject?.title
                      : activeModal === "easter_egg"
                      ? activeEasterEgg?.title || "Secret Discovery"
                      : "The Forgotten Journal"
                  ) : (
                    activeTab === "home"
                      ? "The Home — About Manoj"
                      : activeTab === "workshop"
                      ? "The Workshop — Engineering Projects"
                      : activeTab === "pond"
                      ? "The Pond — Personal Musings & Hobbies"
                      : activeTab === "library"
                      ? "The Library — Skills & Architecture"
                      : activeTab === "post_office"
                      ? "The Post Office — Dispatches & Guestbook"
                      : "The Lookout — Journey & Milestones"
                  )}
                </h2>
                <p className="text-[11px] text-amber-800/80 font-medium">
                  {isSpecialView ? "Personal Discovery Note" : "Mosswood Compendium"}
                </p>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="p-2 rounded-full hover:bg-stone-300/60 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs (Only when viewing standard locations) */}
          {!isSpecialView && (
            <div className="flex items-center gap-1 mt-4 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: "home", label: "About", icon: "🏡" },
                { id: "workshop", label: "Projects", icon: "⚙️" },
                { id: "library", label: "Tech Stack", icon: "📚" },
                { id: "lookout", label: "Journey", icon: "🏔️" },
                { id: "pond", label: "Personal", icon: "🎣" },
                { id: "post_office", label: "Contact", icon: "✉️" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    openModal(tab.id as ModalType);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-amber-900 text-amber-50 shadow-sm"
                      : "text-stone-600 hover:text-amber-950 hover:bg-stone-200/60"
                  }`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm leading-relaxed text-stone-800">
          {/* SPECIAL VIEW: PROJECT DETAIL */}
          {activeModal === "project_detail" && selectedProject && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
                    {selectedProject.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {selectedProject.status}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">{selectedProject.title}</h3>
                <p className="text-xs font-semibold text-amber-900">{selectedProject.tagline}</p>
                <p className="text-xs text-stone-600 leading-relaxed pt-1">{selectedProject.description}</p>
                {selectedProject.metrics && (
                  <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200/60">
                    ⚡ {selectedProject.metrics}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Technologies Used</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.technologies.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow transition-colors"
                  >
                    <Github className="w-4 h-4" /> View Source
                  </a>
                )}
                {selectedProject.demo && selectedProject.demo !== "#" && (
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          )}

          {/* SPECIAL VIEW: EASTER EGG */}
          {activeModal === "easter_egg" && activeEasterEgg && (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-inner">
                ✨
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                  {activeEasterEgg.discoveryTag}
                </span>
                <h3 className="font-serif font-bold text-2xl text-amber-950 mt-2">{activeEasterEgg.title}</h3>
                <p className="text-xs text-stone-500 italic mt-0.5">{activeEasterEgg.locationHint}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-stone-200 text-sm text-stone-700 text-left leading-relaxed shadow-sm">
                {activeEasterEgg.content}
              </div>
            </div>
          )}

          {/* SPECIAL VIEW: FORGOTTEN JOURNAL */}
          {activeModal === "journal" && (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-inner">
                📖
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                  Worn Diary Page
                </span>
                <h3 className="font-serif font-bold text-2xl text-amber-950 mt-2">The Forgotten Journal</h3>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-stone-200 text-stone-800 text-sm sm:text-base italic font-serif leading-relaxed shadow-sm">
                &ldquo;{randomJournalEntry}&rdquo;
              </div>
            </div>
          )}

          {/* TAB 1: THE HOME (About Manoj) */}
          {!isSpecialView && activeTab === "home" && (
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800">
                    Developer & Architect
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Available for roles
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900">{PROFILE.name}</h3>
                <p className="text-xs font-semibold text-amber-900">{PROFILE.tagline}</p>
                <p className="text-xs text-stone-500 flex items-center gap-1 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" /> {PROFILE.location}
                </p>
              </div>

              {/* Story & Philosophy */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-base text-amber-950">About Me</h4>
                {PROFILE.story.map((paragraph, i) => (
                  <p key={i} className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-white border border-stone-200 text-center shadow-sm">
                  <div className="text-xl font-bold font-mono text-stone-900">{PROFILE.stats.yearsOfExperience}</div>
                  <div className="text-[10px] uppercase font-bold text-amber-800">Experience</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-stone-200 text-center shadow-sm">
                  <div className="text-xl font-bold font-mono text-stone-900">{PROFILE.stats.projectsBuilt}</div>
                  <div className="text-[10px] uppercase font-bold text-amber-800">Projects</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-stone-200 text-center shadow-sm">
                  <div className="text-xl font-bold font-mono text-stone-900">{PROFILE.stats.commitsCount}</div>
                  <div className="text-[10px] uppercase font-bold text-amber-800">Commits</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-stone-200 text-center shadow-sm">
                  <div className="text-xl font-bold font-mono text-stone-900">{PROFILE.stats.cupsOfChai}</div>
                  <div className="text-[10px] uppercase font-bold text-amber-800">Cups of Chai</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THE WORKSHOP (Projects) */}
          {!isSpecialView && activeTab === "workshop" && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {["All", "Full-Stack", "3D & Graphics", "Systems & Real-Time", "AI & Tools"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProjectFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      projectFilter === cat
                        ? "bg-amber-900 text-amber-50 shadow-sm"
                        : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Projects List */}
              <div className="grid grid-cols-1 gap-3.5">
                {PROJECTS.filter((p) => projectFilter === "All" || p.category === projectFilter).map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-stone-900">{project.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              project.status === "completed"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : project.status === "ongoing"
                                ? "bg-sky-50 text-sky-800 border border-sky-200"
                                : "bg-purple-50 text-purple-800 border border-purple-200"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <div className="text-xs text-amber-800 font-medium">{project.tagline}</div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">{project.description}</p>

                    {project.metrics && (
                      <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60">
                        ⚡ {project.metrics}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {project.technologies.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold border border-stone-200/60">
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
                          className="flex items-center gap-1 text-stone-800 hover:text-amber-800 font-semibold"
                        >
                          <Github className="w-3.5 h-3.5" /> Source Code
                        </a>
                      )}
                      {project.demo && project.demo !== "#" && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-amber-800 hover:text-amber-600 font-semibold"
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

          {/* TAB 3: THE LIBRARY (Skills & Architecture) */}
          {!isSpecialView && activeTab === "library" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SKILL_GROUPS.map((grp) => (
                  <div key={grp.category} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2.5">
                    <h4 className="font-serif font-bold text-sm text-stone-900">{grp.category}</h4>
                    <p className="text-[10px] text-stone-500 leading-normal">{grp.description}</p>
                    <div className="space-y-1.5 pt-1">
                      {grp.skills.map((s) => (
                        <div key={s.name} className="flex items-center justify-between text-xs p-1.5 rounded-xl bg-stone-50 border border-stone-100">
                          <div>
                            <span className="font-semibold text-stone-800">{s.name}</span>
                            {s.highlight && <div className="text-[10px] text-stone-500">{s.highlight}</div>}
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                              s.level === "Mastery"
                                ? "bg-amber-100 text-amber-900 border border-amber-200"
                                : s.level === "Proficient"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-purple-100 text-purple-800 border border-purple-200"
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

          {/* TAB 4: THE LOOKOUT (Journey & Milestones) */}
          {!isSpecialView && activeTab === "lookout" && (
            <div className="space-y-5">
              {/* Education */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-amber-950 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-800" /> Education Background
                </h4>
                {EDUCATION_LIST.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-sm text-stone-900">{edu.degree}</div>
                        <div className="text-xs text-amber-800 font-semibold">{edu.institution}</div>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                        {edu.period}
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-stone-600 pt-1">
                      {edu.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-amber-700">•</span> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-amber-950 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-800" /> Milestones & Certifications
                </h4>
                <div className="space-y-2">
                  {ACHIEVEMENTS.map((ach) => (
                    <div key={ach.id} className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-start gap-3 shadow-sm">
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-stone-900">{ach.title}</span>
                          <span className="text-[10px] font-mono font-bold text-amber-800">{ach.year}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 font-medium">{ach.issuer}</div>
                        <p className="text-xs text-stone-600 mt-0.5">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: THE POND (Personal Musings & Hobbies) */}
          {!isSpecialView && activeTab === "pond" && (
            <div className="space-y-5">
              <p className="text-xs text-stone-600 italic leading-relaxed">
                &ldquo;The Pond is where the compilers rest. Here are the stories, soundtracks, and worlds that keep my creativity sparked outside the terminal.&rdquo;
              </p>
              {HOBBIES.map((grp) => (
                <div key={grp.category} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2.5">
                  <h4 className="font-serif font-bold text-sm text-amber-950">{grp.category}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {grp.items.map((it) => (
                      <div key={it.title} className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                        <div className="font-bold text-xs text-stone-900">{it.title}</div>
                        {it.subtitle && <div className="text-[10px] text-amber-800 font-semibold">{it.subtitle}</div>}
                        <div className="text-xs text-stone-600 mt-1">{it.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: THE POST OFFICE (Contact & Guestbook) */}
          {!isSpecialView && activeTab === "post_office" && (
            <div className="space-y-5">
              {/* Direct Links */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-serif font-bold text-base text-stone-900">Send a Dispatch</h4>
                <div className="flex flex-wrap gap-2.5">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold transition-colors shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email Manoj
                  </a>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-800 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                </div>
              </div>

              {/* Guestbook Submission */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-serif font-bold text-base text-stone-900">Sign the Village Mailbox</h4>
                <p className="text-xs text-stone-600">
                  Say hello, share feedback, or leave a note. Your dispatch will be delivered into the world&apos;s guestbook!
                </p>

                {guestSubmitted ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Dispatch received! Thank you for leaving a note.
                  </div>
                ) : (
                  <form onSubmit={handlePostGuestbook} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name or handle..."
                      value={guestAuthor}
                      onChange={(e) => setGuestAuthor(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-700 transition-colors"
                    />
                    <textarea
                      rows={3}
                      placeholder="Your message for Manoj..."
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      maxLength={300}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-700 transition-colors resize-none"
                    />
                    <button
                      type="submit"
                      disabled={!guestMessage.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 disabled:opacity-50 text-amber-50 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" /> Drop in Mailbox
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
