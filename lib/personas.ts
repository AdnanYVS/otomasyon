/**
 * 5 ajan + tea NPC roster. Spec: yumeagency.md satır 65-94.
 *
 * Roller spec'in Ajan 1-5'iyle birebir eşleşir:
 *   writer = Ajan 1 (Metin), seo = Ajan 2, visual = Ajan 3,
 *   ads    = Ajan 4 (Reklam), lead = Ajan 5 (Lead).
 *
 * `tea` ayrı bir NPC rolüdür — spec satır 46-48; oyun mekaniğiyle ilgisi
 * yoktur, sadece atmosferik amaçlıdır.
 */

export type AgentRole = "writer" | "seo" | "visual" | "ads" | "lead";
export type CharacterRole = AgentRole | "tea";

export interface PersonaSeat {
  /** Top-down grid position in tiles (1 tile = 32px). */
  x: number;
  y: number;
}

export interface Persona {
  id: CharacterRole;
  name: string;
  role: string;
  shortRole: string;
  /** Ana renk — masa şeridi ve gömlek için. */
  color: number;
  /** Saç rengi. */
  hair: number;
  /** Cilt tonu. */
  skin: number;
  /** Pantolon / etek rengi. */
  pants: number;
  initialPos: PersonaSeat;
  bubble?: string;
}

export const PERSONAS: Record<CharacterRole, Persona> = {
  lead: {
    id: "lead",
    name: "Muhittin",
    role: "Genel Yönetici (Lead Agent)",
    shortRole: "Lead",
    color: 0xd4a017,
    hair: 0x3a2a18,
    skin: 0xefc9a1,
    pants: 0x2b2b3a,
    initialPos: { x: 4, y: 3 },
  },
  writer: {
    id: "writer",
    name: "Sevgi",
    role: "Metin ve İçerik Yazarı",
    shortRole: "Writer",
    color: 0xe06f9c,
    hair: 0x5a2a18,
    skin: 0xf2d3a4,
    pants: 0x3b2438,
    initialPos: { x: 8, y: 3 },
  },
  seo: {
    id: "seo",
    name: "Vedat",
    role: "SEO Uzmanı",
    shortRole: "SEO",
    color: 0x6aa9e0,
    hair: 0x1a1a1a,
    skin: 0xe0b890,
    pants: 0x1f3a55,
    initialPos: { x: 12, y: 3 },
  },
  visual: {
    id: "visual",
    name: "Hayrettin",
    role: "Görsel Üretim Uzmanı",
    shortRole: "Visual",
    color: 0x9d7ad1,
    hair: 0x6a3a18,
    skin: 0xe8c098,
    pants: 0x3a2b4a,
    initialPos: { x: 4, y: 10 },
  },
  ads: {
    id: "ads",
    name: "Berkcan",
    role: "Reklam Yöneticisi",
    shortRole: "Ads",
    color: 0xe07a3c,
    hair: 0xc89060,
    skin: 0xefc9a1,
    pants: 0x4a3019,
    initialPos: { x: 8, y: 10 },
  },
  tea: {
    id: "tea",
    name: "İzzet",
    role: "Çaycı (NPC)",
    shortRole: "Tea",
    color: 0xc94b4b,
    hair: 0xeeeeee, // beyaz saç
    skin: 0xddb088,
    pants: 0x2a2a2a,
    initialPos: { x: 18, y: 13 },
  },
};

export const AGENT_ROLES: AgentRole[] = ["lead", "writer", "seo", "visual", "ads"];

export const PERSONA_LIST: Persona[] = Object.values(PERSONAS);

export const AGENT_LIST: Persona[] = AGENT_ROLES.map((r) => PERSONAS[r]);
