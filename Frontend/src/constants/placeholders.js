/**
 * Harici placeholder siteleri (via.placeholder.com vb.) ağda sık sık engellenir veya kapanır.
 * data: SVG ile çevrimdışı/engellenmez yedek görsel.
 */
const recipeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520"><rect fill="#fff4eb" width="800" height="520"/><rect x="40" y="40" width="720" height="440" rx="16" fill="#fff" stroke="#f0e8df" stroke-width="2"/><text x="400" y="268" text-anchor="middle" fill="#f07a13" font-family="system-ui,sans-serif" font-size="24" font-weight="800">Tarif görseli</text><text x="400" y="308" text-anchor="middle" fill="#888" font-family="system-ui,sans-serif" font-size="14">Görsel yok veya yüklenemedi</text></svg>`;

const videoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><rect fill="#111" width="1280" height="720"/><circle cx="640" cy="360" r="48" fill="rgba(255,255,255,0.15)"/><polygon points="620,330 620,390 670,360" fill="#fff"/><text x="640" y="440" text-anchor="middle" fill="#aaa" font-family="system-ui,sans-serif" font-size="20" font-weight="700">Video önizleme</text></svg>`;

export const RECIPE_IMAGE_PLACEHOLDER =
  `data:image/svg+xml,${encodeURIComponent(recipeSvg)}`;

export const VIDEO_PREVIEW_PLACEHOLDER =
  `data:image/svg+xml,${encodeURIComponent(videoSvg)}`;
