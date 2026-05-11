"use client";

import { useEffect, useRef, useState } from "react";

import { api } from "@/lib/api";
import { PERSONAS } from "@/lib/personas";
import { useUiStore } from "@/lib/uiStore";

export default function RightChat() {
  const open = useUiStore((s) => s.rightPanelOpen);
  const toggle = useUiStore((s) => s.toggleRightPanel);
  const messages = useUiStore((s) => s.messages);
  const selected = useUiStore((s) => s.selected);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function send() {
    if (!selected) {
      setErr("Önce bir masaya tıkla ve ajan seç.");
      return;
    }
    if (!text.trim()) return;
    setSending(true);
    setErr(null);
    try {
      await api.sendChat(selected, text.trim());
      setText("");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={toggle}
        style={{
          position: "absolute",
          right: 16,
          top: 16,
          background: "rgba(16,12,8,0.85)",
          border: "1px solid #6a4a32",
          color: "#ffeec0",
          padding: "6px 12px",
          borderRadius: 4,
          fontFamily: "monospace",
          fontSize: 12,
          cursor: "pointer",
          zIndex: 20,
        }}
      >
        Sohbet ▸
      </button>
    );
  }

  return (
    <aside
      style={{
        position: "absolute",
        right: 16,
        top: 56,
        bottom: 16,
        width: 340,
        background: "rgba(16,12,8,0.94)",
        border: "1px solid #6a4a32",
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        color: "#ffeec0",
        fontFamily: "monospace",
        fontSize: 12,
        zIndex: 20,
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          borderBottom: "1px solid #4a3422",
        }}
      >
        <span style={{ fontWeight: 700 }}>
          Sohbet {selected ? `· ${PERSONAS[selected].name}` : "· Toplantı Odası"}
        </span>
        <button
          onClick={toggle}
          style={{
            background: "transparent",
            border: "none",
            color: "#aaa",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: 14,
          }}
        >
          ◂
        </button>
      </header>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 8,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: "#888", textAlign: "center", marginTop: 30 }}>
            Henüz mesaj yok. Bir masaya tıkla ve göreve başla.
          </div>
        )}
        {messages.map((m) => {
          const p = PERSONAS[m.agent_id];
          const isUser = m.role === "user";
          const isSystem = m.role === "system";
          return (
            <div
              key={m.id}
              style={{
                background: isSystem
                  ? "rgba(255,255,255,0.04)"
                  : isUser
                    ? "rgba(127,193,255,0.12)"
                    : "rgba(143,191,106,0.10)",
                border: `1px solid ${isUser ? "#3a5c7a" : isSystem ? "#3a3a3a" : "#3a5c2a"}`,
                borderRadius: 4,
                padding: "6px 8px",
                fontSize: 11,
                whiteSpace: "pre-wrap",
                lineHeight: 1.4,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: isUser ? "#7fc1ff" : "#9fbf6a",
                  marginBottom: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  {isUser ? "sen" : p ? p.name : m.agent_id}
                  {isSystem ? " · sistem" : ""}
                </span>
                <span style={{ opacity: 0.5 }}>
                  {new Date(m.ts + (m.ts.endsWith("Z") ? "" : "Z")).toLocaleTimeString()}
                </span>
              </div>
              {m.text}
            </div>
          );
        })}
      </div>

      <footer
        style={{
          borderTop: "1px solid #4a3422",
          padding: 8,
          display: "flex",
          gap: 6,
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder={selected ? `${PERSONAS[selected].name}'a yaz…` : "Önce bir ajan seç…"}
          disabled={!selected || sending}
          style={{
            flex: 1,
            background: "#1a120c",
            border: "1px solid #4a3422",
            color: "#ffeec0",
            padding: "6px 8px",
            fontFamily: "monospace",
            fontSize: 12,
            borderRadius: 4,
            outline: "none",
          }}
        />
        <button
          onClick={() => void send()}
          disabled={!selected || sending || !text.trim()}
          style={{
            background: "#3a5c2a",
            border: "1px solid #5a8c40",
            color: "#ffeec0",
            padding: "6px 12px",
            fontFamily: "monospace",
            fontSize: 12,
            borderRadius: 4,
            cursor: selected && !sending ? "pointer" : "not-allowed",
            opacity: selected && !sending ? 1 : 0.5,
          }}
        >
          {sending ? "…" : "Gönder"}
        </button>
      </footer>
      {err && (
        <div style={{ color: "#e07a3c", padding: "0 8px 6px", fontSize: 10 }}>
          ⚠ {err}
        </div>
      )}
    </aside>
  );
}
