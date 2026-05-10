export type AbortTimeoutHandle = {
  controller: AbortController;
  clear: () => void;
};

export function createAbortTimeout(timeoutMs: number): AbortTimeoutHandle {
  const controller = new AbortController();
  const timerId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  return {
    controller,
    clear: () => clearTimeout(timerId),
  };
}

export function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }
  return error instanceof Error && error.name === "AbortError";
}
