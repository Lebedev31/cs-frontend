import styles from "./SocialMedaBlock.module.scss";
import Image from "next/image";

type SocialMediaProps = {
  vk: string;
  discord: string;
  telegram: string;
};

export default function SocialMediaBlock({
  vk,
  discord,
  telegram,
}: SocialMediaProps) {
  const socialArr = [
    { url: vk, img: "/newVk3.png" },
    { url: discord, img: "/newDiscord.png" },
    { url: telegram, img: "/newTelegram.png" },
  ];

  const hasAnySocial = socialArr.some((item) => item.url !== "");

  return (
    <div className={styles.social}>
      <div className={styles.img_block}>
        {hasAnySocial ? (
          socialArr.map((item, index) =>
            item.url !== "" ? (
              <a // ← вот он
                className={styles.socialButton}
                href={item.url}
                target="_blank"
                key={index}
              >
                <Image width={30} height={30} alt="иконка" src={item.img} />
              </a>
            ) : null,
          )
        ) : (
          <p>Социальные сети не указаны</p>
        )}
      </div>
    </div>
  );
}
