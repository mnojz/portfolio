"use client";

import React, { useState } from "react";
import { X, ShieldCheck, KeyRound, DoorOpen, DoorClosed, Megaphone, Check } from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMultiplayerStore } from "@/stores/useMultiplayerStore";

export const AdminAuthModal: React.FC = () => {
  const activeModal = useGameStore((s) => s.activeModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const isHomeUnlocked = useGameStore((s) => s.isHomeUnlocked);

  const isOwner = useAuthStore((s) => s.isOwner);
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const toggleDoor = useMultiplayerStore((s) => s.toggleDoor);
  const ownerInviteHome = useMultiplayerStore((s) => s.ownerInviteHome);
  const customizeAvatar = useMultiplayerStore((s) => s.customizeAvatar);

  const [username, setUsername] = useState("manoj");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (activeModal !== "admin_login") return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.token, data.user);
      customizeAvatar("#F59E0B", "crown", `${data.user.username} (Creator)`);

      const room = useMultiplayerStore.getState().room;
      if (room) {
        room.send("auth", { token: data.token });
      }

      setSuccessMsg("Welcome home, Manoj! Creator privileges activated.");
      setTimeout(() => {
        closeModal();
      }, 1400);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FAF7F2] text-slate-800 border border-stone-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-6 space-y-4 animate-modal-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">👑</span>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-950">Creator Sanctum</h2>
              <p className="text-xs text-amber-800/80">Owner Access & House Permissions</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isOwner ? (
          /* Logged In Owner Dashboard */
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md border border-amber-300">
                👑
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-800">Verified Owner</div>
                <div className="text-base font-bold text-stone-900 font-serif">{user?.username} (Portfolio Creator)</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
                The Home Controls
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => toggleDoor(!isHomeUnlocked)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer ${
                    isHomeUnlocked
                      ? "bg-amber-900 hover:bg-amber-800 text-amber-50 border-amber-950"
                      : "bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-800"
                  }`}
                >
                  {isHomeUnlocked ? <DoorClosed className="w-4 h-4" /> : <DoorOpen className="w-4 h-4" />}
                  <span>{isHomeUnlocked ? "Lock Cottage" : "Unlock Cottage"}</span>
                </button>

                <button
                  onClick={() => {
                    ownerInviteHome();
                    setSuccessMsg("Broadcast invitation sent to all visitors!");
                    setTimeout(() => setSuccessMsg(null), 3000);
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-800 hover:bg-purple-700 text-white border border-purple-900 text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Invite to House</span>
                </button>
              </div>
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                {successMsg}
              </div>
            )}

            <button
              onClick={logout}
              className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-3.5">
            <p className="text-xs text-stone-600 leading-relaxed">
              Authenticate as the Creator to unlock <strong>The Home</strong>, wear the <strong>👑 Crown</strong>, and invite visitors inside.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="manoj"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-semibold focus:outline-none focus:border-amber-700 shadow-sm transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-semibold focus:outline-none focus:border-amber-700 shadow-sm transition-colors"
                required
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Default credentials: <code>creator2026</code> or <code>password123</code>
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 disabled:opacity-50 text-amber-50 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? "Authenticating..." : "Sign In as Creator"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
