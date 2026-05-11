/**
 * Programmatik piksel sprite üretimi. Spec gerçek asset'lerden
 * bahsediyor ama Faz 2'de yer tutucu olarak shape-tabanlı sprite'lar
 * üretiyoruz; gerçek piksel art asset'leri sonra `public/assets/`'a
 * eklenip kolayca swap edilebilir.
 */
import * as Phaser from "phaser";

import { COLORS, TILE } from "./config";

export function drawFloor(scene: Phaser.Scene, w: number, h: number): void {
  const g = scene.add.graphics();
  for (let row = 0; row < h / TILE; row++) {
    for (let col = 0; col < w / TILE; col++) {
      const c = (row + col) % 2 === 0 ? COLORS.floor : COLORS.floorAlt;
      g.fillStyle(c, 1);
      g.fillRect(col * TILE, row * TILE, TILE, TILE);
    }
  }
}

export function drawRoom(
  scene: Phaser.Scene,
  rect: { x: number; y: number; w: number; h: number },
  label: string,
  floor: number,
): void {
  const px = rect.x * TILE;
  const py = rect.y * TILE;
  const pw = rect.w * TILE;
  const ph = rect.h * TILE;

  const g = scene.add.graphics();
  g.fillStyle(floor, 1);
  g.fillRect(px, py, pw, ph);
  g.lineStyle(2, COLORS.wall, 1);
  g.strokeRect(px, py, pw, ph);

  scene.add
    .text(px + 6, py + 4, label, {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#ffffff",
    })
    .setDepth(2);
}

/** Mac Mini + MacBook görünümlü masa (spec satır 40). */
export function drawDesk(
  scene: Phaser.Scene,
  tileX: number,
  tileY: number,
  accent: number,
): Phaser.GameObjects.Container {
  const px = tileX * TILE;
  const py = tileY * TILE;
  const g = scene.add.graphics();

  // Desk top
  g.fillStyle(COLORS.desk, 1);
  g.fillRect(0, 0, TILE * 2, TILE);
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeRect(0, 0, TILE * 2, TILE);

  // MacBook (sol)
  g.fillStyle(COLORS.mac, 1);
  g.fillRect(4, 6, 16, 10);
  g.fillStyle(COLORS.monitorOn, 1);
  g.fillRect(5, 7, 14, 8);

  // Mac Mini cube (sağ)
  g.fillStyle(COLORS.mac, 1);
  g.fillRect(TILE + 4, 8, 12, 8);
  g.fillStyle(accent, 1);
  g.fillRect(TILE + 4, 16, 12, 2);

  // Accent strip (ajan rengi)
  g.fillStyle(accent, 1);
  g.fillRect(0, TILE - 3, TILE * 2, 3);

  const container = scene.add.container(px, py, [g]);
  container.setSize(TILE * 2, TILE);
  return container;
}

/** Karakter sprite'ı — basit kafa + gövde. */
export function drawCharacter(
  scene: Phaser.Scene,
  px: number,
  py: number,
  color: number,
): Phaser.GameObjects.Container {
  const g = scene.add.graphics();
  // body
  g.fillStyle(color, 1);
  g.fillRect(-6, -4, 12, 14);
  // head
  g.fillStyle(0xf2d3a4, 1);
  g.fillRect(-5, -14, 10, 10);
  // outline
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeRect(-6, -4, 12, 14);
  g.strokeRect(-5, -14, 10, 10);

  const c = scene.add.container(px, py, [g]);
  c.setSize(14, 26);
  c.setDepth(5);
  return c;
}

/** Zeytin ağacı saksısı (spec satır 39). */
export function drawOlivePot(scene: Phaser.Scene, tileX: number, tileY: number): void {
  const px = tileX * TILE;
  const py = tileY * TILE;
  const g = scene.add.graphics();
  g.fillStyle(COLORS.olivePot, 1);
  g.fillRect(px + 8, py + 18, 16, 10);
  g.fillStyle(COLORS.oliveTrunk, 1);
  g.fillRect(px + 14, py + 8, 4, 12);
  g.fillStyle(COLORS.oliveLeaf, 1);
  g.fillCircle(px + 16, py + 6, 8);
  g.fillCircle(px + 10, py + 10, 5);
  g.fillCircle(px + 22, py + 10, 5);
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeRect(px + 8, py + 18, 16, 10);
}

/** Çay bardağı — NPC bıraktığında bir süre görünür. */
export function drawTeaCup(scene: Phaser.Scene, px: number, py: number): Phaser.GameObjects.Container {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.teaCup, 1);
  g.fillRect(-4, -3, 8, 6);
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeRect(-4, -3, 8, 6);
  g.fillStyle(COLORS.teaSteam, 0.6);
  g.fillCircle(0, -8, 2);
  g.fillCircle(-2, -12, 2);
  const c = scene.add.container(px, py, [g]);
  c.setDepth(4);
  return c;
}
