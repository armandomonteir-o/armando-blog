// Header search: term rules shared by the route and the browser, plus the debounce + abort logic
// kept out of the component so it can be tested without a DOM.

export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_MAX_LENGTH = 80;
export const SEARCH_DEBOUNCE_MS = 300;

export interface SearchResult {
  title: string;
  slug: string;
  category: string;
}

export type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; results: SearchResult[] }
  | { status: "error" };

export type NormalizedTerm = { ok: true; term: string } | { ok: false; reason: "short" | "long" };

export function normalizeSearchTerm(raw: string): NormalizedTerm {
  const term = raw.trim().replace(/\s+/g, " ");
  if (term.length < SEARCH_MIN_LENGTH) return { ok: false, reason: "short" };
  if (term.length > SEARCH_MAX_LENGTH) return { ok: false, reason: "long" };
  return { ok: true, term };
}

// The browser asks our own route, never WordPress.
export async function fetchSearchResults(
  term: string,
  signal: AbortSignal
): Promise<SearchResult[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal });
  if (!res.ok) throw new Error(`search failed: ${res.status}`);
  const data: { results: SearchResult[] } = await res.json();
  return data.results;
}

interface RunnerOptions {
  fetchResults: (term: string, signal: AbortSignal) => Promise<SearchResult[]>;
  onState: (state: SearchState) => void;
  delay?: number;
}

export function createSearchRunner({
  fetchResults,
  onState,
  delay = SEARCH_DEBOUNCE_MS,
}: RunnerOptions) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let controller: AbortController | undefined;

  function cancel() {
    clearTimeout(timer);
    timer = undefined;
    controller?.abort();
    controller = undefined;
  }

  function update(raw: string) {
    cancel();
    const parsed = normalizeSearchTerm(raw);
    if (!parsed.ok) {
      onState({ status: "idle" });
      return;
    }
    onState({ status: "loading" });
    timer = setTimeout(() => {
      const mine = new AbortController();
      controller = mine;
      fetchResults(parsed.term, mine.signal).then(
        (results) => {
          if (!mine.signal.aborted) onState({ status: "done", results });
        },
        () => {
          if (!mine.signal.aborted) onState({ status: "error" });
        }
      );
    }, delay);
  }

  return { update, cancel };
}
