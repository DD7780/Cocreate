import * as Y from "yjs";
import type { ChangeKind, Requirement } from "../shared/types.js";

export const documentText = (doc: Y.Doc) =>
  doc
    .getXmlFragment("default")
    .toJSON()
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12_000);

export const authenticatedDelta = (before: string, after: string) => {
  let start = 0;
  while (
    start < before.length &&
    start < after.length &&
    before[start] === after[start]
  )
    start++;
  let end = 0;
  while (
    end < before.length - start &&
    end < after.length - start &&
    before[before.length - 1 - end] === after[after.length - 1 - end]
  )
    end++;
  return {
    before: before.slice(start, before.length - end),
    after: after.slice(start, after.length - end),
  };
};

export const kindOf = (before: string, after: string): ChangeKind =>
  after.length > before.length
    ? "insert"
    : after.length < before.length
      ? "delete"
      : "modify";

export const requirementFingerprint = (requirement: Requirement | undefined) =>
  requirement
    ? JSON.stringify({
        goals: requirement.goals,
        features: requirement.features,
        design: requirement.design,
        constraints: requirement.constraints,
        questions: requirement.questions,
        additions: requirement.additions,
        modifications: requirement.modifications,
        withdrawals: requirement.withdrawals,
      })
    : "";
