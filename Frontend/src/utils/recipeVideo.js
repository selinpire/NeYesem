/**
 * Tarif videoUrl değerini ayrıştırır (YouTube, Vimeo, doğrudan dosya / genel URL).
 */

export function parseYouTube(urlString) {
  try {
    const u = new URL(urlString.trim());
    const host = u.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? { id, embedBase: `https://www.youtube.com/embed/${id}` } : null;
    }

    if (!host.includes("youtube.com") && !host.includes("youtube-nocookie.com")) {
      return null;
    }

    if (u.pathname.startsWith("/embed/")) {
      const id = u.pathname.slice(7).split("/")[0];
      return id ? { id, embedBase: `https://www.youtube.com/embed/${id}` } : null;
    }

    const v = u.searchParams.get("v");
    if (v) {
      return { id: v, embedBase: `https://www.youtube.com/embed/${v}` };
    }

    const shorts = u.pathname.match(/^\/shorts\/([^/?]+)/);
    if (shorts) {
      return { id: shorts[1], embedBase: `https://www.youtube.com/embed/${shorts[1]}` };
    }
  } catch {
    return null;
  }
  return null;
}

export function parseVimeo(urlString) {
  try {
    const u = new URL(urlString.trim());
    if (!u.hostname.toLowerCase().includes("vimeo.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    let id = parts[0];
    if (id === "video" && parts[1]) id = parts[1];
    if (!id || !/^\d+$/.test(id)) return null;
    return { id, embedBase: `https://player.vimeo.com/video/${id}` };
  } catch {
    return null;
  }
}

export function parseRecipeVideoUrl(raw) {
  const original = (raw || "").trim();
  if (!original) return null;

  let parsed;
  try {
    parsed = new URL(original);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  const yt = parseYouTube(original);
  if (yt) {
    return {
      kind: "youtube",
      original,
      embedBase: yt.embedBase,
      thumbUrl: `https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg`,
    };
  }

  const vm = parseVimeo(original);
  if (vm) {
    return {
      kind: "vimeo",
      original,
      embedBase: vm.embedBase,
      thumbUrl: null,
    };
  }

  return { kind: "direct", original, src: original };
}
