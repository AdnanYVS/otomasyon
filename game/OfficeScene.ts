/**
 * Faz 2 ana sahnesi — spec satır 107-112:
 *   - 2D top-down piksel art ofis
 *   - 5 ajanın masası, toplantı odası, çay ocağı
 *   - Çaycı NPC'sinin gezinme mantığı
 *   - Zeytin ağacı saksıları (spec 39), Mac/MacBook'lar (spec 40)
 */
import * as Phaser from "phaser";

import { AGENT_LIST, PERSONAS, type CharacterRole } from "@/lib/personas";

import { COLORS, MAP_H, MAP_W, OLIVE_POTS, ROOMS, TILE } from "./config";
import { drawCharacter, drawDesk, drawFloor, drawOlivePot, drawRoom } from "./sprites";
import { TeaNPC } from "./TeaNPC";

export class OfficeScene extends Phaser.Scene {
  private tea?: TeaNPC;

  constructor() {
    super("office");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.floor);

    drawFloor(this, MAP_W, MAP_H);
    drawRoom(this, ROOMS.meeting, "TOPLANTI ODASI", COLORS.meetingFloor);
    drawRoom(this, ROOMS.tea, "ÇAY OCAĞI", COLORS.teaFloor);

    for (const pot of OLIVE_POTS) {
      drawOlivePot(this, pot.x, pot.y);
    }

    const desks: Array<{ id: CharacterRole; tileX: number; tileY: number }> = [];

    for (const persona of AGENT_LIST) {
      const tileX = persona.initialPos.x;
      const tileY = persona.initialPos.y;
      drawDesk(this, tileX, tileY, persona.color);

      // İsim etiketi
      this.add
        .text(tileX * TILE + TILE, tileY * TILE - 8, persona.name, {
          fontFamily: "monospace",
          fontSize: "10px",
          color: "#ffffff",
        })
        .setOrigin(0.5, 1)
        .setDepth(6);

      // Ajan karakteri masanın yanına otur
      drawCharacter(this, tileX * TILE + 8, tileY * TILE + TILE + 14, persona.color);

      desks.push({ id: persona.id, tileX, tileY });
    }

    // Çay ocağı içine NPC
    this.tea = new TeaNPC(this, PERSONAS.tea, desks);

    // Başlık
    this.add
      .text(MAP_W / 2, 8, "YUME OFİSİ", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#f0e0c0",
      })
      .setOrigin(0.5, 0)
      .setDepth(10);
  }

  update(time: number, delta: number): void {
    this.tea?.update(time, delta);
  }
}
