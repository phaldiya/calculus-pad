import type { AppState } from "../types";

const STORAGE_KEY = "calculus-lab-state";

export function saveState(state: AppState): void {
  try {
    const serialized = JSON.stringify({
      equations: state.equations,
      pointDataSets: state.pointDataSets,
      history: state.history,
      variables: state.variables,
      darkMode: state.darkMode,
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Storage full or unavailable
  }
}

export function loadState(): Partial<AppState> | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as Partial<AppState>;
  } catch {
    return null;
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
