import {
  FAILURE_PROBABILITY,
  SUCCESS_PROBABILITY,
  TIMEOUT_PROBABILITY,
} from "@/constants/api";
import type { FailureReason } from "@/constants/errors";
import { FAILURE_REASONS } from "@/constants/errors";

export type GatewaySimulationOutcome = "success" | "failure" | "timeout";

const PROBABILITY_SUM =
  SUCCESS_PROBABILITY + FAILURE_PROBABILITY + TIMEOUT_PROBABILITY;

if (Math.abs(PROBABILITY_SUM - 1) > 1e-9) {
  throw new Error(
    `Gateway probabilities must sum to 1, got ${PROBABILITY_SUM}.`,
  );
}

export function rollGatewaySimulationOutcome(): GatewaySimulationOutcome {
  const roll = Math.random();
  if (roll < SUCCESS_PROBABILITY) {
    return "success";
  }
  if (roll < SUCCESS_PROBABILITY + FAILURE_PROBABILITY) {
    return "failure";
  }
  return "timeout";
}

export function pickRandomFailureReason(): FailureReason {
  const index = Math.floor(Math.random() * FAILURE_REASONS.length);
  const choice = FAILURE_REASONS[index];
  if (choice !== undefined) {
    return choice;
  }
  return FAILURE_REASONS[0];
}
