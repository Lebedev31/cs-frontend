import styles from "./SocialMedaBlock.module.scss";
import Image from "next/image";

type SocialMediaProps = {
  vk: string;
  twitch: string;
  telegram: string;
};

export default function SocialMediaBlock({
  vk,
  twitch,
  telegram,
}: SocialMediaProps) {
  const socialArr = [vk, twitch, telegram];
  const imgArr = ["/vk2.png", "/twitch.png", "/telegram2.png"];
  const existEmptyString = socialArr.some((item) => item === "");
  return (
    <div className={styles.social}>
      <h3>Социальные сети</h3>
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
                    width={35}
                    height={35}
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
