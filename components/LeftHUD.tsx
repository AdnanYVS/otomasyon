"use client";

import { useUiStore } from "@/lib/uiStore";
import { PERSONAS } from "@/lib/personas";

const STATUS_COLOR: Record<string, string> = {
  idle: "#888",
  working: "#7fc1ff",
  completed: "#8fbf6a",
  blocked: "#e07a3c",
};

export default function LeftHUD() {
  const selected = useUiStore((s) => s.selected);
  const agentState = useUiStore((s) => (selected ? s.agents[selected] : null));
  const clear = useUiStore((s) => s.selectAgent);

  if (!selected || !agentState) return null;

  const persona = PERSONAS[selected];
  const statusColor = STATUS_COLOR[agentState.status] ?? "#888";

  return (
    <aside
      style={{
        position: "absolute",
        left: 16,
        top: 56,
        width: 260,
        background: "rgba(16,12,8,0.92)",
        border: "1px solid #6a4a32",
        borderRadius: 6,
        padding: 14,
        color: "#ffeec0",
        fontFamily: "monospace",
        fontSize: 12,
        zIndex: 20,
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
      }}
    >
      <button
        onClick={() => clear(null)}
        style={{
          position: "absolute",
          right: 8,
          top: 6,
          background: "transparent",
          border: "none",
          color: "#aaa",
          cursor: "pointer",
          fontFamily: "monospace",
          fontSize: 14,
        }}
        aria-label="kapat"
      >
        ×
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 4,
            background: `#${persona.color.toString(16).padStart(6, "0")}`,
            border: "1px solid #000",
          }}
        />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{persona.name}</div>
          <div style={{ fontSize: 10, color: "#a8b8c0" }}>{persona.role}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <Field label="Marka">{agentState.brand || "—"}</Field>
        <Field label="Durum">
          <span style={{ color: statusColor }}>● {agentState.status}</span>
        </Field>
      </div>

      <Field label="Görev">
        <div style={{ minHeight: 26 }}>{agentState.task ?? <em style={{ opacity: 0.5 }}>boş</em>}</div>
      </Field>

      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10 }}>
          <span style={{ color: "#a8b8c0" }}>İlerleme</span>
          <span>{agentState.progress}%</span>
        </div>
        <div
          style={{
            height: 8,
            background: "#221810",
            border: "1px solid #4a3422",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${agentState.progress}%`,
              height: "100%",
              background: statusColor,
              transition: "width 250ms ease-out",
            }}
          />
        </div>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "#a8b8c0", marginBottom: 2 }}>{label}</div>
      <div>{children}</div>
    </div>
  );
}
