/**
 * Programmatik piksel sprite üretimi — Faz 2 zenginleştirilmiş sürüm.
 * Spec: 2D top-down ama masalarda 2.5D (yan/ön panel) hissi var; karakterler
 * baş-saç-göz-kol-bacak gösterir.
 *
 * Tüm pivot noktaları: masa = sol-üst köşe (tile-aligned),
 * karakter = ayakların basma noktası (pos.x, pos.y).
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
      // Hafif tahta çizgileri
      g.lineStyle(1, 0x2a1f17, 0.4);
      g.lineBetween(col * TILE, row * TILE + TILE, col * TILE + TILE, row * TILE + TILE);
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

  // Kilim deseni (light overlay stripes)
  g.fillStyle(0xffffff, 0.04);
  for (let i = 0; i < pw; i += 8) {
    g.fillRect(px + i, py, 1, ph);
  }

  // Dış çerçeve — duvar
  g.lineStyle(3, COLORS.wall, 1);
  g.strokeRect(px, py, pw, ph);
  // İç gölge
  g.lineStyle(1, 0x000000, 0.3);
  g.strokeRect(px + 2, py + 2, pw - 4, ph - 4);

  scene.add
    .text(px + 8, py + 6, label, {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#ffeec0",
      stroke: "#000000",
      strokeThickness: 2,
    })
    .setDepth(2);
}

/**
 * 2.5D masa: top-down ana yüzey + ön panel (alt 6px) + sağ yan panel (sağ 4px)
 * derinlik hissi verir. Üzerinde MacBook (ekran açık) ve Mac Mini var.
 */
export function drawDesk(
  scene: Phaser.Scene,
  tileX: number,
  tileY: number,
  accent: number,
): Phaser.GameObjects.Container {
  const px = tileX * TILE;
  const py = tileY * TILE;
  const W = TILE * 2;
  const H = TILE;
  const g = scene.add.graphics();

  // Sol gölge (yere düşen)
  g.fillStyle(0x000000, 0.35);
  g.fillRect(3, H - 2, W, 6);

  // Ana üst yüzey
  g.fillStyle(COLORS.desk, 1);
  g.fillRect(0, 0, W, H);

  // Üst yüzey ahşap damar
  g.lineStyle(1, 0x6a4a32, 0.6);
  for (let i = 4; i < W; i += 7) g.lineBetween(i, 2, i, H - 2);

  // Ön panel (2.5D)
  g.fillStyle(0x6a4a32, 1);
  g.fillRect(0, H - 4, W, 6);
  // Sağ yan panel
  g.fillStyle(0x4a3422, 1);
  g.fillRect(W - 4, 0, 4, H);

  // Outline
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeRect(0, 0, W, H);

  // === Üstte ekipman ===
  // MacBook (sol) — taban + ekran
  g.fillStyle(0xbbbbbb, 1);
  g.fillRect(6, H - 12, 18, 3); // taban
  g.fillStyle(COLORS.mac, 1);
  g.fillRect(7, H - 22, 16, 11); // ekran çerçevesi
  g.fillStyle(COLORS.monitorOn, 1);
  g.fillRect(8, H - 21, 14, 9); // ekran içi
  // Ekran detayı (kod satırları)
  g.fillStyle(0xffffff, 0.8);
  g.fillRect(9, H - 19, 6, 1);
  g.fillRect(9, H - 17, 8, 1);
  g.fillRect(9, H - 15, 5, 1);

  // Mac Mini cube (sağ orta) + accent led
  g.fillStyle(COLORS.mac, 1);
  g.fillRect(W - 24, H - 16, 14, 9);
  g.fillStyle(accent, 1);
  g.fillRect(W - 24, H - 9, 14, 2);
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeRect(W - 24, H - 16, 14, 9);

  // Kahve fincanı küçük detay
  g.fillStyle(0xf0e0c0, 1);
  g.fillRect(W - 7, H - 12, 4, 4);
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeRect(W - 7, H - 12, 4, 4);
  g.fillStyle(0x6a3018, 1);
  g.fillRect(W - 6, H - 11, 2, 1);

  // Accent şerit ön panel
  g.fillStyle(accent, 1);
  g.fillRect(0, H + 1, W, 2);

  const container = scene.add.container(px, py, [g]);
  container.setSize(W, H + 4);
  container.setDepth(3);
  return container;
}

export interface CharacterColors {
  shirt: number;
  hair: number;
  skin: number;
  pants: number;
}

