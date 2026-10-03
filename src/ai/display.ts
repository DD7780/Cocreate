import type { AIResolvedLayer } from "../../shared/types";

export const dollars = (value: number | undefined) =>
  value === undefined ? "Unknown" : `$${value.toFixed(value < 0.1 ? 3 : 2)}`;

export const rateSummary = (
  label: string,
  rate: AIResolvedLayer["rate"] | undefined,
) =>
  rate?.inputPerMillion !== undefined && rate.outputPerMillion !== undefined
    ? `${label} · Input ${dollars(rate.inputPerMillion)}/1M · Output ${dollars(rate.outputPerMillion)}/1M`
    : `${label} rates unavailable`;
