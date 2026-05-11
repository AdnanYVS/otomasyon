"use client";

import { useEffect, useRef } from "react";

import { api } from "@/lib/api";
import { useUiStore } from "@/lib/uiStore";

const STATUS_INTERVAL = 1500;
const MESSAGES_INTERVAL = 1500;

/**
 * Backend'i sürekli pollar, UI store'a yazar.
 * Mount edildiği sürece çalışır; sayfada bir kez render edilmesi yeterli.
 */
export default function PollingDriver() {
  const applyStatuses = useUiStore((s) => s.applyStatuses);
  const applyMessages = useUiStore((s) => s.applyMessages);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;

    let statusTimer: ReturnType<typeof setTimeout> | null = null;
    let msgTimer: ReturnType<typeof setTimeout> | null = null;

    async function pullStatuses() {
      if (!aliveRef.current) return;
      try {
        const snaps = await api.agentsStatus();
        applyStatuses(snaps);
      } catch {
        // backend ayakta değil — sessizce sonraki turu bekle
      }
      if (aliveRef.current) statusTimer = setTimeout(pullStatuses, STATUS_INTERVAL);
    }

    async function pullMessages() {
      if (!aliveRef.current) return;
      try {
        const { messages } = await api.messages();
        applyMessages(messages);
      } catch {
        // ignore
      }
      if (aliveRef.current) msgTimer = setTimeout(pullMessages, MESSAGES_INTERVAL);
    }

    void pullStatuses();
    void pullMessages();

    return () => {
      aliveRef.current = false;
      if (statusTimer) clearTimeout(statusTimer);
      if (msgTimer) clearTimeout(msgTimer);
    };
  }, [applyStatuses, applyMessages]);

  return null;
}
