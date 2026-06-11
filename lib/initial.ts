/** First character of a name/username, uppercased — avatar fallback. */
export function initial(name?: string | null): string {
  const ch = (name ?? "").trim().charAt(0);
  return ch ? ch.toUpperCase() : "?";
}
