/**
 * Faz 2 ana sahnesi — spec satır 107-112:
 *   - 2D top-down piksel art ofis (2.5D detaylar)
 *   - 5 ajanın masası, toplantı odası, çay ocağı
 *   - Çaycı NPC'sinin gezinme mantığı
 *   - Zeytin ağacı saksıları (spec 39), Mac/MacBook'lar (spec 40)
 */
import * as Phaser from "phaser";

import { AGENT_LIST, PERSONAS, type CharacterRole, type Persona } from "@/lib/personas";

import { COLORS, MAP_H, MAP_W, OLIVE_POTS, ROOMS, TILE } from "./config";
import {
  drawCharacter,
  drawDesk,
  drawFloor,
  drawMeetingTable,
  drawOlivePot,
  drawRoom,
  drawTeaCounter,
  drawWindow,
  type CharacterColors,
} from "./sprites";
import { TeaNPC } from "./TeaNPC";

function personaColors(p: Persona): CharacterColors {
  return { shirt: p.color, hair: p.hair, skin: p.skin, pants: p.pants };
}

export class OfficeScene extends Phaser.Scene {
  private tea?: TeaNPC;

  constructor() {
    super("office");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.floor);

    drawFloor(this, MAP_W, MAP_H);

    // Pencereler üst duvar boyunca
    drawWindow(this, 1, 0);
    drawWindow(this, 5, 0);
    drawWindow(this, 9, 0);

    drawRoom(this, ROOMS.meeting, "TOPLANTI ODASI", COLORS.meetingFloor);
    drawRoom(this, ROOMS.tea, "ÇAY OCAĞI", COLORS.teaFloor);

    // Toplantı masası odanın ortasında
    const meetingCx = (ROOMS.meeting.x + ROOMS.meeting.w / 2) * TILE;
    const meetingCy = (ROOMS.meeting.y + ROOMS.meeting.h / 2) * TILE;
    drawMeetingTable(this, meetingCx, meetingCy);

    // Çay tezgahı
    drawTeaCounter(this, ROOMS.tea.x + 2, ROOMS.tea.y + 2);

    // Zeytin saksıları
    for (const pot of OLIVE_POTS) {
      drawOlivePot(this, pot.x, pot.y);
    }

    const desks: Array<{ id: CharacterRole; tileX: number; tileY: number }> = [];

    for (const persona of AGENT_LIST) {
      const tileX = persona.initialPos.x;
      const tileY = persona.initialPos.y;
      drawDesk(this, tileX, tileY, persona.color);

      // İsim etiketi (masa üstünde)
      this.add
        .text(tileX * TILE + TILE, tileY * TILE - 12, persona.name, {
          fontFamily: "monospace",
          fontSize: "10px",
          color: "#ffeec0",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0.5, 1)
        .setDepth(6);

      // Rol etiketi (küçük)
      this.add
        .text(tileX * TILE + TILE, tileY * TILE - 2, persona.shortRole, {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#a8b8c0",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0.5, 1)
        .setDepth(6);

      // Ajan karakteri — masanın hemen önünde, sandalye gibi
      drawCharacter(
        this,
        tileX * TILE + TILE - 4,
        tileY * TILE + TILE + 26,
        personaColors(persona),
      );

      desks.push({ id: persona.id, tileX, tileY });
    }

    // Çay ocağında çaycı NPC
    this.tea = new TeaNPC(this, PERSONAS.tea, desks);

    // Başlık
    this.add
      .text(MAP_W / 2, 6, "YUME OFİSİ", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffeec0",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5, 0)
      .setDepth(10);
  }

  update(time: number, delta: number): void {
    this.tea?.update(time, delta);
  }
}
