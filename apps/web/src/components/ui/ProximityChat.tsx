"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, AlertTriangle, UserCheck } from "lucide-react";
import { useChatStore } from "@/stores/useChatStore";
import { useMultiplayerStore } from "@/stores/useMultiplayerStore";
import { WORLD_CONFIG } from "@mosswood/shared";

export const ProximityChat: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activePartner = useChatStore((s) => s.activePartner);
  const pendingInvite = useChatStore((s) => s.pendingInvite);
  const messages = useChatStore((s) => s.messages);
  const inGracePeriod = useChatStore((s) => s.inGracePeriod);
  const gracePeriodSeconds = useChatStore((s) => s.gracePeriodSeconds);

  const nearbyPlayers = useMultiplayerStore((s) => s.nearbyPlayers);
  const mySessionId = useMultiplayerStore((s) => s.mySessionId);
  const sendChatInvite = useMultiplayerStore((s) => s.sendChatInvite);
  const respondChatInvite = useMultiplayerStore((s) => s.respondChatInvite);
  const sendChatMessage = useMultiplayerStore((s) => s.sendChatMessage);
  const sendChatEnd = useMultiplayerStore((s) => s.sendChatEnd);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartner) return;
    sendChatMessage(inputText.trim(), activePartner.id);
    setInputText("");
  };

  return (
    <div className="pointer-events-none z-40 font-sans">
      {/* 1. Nearby Visitor Invitation Prompt */}
      {!activePartner && !pendingInvite && nearbyPlayers.length > 0 && (
        <div className="absolute top-20 right-6 pointer-events-auto animate-modal-pop">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl text-slate-100 max-w-xs">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm"
              style={{ backgroundColor: nearbyPlayers[0].color }}
            >
              👤
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase font-bold tracking-wider text-sky-400">Visitor in range</div>
              <div className="text-xs font-bold text-slate-100 truncate">
                {nearbyPlayers[0].isOwner ? `👑 ${nearbyPlayers[0].username}` : nearbyPlayers[0].username}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{nearbyPlayers[0].distance}m away</div>
            </div>
            <button
              onClick={() => sendChatInvite(nearbyPlayers[0].id)}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 text-xs font-bold shadow transition-all active:scale-95 cursor-pointer"
            >
              Invite
            </button>
          </div>
        </div>
      )}

      {/* 2. Incoming Chat Invitation Bubble */}
      {pendingInvite && (
        <div className="absolute top-20 right-6 pointer-events-auto animate-modal-pop">
          <div className="p-4 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-amber-400/40 shadow-2xl text-amber-100 w-80 space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Incoming Invitation
              </span>
            </div>
            <p className="text-xs font-medium text-slate-200">
              <strong className="text-amber-100">{pendingInvite.fromName}</strong> is standing nearby and wants to chat.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => respondChatInvite(pendingInvite.fromId, true)}
                className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-bold shadow transition-all cursor-pointer"
              >
                Accept (Enter)
              </button>
              <button
                onClick={() => respondChatInvite(pendingInvite.fromId, false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Active Chat Window */}
      {activePartner && (
        <div className="absolute top-20 right-6 w-84 sm:w-96 rounded-3xl bg-slate-950/85 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col pointer-events-auto max-h-[72vh] overflow-hidden animate-modal-pop">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <div>
                <div className="text-xs font-bold text-slate-100">
                  {activePartner.username}
                </div>
                <div className="text-[10px] text-slate-400">Proximity Chat Connected</div>
              </div>
            </div>
            <button
              onClick={() => sendChatEnd(activePartner.id)}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="End Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Grace Period Warning */}
          {inGracePeriod && (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/20 border-b border-amber-500/30 text-amber-200 text-xs font-medium animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Moving away! Closing in {gracePeriodSeconds}s...</span>
            </div>
          )}

          {/* Message List */}
          <div className="flex-1 p-4 space-y-2.5 overflow-y-auto max-h-72 min-h-48 text-xs">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                Connected! Say hello to {activePartner.username}.
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId === mySessionId;
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                      {isMe ? "You" : m.senderName}
                    </span>
                    <div
                      className={`px-3.5 py-2 rounded-2xl max-w-[85%] break-words ${
                        isMe
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none shadow-sm"
                          : "bg-white/10 text-slate-100 rounded-tl-none border border-white/5"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-slate-950/40 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              maxLength={WORLD_CONFIG.MAX_MESSAGE_LENGTH}
              placeholder="Type message..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
