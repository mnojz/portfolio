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

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First ensure setup is run if needed
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

      // Notify multiplayer server
      const room = useMultiplayerStore.getState().room;
      if (room) {
        room.send("auth", { token: data.token });
      }

      setSuccessMsg("Welcome back, Manoj! Creator privileges activated.");
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-amber-50 text-slate-900 border-4 border-amber-800 shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-700/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <div>
              <h2 className="text-lg font-serif font-black text-amber-950">Creator Control Panel</h2>
              <p className="text-xs text-amber-800">Portfolio Owner Authentication</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isOwner ? (
          /* Logged In Owner Controls */
          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-2xl bg-amber-100 border border-amber-400 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow">
                👑
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-amber-800">Logged in as</div>
                <div className="text-sm font-black text-amber-950 font-serif">{user?.username} (Portfolio Creator)</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                The Home Controls
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleDoor(!isHomeUnlocked)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold shadow transition-transform active:scale-95 cursor-pointer ${
                    isHomeUnlocked
                      ? "bg-amber-800 hover:bg-amber-900 text-amber-50 border-amber-900"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-700"
                  }`}
                >
                  {isHomeUnlocked ? <DoorClosed className="w-4 h-4" /> : <DoorOpen className="w-4 h-4" />}
                  <span>{isHomeUnlocked ? "Lock Cottage Door" : "Unlock Cottage Door"}</span>
                </button>

                <button
                  onClick={() => {
                    ownerInviteHome();
                    setSuccessMsg("Broadcast invitation sent to all visitors!");
                    setTimeout(() => setSuccessMsg(null), 3000);
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white border border-purple-800 text-xs font-bold shadow transition-transform active:scale-95 cursor-pointer"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Invite All to House</span>
                </button>
              </div>
            </div>

            {successMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                {successMsg}
              </div>
            )}

            <button
              onClick={logout}
              className="w-full py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-3.5">
            <p className="text-xs text-slate-700 leading-relaxed">
              When logged in as the Creator, you receive the golden <strong>👑 [OWNER]</strong> crown badge, unlock The Home cottage, and can invite visitors inside.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="manoj"
                className="w-full px-3 py-2 rounded-xl bg-amber-100 border border-amber-300 text-xs text-amber-950 font-semibold focus:outline-none focus:border-amber-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-3 py-2 rounded-xl bg-amber-100 border border-amber-300 text-xs text-amber-950 font-semibold focus:outline-none focus:border-amber-700"
                required
              />
              <span className="text-[10px] text-amber-700 mt-1 block">
                (Default dev password: <code>creator2026</code> or <code>password123</code>)
              </span>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs font-semibold">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-amber-50 font-bold text-sm shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
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

