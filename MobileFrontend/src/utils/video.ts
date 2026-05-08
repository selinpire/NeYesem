export type ParsedRecipeVideo =
  | { kind: "youtube"; original: string; thumbUrl: string }
  | { kind: "vimeo"; original: string; thumbUrl?: string }
  | { kind: "direct"; original: string };

function parseYouTube(urlString: string) {
  try {
    const url = new URL(urlString.trim());
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ?? null;
    }

    if (!host.includes("youtube.com") && !host.includes("youtube-nocookie.com")) {
      return null;
    }

    if (url.pathname.startsWith("/embed/")) {
      const id = url.pathname.slice(7).split("/")[0];
      return id ?? null;
    }

    const videoId = url.searchParams.get("v");
    if (videoId) {
      return videoId;
    }

    const shorts = url.pathname.match(/^\/shorts\/([^/?]+)/);
    return shorts?.[1] ?? null;
  } catch {
    return null;
  }
}

function parseVimeo(urlString: string) {
  try {
    const url = new URL(urlString.trim());
    if (!url.hostname.toLowerCase().includes("vimeo.com")) {
      return null;
    }
    const parts = url.pathname.split("/").filter(Boolean);
    let id = parts[0];
    if (id === "video" && parts[1]) {
      id = parts[1];
    }
    return id && /^\d+$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function parseRecipeVideoUrl(raw?: string | null): ParsedRecipeVideo | null {
  const original = raw?.trim();
  if (!original) {
    return null;
  }

  try {
    const parsed = new URL(original);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
  } catch {
    return null;
  }

  const youtubeId = parseYouTube(original);
  if (youtubeId) {
    return {
      kind: "youtube",
      original,
      thumbUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    };
  }

  const vimeoId = parseVimeo(original);
  if (vimeoId) {
    return {
      kind: "vimeo",
      original,
    };
  }

  return {
    kind: "direct",
    original,
  };
}