/**
 * Daha insan-benzeri karakter sprite'ı:
 *   - Saç (üst kafa)
 *   - Yüz (cilt) + 2 göz + ağız
 *   - Boyun
 *   - Gömlek/üst (omuzlu)
 *   - Kollar yanlarda
 *   - Pantolon + iki bacak
 *   - Ayakkabılar
 *   - Yere düşen gölge
 *
 * Boyut: 14 px genişlik × 28 px yükseklik (ayaklar pos.y'de).
 */
export function drawCharacter(
  scene: Phaser.Scene,
  px: number,
  py: number,
  c: CharacterColors,
): Phaser.GameObjects.Container {
  const g = scene.add.graphics();

  // Gölge (oval ayak altı)
  g.fillStyle(0x000000, 0.45);
  g.fillEllipse(0, 1, 14, 5);

  // Bacak sol
  g.fillStyle(c.pants, 1);
  g.fillRect(-4, -8, 3, 8);
  // Bacak sağ
  g.fillRect(1, -8, 3, 8);
  // Ayakkabılar
  g.fillStyle(0x1a1a1a, 1);
  g.fillRect(-5, -1, 4, 2);
  g.fillRect(1, -1, 4, 2);

  // Gömlek (omuzlu)
  g.fillStyle(c.shirt, 1);
  g.fillRect(-5, -16, 10, 8);
  // Gömlek yaka (V şekli)
  g.fillStyle(c.skin, 1);
  g.fillTriangle(-1, -16, 0, -14, 1, -16);

  // Kollar yanlarda
  g.fillStyle(c.shirt, 1);
  g.fillRect(-6, -16, 2, 7);
  g.fillRect(4, -16, 2, 7);
  // Eller
  g.fillStyle(c.skin, 1);
  g.fillRect(-6, -10, 2, 2);
  g.fillRect(4, -10, 2, 2);

  // Boyun
  g.fillStyle(c.skin, 1);
  g.fillRect(-1, -18, 3, 2);

  // Kafa (yüz)
  g.fillStyle(c.skin, 1);
  g.fillRect(-4, -25, 9, 8);
  // Yüz alt çene gölgesi
  g.fillStyle(c.skin, 0.7);
  g.fillRect(-4, -18, 9, 1);

  // Saç (kafanın üstü ve yan)
  g.fillStyle(c.hair, 1);
  g.fillRect(-5, -27, 11, 4);
  g.fillRect(-5, -26, 2, 6); // sol favori
  g.fillRect(4, -26, 2, 6); // sağ favori

  // Gözler
  g.fillStyle(0x111111, 1);
  g.fillRect(-2, -22, 1, 1);
  g.fillRect(2, -22, 1, 1);

  // Ağız (gülümseme)
  g.fillStyle(0x4a2018, 1);
  g.fillRect(-1, -19, 3, 1);

  // Genel outline (zayıf)
  g.lineStyle(1, COLORS.outline, 0.6);
  g.strokeRect(-5, -27, 11, 4); // saç üst
  g.strokeRect(-4, -25, 9, 8); // yüz
  g.strokeRect(-5, -16, 10, 8); // gömlek

  const cont = scene.add.container(px, py, [g]);
  cont.setSize(14, 28);
  cont.setDepth(5);
  return cont;
}

/** Zeytin ağacı saksısı — daha detaylı: oval taç + birkaç meyve. */
export function drawOlivePot(scene: Phaser.Scene, tileX: number, tileY: number): void {
  const px = tileX * TILE;
  const py = tileY * TILE;
  const g = scene.add.graphics();

  // Gölge
  g.fillStyle(0x000000, 0.35);
  g.fillEllipse(px + 16, py + 30, 22, 5);

  // Saksı (trapezoid hissi)
  g.fillStyle(COLORS.olivePot, 1);
  g.fillRect(px + 6, py + 20, 20, 10);
  g.fillStyle(0x4a2a18, 1);
  g.fillRect(px + 5, py + 19, 22, 2); // üst kenar

  // Gövde
  g.fillStyle(COLORS.oliveTrunk, 1);
  g.fillRect(px + 14, py + 8, 4, 12);

  // Yaprak tacı (üst üste oval daireler)
  g.fillStyle(COLORS.oliveLeaf, 1);
  g.fillCircle(px + 16, py + 4, 9);
  g.fillStyle(0x8a9a4f, 1);
  g.fillCircle(px + 10, py + 9, 6);
  g.fillCircle(px + 22, py + 9, 6);
  g.fillStyle(0x5a6a30, 1);
  g.fillCircle(px + 16, py + 8, 5);

  // Zeytin meyveleri
  g.fillStyle(0x2a1a3a, 1);
  g.fillCircle(px + 12, py + 4, 1.5);
  g.fillCircle(px + 20, py + 5, 1.5);
  g.fillCircle(px + 16, py + 2, 1.5);

  g.lineStyle(1, COLORS.outline, 1);
  g.strokeRect(px + 6, py + 20, 20, 10);
}

