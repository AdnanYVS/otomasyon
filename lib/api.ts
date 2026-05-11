/**
 * FastAPI backend ile konuşan ince fetch katmanı.
 *
 * Dev'de Next.js 3000, FastAPI 8000'de. NEXT_PUBLIC_API_BASE_URL ile override.
 */
import type { AgentRole } from "./personas";

const API_BASE =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_API_BASE_URL) ||
  "http://localhost:8000";

export interface AgentStatusSnapshot {
  id: AgentRole;
  name: string;
  status: "idle" | "working" | "completed" | "blocked";
  task: string | null;
  progress: number;
}

export interface ChatMessageDTO {
  id: number;
  agent_id: AgentRole;
  role: "user" | "agent" | "system";
  text: string;
  ts: string;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  health: () => get<{ status: string; llm_mode: string }>("/health"),
  agentsStatus: () => get<AgentStatusSnapshot[]>("/agents/status"),
  messages: () => get<{ messages: ChatMessageDTO[] }>("/messages"),
  sendChat: (agentId: AgentRole, text: string, brand = "demo_brand") =>
    post<{ ok: boolean }>(`/agents/${agentId}/chat`, { text, brand }),
};
