"use client";

import { useEffect, useRef } from "react";

import { MAP_H, MAP_W } from "@/game/config";

export default function OfficeCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [PhaserMod, { OfficeScene }] = await Promise.all([
        import("phaser"),
        import("@/game/OfficeScene"),
      ]);
      const Phaser = (PhaserMod as unknown as { default?: typeof import("phaser") }).default ?? PhaserMod;

      if (cancelled || !hostRef.current) return;

      const game = new Phaser.Game({
        type: Phaser.AUTO,
        width: MAP_W,
        height: MAP_H,
        parent: hostRef.current,
        backgroundColor: "#3a2a1f",
        pixelArt: true,
        scene: [OfficeScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });
      gameRef.current = game;
    })();

    return () => {
      cancelled = true;
      const g = gameRef.current as { destroy?: (rm: boolean) => void } | null;
      g?.destroy?.(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={hostRef}
      style={{ height: "100%", width: "100%", imageRendering: "pixelated" }}
    />
  );
}
