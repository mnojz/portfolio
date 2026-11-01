"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, AlertTriangle, UserCheck, ShieldAlert } from "lucide-react";
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
  const isOpen = useChatStore((s) => s.isOpen);
  const setIsOpen = useChatStore((s) => s.setIsOpen);

  const nearbyPlayers = useMultiplayerStore((s) => s.nearbyPlayers);
  const mySessionId = useMultiplayerStore((s) => s.mySessionId);
  const sendChatInvite = useMultiplayerStore((s) => s.sendChatInvite);
  const respondChatInvite = useMultiplayerStore((s) => s.respondChatInvite);
  const sendChatMessage = useMultiplayerStore((s) => s.sendChatMessage);
  const sendChatEnd = useMultiplayerStore((s) => s.sendChatEnd);

  // Auto-scroll chat to bottom
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
    <div className="pointer-events-none z-40">
      {/* 1. Nearby Visitor Invitation Prompt (When in range of someone and not chatting) */}
      {!activePartner && !pendingInvite && nearbyPlayers.length > 0 && (
        <div className="absolute top-20 right-6 pointer-events-auto animate-fade-in">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-sky-500/60 shadow-2xl text-slate-100 max-w-xs">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: nearbyPlayers[0].color }}
            >
              👤
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-sky-200">Nearby Visitor</div>
              <div className="text-sm font-bold truncate">
                {nearbyPlayers[0].isOwner ? `👑 ${nearbyPlayers[0].username}` : nearbyPlayers[0].username}
              </div>
              <div className="text-[10px] text-slate-400">{nearbyPlayers[0].distance}m away</div>
            </div>
            <button
              onClick={() => sendChatInvite(nearbyPlayers[0].id)}
              className="px-2.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow transition-transform active:scale-95 cursor-pointer"
            >
              Invite
            </button>
          </div>
        </div>
      )}

      {/* 2. Incoming Chat Invitation Banner (Mutual Consent Step) */}
      {pendingInvite && (
        <div className="absolute top-20 right-6 pointer-events-auto animate-bounce">
          <div className="p-4 rounded-2xl bg-amber-950/95 backdrop-blur-md border border-amber-400 shadow-2xl text-amber-100 w-80">
            <div className="flex items-center gap-2 mb-1.5">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Chat Invitation
              </span>
            </div>
            <p className="text-sm font-semibold mb-3">
              <span className="text-white font-bold">{pendingInvite.fromName}</span> would like to chat with you!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => respondChatInvite(pendingInvite.fromId, true)}
                className="flex-1 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
              >
                Accept (Enter)
              </button>
              <button
                onClick={() => respondChatInvite(pendingInvite.fromId, false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Active Chat Window (Side Panel) */}
      {activePartner && (
        <div className="absolute top-20 right-6 w-84 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl flex flex-col pointer-events-auto max-h-[70vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-950/70">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Chatting with {activePartner.username}
                </div>
                <div className="text-[10px] text-slate-400">Proximity Range Active</div>
              </div>
            </div>
            <button
              onClick={() => sendChatEnd(activePartner.id)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="End Conversation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Grace Period Alert Banner */}
          {inGracePeriod && (
            <div className="flex items-center gap-2 p-2 bg-amber-500/20 border-b border-amber-500/40 text-amber-200 text-xs font-medium px-3 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Moving out of range! Closing in {gracePeriodSeconds}s...</span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 space-y-2.5 overflow-y-auto max-h-72 min-h-48 text-xs">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 py-6">
                Connected! Say hello to {activePartner.username}.
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId === mySessionId;
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-slate-400 mb-0.5">
                      {isMe ? "You" : m.senderName}
                    </span>
                    <div
                      className={`px-3 py-2 rounded-2xl max-w-[85%] break-words ${
                        isMe
                          ? "bg-amber-500 text-slate-950 font-medium rounded-tr-none"
                          : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700"
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

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-800 bg-slate-950/50 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              maxLength={WORLD_CONFIG.MAX_MESSAGE_LENGTH}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

