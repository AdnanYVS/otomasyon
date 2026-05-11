/**
 * Çaycı NPC — spec satır 46-48.
 * - Her 2-3 dakikada bir rastgele bir waypoint'e yürür.
 * - Vardığı masanın yanına bir çay bardağı bırakır (15 sn sonra kaybolur).
 * - Hareket linear interpolation; herhangi bir collision yok (sadece görsel).
 */
import * as Phaser from "phaser";

import { TEA_INTERVAL_MS_MAX, TEA_INTERVAL_MS_MIN, TILE } from "./config";
import { drawCharacter, drawTeaCup, type CharacterColors } from "./sprites";
import type { CharacterRole, Persona } from "@/lib/personas";

const SPEED = 60; // px/sec

export class TeaNPC {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Container;
  private targetSeats: Array<{ id: CharacterRole; x: number; y: number }>;
  private home: { x: number; y: number };
  private nextTick = 0;
  private moving = false;
  private path: Array<{ x: number; y: number }> = [];

  constructor(
    scene: Phaser.Scene,
    persona: Persona,
    desks: Array<{ id: CharacterRole; tileX: number; tileY: number }>,
  ) {
    this.scene = scene;
    const startX = persona.initialPos.x * TILE + TILE / 2;
    const startY = persona.initialPos.y * TILE + TILE / 2;
    const colors: CharacterColors = {
      shirt: persona.color,
      hair: persona.hair,
      skin: persona.skin,
      pants: persona.pants,
    };
    this.sprite = drawCharacter(scene, startX, startY, colors);
    this.home = { x: startX, y: startY };
    this.targetSeats = desks.map((d) => ({
      id: d.id,
      x: d.tileX * TILE + TILE,
      y: d.tileY * TILE + TILE + 18,
    }));
    this.nextTick = scene.time.now + this.randomInterval();
  }

  private randomInterval(): number {
    return Phaser.Math.Between(TEA_INTERVAL_MS_MIN, TEA_INTERVAL_MS_MAX);
  }

  private pickRoute(): void {
    const seat = Phaser.Utils.Array.GetRandom(this.targetSeats) as {
      x: number;
      y: number;
      id: CharacterRole;
    };
    this.path = [
      { x: seat.x, y: seat.y },
      { x: this.home.x, y: this.home.y },
    ];
    this.moving = true;
  }

  update(_time: number, delta: number): void {
    if (!this.moving && this.scene.time.now >= this.nextTick) {
      this.pickRoute();
    }
    if (!this.moving) return;

    const next = this.path[0];
    if (!next) {
      this.moving = false;
      this.nextTick = this.scene.time.now + this.randomInterval();
      return;
    }

    const dx = next.x - this.sprite.x;
    const dy = next.y - this.sprite.y;
    const dist = Math.hypot(dx, dy);
    const step = (SPEED * delta) / 1000;

    if (dist <= step) {
      this.sprite.setPosition(next.x, next.y);
      this.path.shift();
      // İlk durağa varınca çay bırak (path uzunluğu artık 1)
      if (this.path.length === 1) {
        this.dropTea(next.x, next.y);
      }
    } else {
      this.sprite.setPosition(
        this.sprite.x + (dx / dist) * step,
        this.sprite.y + (dy / dist) * step,
      );
    }
  }

  private dropTea(px: number, py: number): void {
    const cup = drawTeaCup(this.scene, px, py - 4);
    this.scene.time.delayedCall(15_000, () => cup.destroy());
  }
}
