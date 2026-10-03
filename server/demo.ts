import type { Requirement } from "../shared/types.js";
import type { AgentChange } from "./generator.js";

const clean = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);

export function demoExtract(
  participantId: string,
  participantName: string,
  changes: AgentChange[],
  context: string,
  previous: Requirement | undefined,
  revision: number,
): Requirement {
  const text = clean(
    changes.map((change) => change.after).join(" ") || context,
  );
  const lower = text.toLowerCase();
  const features: string[] = [];
  if (/task|todo|checklist/.test(lower))
    features.push("Add and complete tasks");
  if (/vot|poll|choice/.test(lower))
    features.push("Create choices and record votes");
  if (/board|column|kanban/.test(lower))
    features.push("Organize items in a visual board");
  if (/search|filter/.test(lower))
    features.push("Search and filter the working set");
  if (!features.length)
    features.push(
      text
        ? `Turn this idea into an interactive flow: ${text.slice(0, 120)}`
        : "Provide a clear interactive starting point",
    );
  const design = [
    /(dark|night)/.test(lower)
      ? "Use a dark interface"
      : /(bright|colorful)/.test(lower)
        ? "Use an energetic color palette"
        : "Keep the interface calm and focused",
  ];
  const constraints = /mobile|phone|responsive/.test(lower)
    ? ["Work well on small screens"]
    : ["Keep the first version frontend-only"];
  const explicitWithdrawal =
    /\b(?:withdraw|remove the requirement|no longer want|do not build)\b/.test(
      lower,
    );
  const withdrawals = explicitWithdrawal ? previous?.features || [] : [];
  const retained = (previous?.features || []).filter(
    (feature) => !withdrawals.includes(feature),
  );
  const mergedFeatures = [...new Set([...retained, ...features])];
  return {
    id: crypto.randomUUID(),
    participantId,
    participantName,
    goals: text ? [text] : previous?.goals || ["Shape the team’s shared idea"],
    features: mergedFeatures,
    design,
    constraints,
    questions: [],
    additions: features.filter((x) => !previous?.features.includes(x)),
    modifications: [],
    withdrawals,
    classification: "explicit_request",
    affectedRequirementIds: [],
    sourceRevision: revision,
    sourceEditSeqs: changes.map((change) => change.seq),
    sourcePassages: text ? [text.slice(0, 240)] : [],
    revision,
    createdAt: new Date().toISOString(),
  };
}
