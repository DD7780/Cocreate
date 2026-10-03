import type { AIEffort } from "../../shared/types";

export const effortChoices: Array<{
  id: AIEffort;
  label: string;
  description: string;
  tier: number;
}> = [
  {
    id: "light",
    label: "Low",
    description: "Fast drafts and small changes.",
    tier: 1,
  },
  {
    id: "medium",
    label: "Medium",
    description: "Recommended balance of quality, checks, and cost.",
    tier: 2,
  },
  {
    id: "high",
    label: "High",
    description: "More room for difficult work.",
    tier: 3,
  },
  {
    id: "extra",
    label: "Extra",
    description: "Largest bounded allowance.",
    tier: 4,
  },
];