/** Çay bardağı + ince buhar. */
export function drawTeaCup(scene: Phaser.Scene, px: number, py: number): Phaser.GameObjects.Container {
  const g = scene.add.graphics();
  // gölge
  g.fillStyle(0x000000, 0.4);
  g.fillEllipse(0, 4, 10, 3);
  // bardak
  g.fillStyle(COLORS.teaCup, 1);
  g.fillRect(-4, -3, 8, 6);
  // çay rengi
  g.fillStyle(0xc8702a, 1);
  g.fillRect(-3, -2, 6, 1);
  // sap
  g.fillStyle(COLORS.teaCup, 1);
  g.fillRect(4, -2, 2, 4);
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeRect(-4, -3, 8, 6);
  // buhar
  g.fillStyle(COLORS.teaSteam, 0.7);
  g.fillCircle(-1, -6, 1.5);
  g.fillCircle(1, -10, 1.5);
  g.fillCircle(-1, -14, 1.5);

  const c = scene.add.container(px, py, [g]);
  c.setDepth(6);
  return c;
}

/** Toplantı masası (büyük yuvarlak ortada) — toplantı odasını süsler. */
export function drawMeetingTable(
  scene: Phaser.Scene,
  centerX: number,
  centerY: number,
): void {
  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.35);
  g.fillEllipse(centerX, centerY + 4, 60, 12);
  g.fillStyle(0x6a4a32, 1);
  g.fillEllipse(centerX, centerY, 56, 28);
  g.fillStyle(0x8a6a4a, 1);
  g.fillEllipse(centerX, centerY - 2, 48, 22);
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeEllipse(centerX, centerY, 56, 28);
  // Üzerinde kağıt + kalem
  g.fillStyle(0xf5f0e0, 1);
  g.fillRect(centerX - 6, centerY - 4, 12, 8);
  g.fillStyle(0x1a1a1a, 1);
  g.fillRect(centerX + 1, centerY - 2, 6, 1);
  g.fillRect(centerX + 1, centerY, 5, 1);
}

/** Çay ocağı: tezgah + kazan + dolap. */
export function drawTeaCounter(
  scene: Phaser.Scene,
  tileX: number,
  tileY: number,
): void {
  const px = tileX * TILE;
  const py = tileY * TILE;
  const g = scene.add.graphics();
  // tezgah
  g.fillStyle(0x9a7a5a, 1);
  g.fillRect(px, py, TILE * 4, 18);
  g.fillStyle(0x7a5a3a, 1);
  g.fillRect(px, py + 14, TILE * 4, 4);
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeRect(px, py, TILE * 4, 18);

  // Semaver (sarı, daire)
  g.fillStyle(0xd4a017, 1);
  g.fillCircle(px + 18, py + 4, 7);
  g.fillStyle(0xb88010, 1);
  g.fillCircle(px + 18, py + 4, 5);
  g.fillStyle(0x6a3018, 1);
  g.fillRect(px + 17, py - 5, 2, 4); // baca
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeCircle(px + 18, py + 4, 7);

  // Çay bardakları sırada
  for (let i = 0; i < 4; i++) {
    const cx = px + 40 + i * 8;
    g.fillStyle(COLORS.teaCup, 1);
    g.fillRect(cx, py + 4, 5, 5);
    g.fillStyle(0xc8702a, 1);
    g.fillRect(cx + 1, py + 5, 3, 1);
    g.lineStyle(1, COLORS.outline, 1);
    g.strokeRect(cx, py + 4, 5, 5);
  }
}

/** Pencere — duvar üstünde gökyüzü manzarası. */
export function drawWindow(
  scene: Phaser.Scene,
  tileX: number,
  tileY: number,
): void {
  const px = tileX * TILE;
  const py = tileY * TILE;
  const W = TILE * 3;
  const H = 14;
  const g = scene.add.graphics();
  // çerçeve
  g.fillStyle(0x4a3a2a, 1);
  g.fillRect(px, py, W, H);
  // gökyüzü
  g.fillStyle(0x7ac1e0, 1);
  g.fillRect(px + 2, py + 2, W - 4, H - 4);
  // bulutlar
  g.fillStyle(0xffffff, 0.8);
  g.fillEllipse(px + 12, py + 6, 10, 4);
  g.fillEllipse(px + W - 18, py + 7, 12, 5);
  // çerçeve dikey ayırıcı
  g.fillStyle(0x4a3a2a, 1);
  g.fillRect(px + W / 2 - 1, py, 2, H);
  g.lineStyle(1, COLORS.outline, 1);
  g.strokeRect(px, py, W, H);
}
