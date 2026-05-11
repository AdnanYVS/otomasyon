/**
 * UI tarafı paylaşılan store. Backend'ten gelen ajan durumlarını ve chat
 * mesajlarını burada tutar; Phaser sahnesi de buradan tüketir.
 *
 * Spec ref:
 *  - Sol HUD (50-56): selected agent + brand + task + progress
 *  - Sağ chat (58-62): kullanıcı↔ajan mesajları
 */
"use client";

import { create } from "zustand";

import type { AgentRole } from "./personas";
import type { AgentStatusSnapshot, ChatMessageDTO } from "./api";

export type UiAgentStatus = "idle" | "working" | "completed" | "blocked";

export interface UiAgentState {
  id: AgentRole;
  name: string;
  status: UiAgentStatus;
  task: string | null;
  brand: string;
  progress: number;
}

interface UiStore {
  agents: Record<AgentRole, UiAgentState>;
  messages: ChatMessageDTO[];
  selected: AgentRole | null;
  rightPanelOpen: boolean;

  selectAgent: (id: AgentRole | null) => void;
  toggleRightPanel: () => void;
  applyStatuses: (snapshots: AgentStatusSnapshot[]) => void;
  applyMessages: (messages: ChatMessageDTO[]) => void;
}

const ROLES: AgentRole[] = ["lead", "writer", "seo", "visual", "ads"];

const initialAgents = (): Record<AgentRole, UiAgentState> => {
  const out = {} as Record<AgentRole, UiAgentState>;
  for (const id of ROLES) {
    out[id] = {
      id,
      name: id,
      status: "idle",
      task: null,
      brand: "demo_brand",
      progress: 0,
    };
  }
  return out;
};

export const useUiStore = create<UiStore>((set) => ({
  agents: initialAgents(),
  messages: [],
  selected: null,
  rightPanelOpen: true,

  selectAgent: (id) => set({ selected: id }),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),

  applyStatuses: (snapshots) =>
    set((s) => {
      const next = { ...s.agents };
      for (const snap of snapshots) {
        const cur = next[snap.id];
        if (!cur) continue;
        next[snap.id] = {
          ...cur,
          name: snap.name,
          status: snap.status,
          task: snap.task,
          progress: snap.progress,
        };
      }
      return { agents: next };
    }),

  applyMessages: (messages) => set({ messages }),
}));
