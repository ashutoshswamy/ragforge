import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/privacy", "/terms", "/sign-in", "/sign-up"],
      disallow: ["/pipeline", "/pipelines", "/api/"],
    },
    sitemap: "https://ragforge.ashutoshswamy.in/sitemap.xml",
  };
}
