import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Mono Pyke",
    description: SITE_DESCRIPTION,
    lang: "pt-BR",
    id: "/",
    start_url: "/",
    scope: "/",
    categories: ["games", "entertainment"],
    display: "standalone",
    background_color: "#040d0f",
    theme_color: "#061416",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
