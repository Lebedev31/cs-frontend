import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/x9FqL7rA2pVdM3sK",
          "/api",
          "/login",
          "/registration",
          "/forgotPassword",
          "/payment",
          "/settingAccount",
          "/myServers",
          "/finHistory",
          "/settingServer",
          "/addServer",
          "/premium/vip",
          "/premium/top",
          "/premium/color",
          "/premium/points",
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
