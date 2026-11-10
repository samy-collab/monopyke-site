import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // why: Riot media is rendered with plain <img> so onError can swap to a local
      // fallback; next/image would proxy through the server, which fails on networks
      // that block leagueoflegends.com even when the visitor's browser can reach it.
      "@next/next/no-img-element": "off",
    },
  },
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
];

export default config;
