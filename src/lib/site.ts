/**
 * Public site settings shared by metadata, sitemap and robots.
 * invariant: SITE_URL has no trailing slash and is the only canonical origin; every other
 * host serving the site (www, deploy previews) points crawlers back to it.
 */
export const SITE_HOST = "monopyke.com.br";
/** why: www is served too, but only as a permanent (308) redirect to SITE_HOST; without it, ranking splits across two origins. */
export const SITE_ALIAS_HOSTS = ["www.monopyke.com.br"];

/**
 * why: NEXT_PUBLIC_SITE_URL overrides the origin (e.g. a staging domain); `next dev` uses
 * localhost so local share cards work, and any production build defaults to the real domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production" ? `https://${SITE_HOST}` : "http://localhost:3000")
).replace(/\/+$/, "");

export const SITE_NAME = "PykeGap#ggwp · Mono Pyke";
export const SITE_DESCRIPTION =
  "Mono Pyke desde 2021. Como eu jogo de suporte, o que pickar comigo no bot, counters e as skins do Pyke.";

/** Every name people may type to find the site; feeds the alternate names in JSON-LD. */
export const SITE_ALIASES = ["Mono Pyke", "MonoPyke", "monopyke", SITE_HOST, `www.${SITE_HOST}`];

export const SITE_KEYWORDS = [
  "Pyke",
  "mono Pyke",
  "monopyke",
  "Mono Pyke Brasil",
  "PykeGap",
  "PykeGap#ggwp",
  "Pyke suporte",
  "Pyke support",
  "como jogar de Pyke",
  "Pyke dicas",
  "Pyke combos",
  "Pyke habilidades",
  "Pyke counters",
  "counter de Pyke",
  "duo com Pyke",
  "melhor ADC com Pyke",
  "Pyke bot lane",
  "Pyke skins",
  "Pyke Diamante",
  "Águas de Sentina",
  "Bilgewater",
  "League of Legends",
  "LoL",
  "LoL BR",
  "suporte",
];
