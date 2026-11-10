import type { MetadataRoute } from "next";
import { PROFILE } from "@/data/profile";
import { localSplashUrl } from "@/lib/ddragon";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      // why: the sitemap is generated at build time, so this is the date of the deployed content.
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${SITE_URL}${localSplashUrl}`, `${SITE_URL}${PROFILE.photo}`],
    },
  ];
}
