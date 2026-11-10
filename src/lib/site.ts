/**
 * Public site settings shared by metadata, sitemap and robots.
 * invariant: SITE_URL has no trailing slash; set NEXT_PUBLIC_SITE_URL to the deployed
 * origin, otherwise absolute URLs in the sitemap and share cards point at localhost.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
export const SITE_NAME = "PykeGap#ggwp · Mono Pyke";
export const SITE_DESCRIPTION =
  "Mono Pyke desde 2021. Como eu jogo de suporte, o que pickar comigo no bot, counters e as skins do Pyke.";
