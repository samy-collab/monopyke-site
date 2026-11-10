import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // why: /_next/ holds build chunks and image-optimizer URLs; crawlers that index them
    // waste crawl budget, but CSS/JS must stay fetchable so Google can render the page.
    rules: [{ userAgent: "*", allow: ["/", "/_next/static/"], disallow: ["/_next/image", "/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
