// Contact-form topics. The value travels in the form and in deep links
// (/contact?topic=takedown#contact-form); the label goes into the email subject
// so the inbox can filter by topic. Unknown values fall back to "general".
export const CONTACT_TOPICS = [
  { value: "general", label: "General" },
  { value: "press", label: "Press" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "correction", label: "Corrections" },
  { value: "takedown", label: "Photo or content takedown" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export function normalizeTopic(raw: string | null | undefined): ContactTopic {
  const v = String(raw ?? "").trim().toLowerCase();
  const hit = CONTACT_TOPICS.find((t) => t.value === v);
  return hit ? hit.value : "general";
}

export function topicLabel(value: ContactTopic): string {
  return CONTACT_TOPICS.find((t) => t.value === value)?.label ?? "General";
}
