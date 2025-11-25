import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/global.scss";
import ReduxProvider from "@/Components/ReduxProvider/ReduxProvider";
import ToastProvider from "@/Components/ToastContainer/ToastProvider";
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO: Базовые метаданные
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://csrating.com"
  ),
  title: {
    default: "GameState-Monitor",
    template: "%s | CS Rating",
  },
  description:
    "Лучший мониторинг игровых серверов Counter-Strike 1.6, CS:GO и CS2. Рейтинг серверов, статистика игроков, поиск по картам и режимам. Добавьте свой сервер бесплатно!",
  keywords: [
    "CS 1.6",
    "CS:GO",
    "CS2",
    "Counter-Strike",
    "серверы",
    "мониторинг серверов",
    "рейтинг серверов",
    "игровые сервера",
  ],
  authors: [{ name: "CS Rating" }],
  creator: "CS Rating",
  publisher: "CS Rating",

  // Open Graph (для соцсетей)
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "CS Rating",
    title: "CS Rating - Мониторинг серверов Counter-Strike",
    description: "Мониторинг и рейтинг игровых серверов CS 1.6, CS:GO и CS2",
    images: [
      {
        url: "/og-image.png", // ДОБАВЬТЕ это изображение в public/
        width: 1200,
        height: 630,
        alt: "CS Rating Logo",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "CS Rating - Мониторинг серверов Counter-Strike",
    description: "Мониторинг и рейтинг игровых серверов CS 1.6, CS:GO и CS2",
    images: ["/og-image.png"],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Иконки
  icons: {
    icon: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },

  // Верификация (ДОБАВЬТЕ свои ключи)
  verification: {
    google: "ваш-google-verification-код", // Получите в Google Search Console
    yandex: "ваш-yandex-verification-код", // Получите в Яндекс.Вебмастер
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* Дополнительные meta-теги */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Script
          src="https://yandex.ru/ads/system/context.js"
          strategy="afterInteractive"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="format-detection" content="telephone=no" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />

        {/* Structured Data - Организация */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CS Rating",
              description: "Мониторинг серверов Counter-Strike",
              url: process.env.NEXT_PUBLIC_SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${process.env.NEXT_PUBLIC_SITE_URL}/?search={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider>
          <Header />
          <main className="container" id="main-content">
            {children}
          </main>
          <Footer />
        </ReduxProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
