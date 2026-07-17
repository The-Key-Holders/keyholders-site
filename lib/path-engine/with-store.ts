import { ensureOpsStore } from "./store";

/** Ensure durable store is loaded before handling ops requests. */
export async function withOpsStore<T>(fn: () => T | Promise<T>): Promise<T> {
  await ensureOpsStore();
  return fn();
}
