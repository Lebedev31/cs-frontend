import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/settingAccount",
          "/myServers",
          "/payment",
          "/finHistory",
          "/settingServer/*",
          "/api/*",
          "/changePasswordPage",
          "/forgotPassword",
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
