"use client";
import { useEffect, useState } from "react";
import styles from "./Cookies.module.scss";
import Link from "next/link";

export default function Cookies() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли уже согласие
    const consent = localStorage.getItem("metrikaConsent");
    if (!consent) {
      // Показываем баннер через небольшую задержку
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Если согласие есть - инициализируем метрику
      initYandexMetrika();
    }
  }, []);

  const handleAccept = () => {
    // Сохраняем согласие
    localStorage.setItem("metrikaConsent", "accepted");
    setShowBanner(false);

    // Инициализируем Яндекс.Метрику
    initYandexMetrika();
  };

  const initYandexMetrika = () => {
    // Здесь инициализируйте вашу Яндекс.Метрику
    // Например:
    // (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    //    m[i].l=1*new Date();
    //    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    //    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    //    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    //
    // ym(YOUR_COUNTER_ID, "init", {
    //      clickmap:true,
    //      trackLinks:true,
    //      accurateTrackBounce:true
    // });

    console.log("✅ Яндекс.Метрика инициализирована");
  };

  if (!showBanner) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.banner}>
        <p className={styles.text}>
          Для повышения удобства сайта мы используем cookies. Оставаясь на
          сайте, вы соглашаетесь с{" "}
          <Link href={"/policy"}>политикой их применения.</Link>
        </p>
        <button onClick={handleAccept} className={styles.button}>
          ПРИНЯТЬ
        </button>
      </div>
    </div>
  );
}
