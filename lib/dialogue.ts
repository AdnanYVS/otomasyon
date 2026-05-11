/**
 * Demo workflow data for Faz 2-3 UI prototypes. Backend gerçek üretim
 * Faz 4'te bağlandığında bu sahte iş akışı kaldırılır.
 */
import type { AgentRole } from "./personas";

export interface WorkflowBrief {
  title: string;
  brief: string;
}

export const WORKFLOW_BRIEF: WorkflowBrief[] = [
  {
    title: "Bahar Koleksiyonu Lansmanı",
    brief: "Yume Atelier — organik pamuk, bitkisel boya, bahar paleti.",
  },
  {
    title: "Yaza Hazırlık Kampanyası",
    brief: "Sürdürülebilir plaj kıyafetleri için ön sipariş akışı.",
  },
];

export interface WorkflowStep {
  role: AgentRole;
  verb: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { role: "lead", verb: "brifi okuyup işi dağıtıyorum" },
  { role: "writer", verb: "ana metni yazıyorum" },
  { role: "seo", verb: "metni SEO için optimize ediyorum" },
  { role: "visual", verb: "görsel prompt'larını hazırlıyorum" },
  { role: "ads", verb: "kampanya yapısını çıkarıyorum" },
  { role: "lead", verb: "çıktıyı derleyip onaya sunuyorum" },
];

export const HANDOFF_LINES: Partial<Record<AgentRole, string[]>> = {
  lead: ["Sevgi, sıra sende.", "Metni hazırla lütfen."],
  writer: ["Vedat, metni SEO için sana atıyorum.", "Hayrettin görsele bakar mı?"],
  seo: ["Hayrettin, görsele geçebiliriz.", "Anahtar kelimeler hazır."],
  visual: ["Berkcan, kampanyaya başlayabiliriz.", "Görseller listelendi."],
  ads: ["Muhittin, kampanya taslağı hazır.", "Onaya gönderiyorum."],
};
