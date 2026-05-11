/**
 * Phaser sahnesinin paylaşımlı sabitleri. Spec'in 2D top-down piksel
 * art perspektifine sadık kalıyoruz (satır 38).
 */
export const TILE = 32;
export const MAP_COLS = 24;
export const MAP_ROWS = 16;
export const MAP_W = MAP_COLS * TILE;
export const MAP_H = MAP_ROWS * TILE;

export const COLORS = {
  floor: 0x3a2a1f,
  floorAlt: 0x46342a,
  wall: 0x5a4334,
  meetingFloor: 0x4a5d3a,
  teaFloor: 0x5b4a3a,
  desk: 0x8a6a4a,
  monitorOn: 0x7fc1ff,
  monitorOff: 0x223344,
  mac: 0xcccccc,
  olivePot: 0x6b3f2a,
  oliveLeaf: 0x6b7a3f,
  oliveTrunk: 0x4a3a2a,
  teaCup: 0xf0e0c0,
  teaSteam: 0xffffff,
  outline: 0x1a120c,
} as const;

/** Top-down room layout in tile coords. */
export const ROOMS = {
  meeting: { x: 14, y: 1, w: 9, h: 5 }, // toplantı odası
  tea: { x: 14, y: 9, w: 9, h: 5 }, // çay ocağı
};

export const OLIVE_POTS: Array<{ x: number; y: number }> = [
  { x: 1, y: 1 },
  { x: 1, y: 14 },
  { x: 12, y: 1 },
  { x: 12, y: 14 },
  { x: 22, y: 7 },
];

/** Tea NPC her N saniyede bir yeni waypoint seçer. Spec: 2-3 dakika. */
export const TEA_INTERVAL_MS_MIN = 120_000;
export const TEA_INTERVAL_MS_MAX = 180_000;
