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
  const socialArr = [vk, discord, telegram];
  const imgArr = ["/newVk3.png", "/newDiscord.png", "/newTelegram.png"];
  const existEmptyString = socialArr.some((item) => item === "");
  return (
    <div className={styles.social}>
      <div className={styles.img_block}>
        {!existEmptyString ? (
          socialArr.map((item, index) => {
            if (item === "") {
              return null;
            } else {
              return (
                <a
                  className={styles.socialButton}
                  href={item}
                  target="_blank"
                  key={index}
                >
                  <Image
                    width={30}
                    height={30}
                    alt="иконка"
                    src={`${imgArr[index]}`}
                  />
                </a>
              );
            }
          })
        ) : (
          <p>Социальные сети не указаны</p>
        )}
      </div>
    </div>
  );
}
