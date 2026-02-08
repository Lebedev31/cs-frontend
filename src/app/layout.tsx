import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/global.scss";
import ReduxProvider from "@/Components/ReduxProvider/ReduxProvider";
import ToastProvider from "@/Components/ToastContainer/ToastProvider";
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import Script from "next/script";
import Cookies from "@/Components/Cookies/Cookies";

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
    process.env.NEXT_PUBLIC_SITE_URL || "https://csrating.com",
  ),
  title: {
    default: "GameState-Monitor — Игровые сервера",
    template: "%s | GameState-Monitor — Игровые сервера",
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
  authors: [{ name: "gamestate-monitor.ru" }],
  creator: "gamestate-monitor.ru",
  publisher: "gamestate-monitor.ru",

  // Open Graph (для соцсетей)
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "gamestate-monitor.ru",
    title: "GameState-Monitor — Игровые сервера",
    description:
      "МонGameState-Monitor — Игровые сервераи мониторинг и рейтинг игровых серверов CS 1.6, CS:GO и CS2",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "gamestate-monitor.ru Logo",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Мониторинг серверов Counter-Strike",
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

  // Верификация
  verification: {
    google: "ваш-google-verification-код",
    yandex: "106721262", // Ваш ID Метрики часто совпадает с кодом верификации, если вы выбрали этот способ
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
              name: "gamestate-monitor.ru",
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
        {/* Яндекс.Метрика */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(106721262, "init", {
              ssr: true,
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              ecommerce:"dataLayer"
            });
          `}
        </Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/106721262"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        <ReduxProvider>
          <Header />
          <main className="container" id="main-content">
            {children}
          </main>
          <Footer />
          <Cookies />
        </ReduxProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
