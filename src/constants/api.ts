import { CLIENT_PAYMENT_ABORT_MS, PAYMENT_GATEWAY_TIMEOUT_MS } from "@/constants/payment";

/** Frontend fetch abort window — request cancelled if gateway slower than this (Phase 7). */
export const FRONTEND_TIMEOUT_MS = CLIENT_PAYMENT_ABORT_MS;

/** Probability of an immediate `success` outcome (~60%). */
export const SUCCESS_PROBABILITY = 0.6;

/** Probability of an immediate `failed` outcome (~25%). */
export const FAILURE_PROBABILITY = 0.25;

/** Probability of a delayed `timeout` outcome (~15%). */
export const TIMEOUT_PROBABILITY = 0.15;

/** Intentional gateway delay before returning `timeout` (matches mock gateway spec). */
export const PAYMENT_TIMEOUT_DELAY_MS = PAYMENT_GATEWAY_TIMEOUT_MS;

export const PAYMENT_API_PAY_ROUTE = "/api/pay";
