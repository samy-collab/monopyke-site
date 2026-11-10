export const DDRAGON = "https://ddragon.leagueoflegends.com";

/**
 * invariant: used only when versions.json cannot be reached at build time and in the
 * visitor's browser; it must be a version that Data Dragon still serves.
 */
export const FALLBACK_VERSION = "14.24.1";

export type DdragonData = {
  version: string;
  /** champion id -> image.full from champion.json */
  images: Record<string, string>;
  source: "live" | "fallback";
};

export const pykeSplashUrl = `${DDRAGON}/cdn/img/champion/splash/Pyke_0.jpg`;
/** Bundled copy of Pyke_0.jpg for networks that block Riot's domain. */
export const localSplashUrl = "/images/pyke-splash.jpg";

export function squareUrl(version: string, imageFull: string): string {
  return `${DDRAGON}/cdn/${version}/img/champion/${imageFull}`;
}

/**
 * Riot's official ability-preview clips, as linked from leagueoflegends.com champion pages.
 * why: browsers try each source in order; the cloudfront webm comes first because it
 * resolves on networks that block Riot's own domains, and riotcdn adds an mp4 for Safari.
 */
export function abilityClipSources(
  championKey: number,
  ability: "P1" | "Q1" | "W1" | "E1" | "R1",
): { src: string; type: string }[] {
  const k = String(championKey).padStart(4, "0");
  const file = `ability_${k}_${ability}`;
  return [
    { src: `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${k}/${file}.webm`, type: "video/webm" },
    { src: `https://lol.dyn.riotcdn.net/x/videos/champion-abilities/${k}/${file}.webm`, type: "video/webm" },
    { src: `https://lol.dyn.riotcdn.net/x/videos/champion-abilities/${k}/${file}.mp4`, type: "video/mp4" },
  ];
}

export function fallbackData(ids: string[]): DdragonData {
  // why: champion.json names every square `${id}.png`; this mirrors it so cards still
  // point at real files when champion.json itself was unreachable.
  return {
    version: FALLBACK_VERSION,
    images: Object.fromEntries(ids.map((id) => [id, `${id}.png`])),
    source: "fallback",
  };
}

type FetchInit = RequestInit & { next?: { revalidate?: number } };

/** Resolves the latest version and each champion's image.full from champion.json. */
export async function loadDdragon(ids: string[], init: FetchInit = {}): Promise<DdragonData> {
  try {
    const versionsRes = await fetch(`${DDRAGON}/api/versions.json`, {
      ...init,
      signal: AbortSignal.timeout(6000),
    });
    if (!versionsRes.ok) throw new Error(`versions.json ${versionsRes.status}`);
    const versions = (await versionsRes.json()) as string[];
    const version = versions[0];

    const champsRes = await fetch(`${DDRAGON}/cdn/${version}/data/pt_BR/champion.json`, {
      ...init,
      signal: AbortSignal.timeout(6000),
    });
    if (!champsRes.ok) throw new Error(`champion.json ${champsRes.status}`);
    const json = (await champsRes.json()) as {
      data: Record<string, { image: { full: string } }>;
    };

    const images: Record<string, string> = {};
    for (const id of ids) {
      const full = json.data[id]?.image.full;
      if (!full) throw new Error(`champion ${id} missing from champion.json`);
      images[id] = full;
    }
    return { version, images, source: "live" };
  } catch {
    return fallbackData(ids);
  }
}
