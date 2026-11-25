export const SOURCE_LOADING = "// Loading…";
export const SOURCE_ERROR = "// Unable to load source.";

export async function fetchSource(registry: string) {
  try {
    const res = await fetch(`/r/${encodeURIComponent(registry)}.json`);
    if (!res.ok) return SOURCE_ERROR;
    const item: {
      files?: { path: string; target?: string; content?: string }[];
    } = await res.json();
    const files = item.files?.filter((file) => file.content) ?? [];
    if (files.length === 0) return SOURCE_ERROR;
    if (files.length === 1) return files[0].content!;
    return files
      .map((file) => `// ${file.target ?? file.path}\n${file.content!.trim()}`)
      .join("\n\n");
  } catch {
    return SOURCE_ERROR;
  }
}
