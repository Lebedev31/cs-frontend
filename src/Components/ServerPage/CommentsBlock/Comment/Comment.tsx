/* eslint-disable @next/next/no-img-element */
import styles from "./Comment.module.scss";
import { Comment as CommentProps } from "@/types/type";
import { apiImg } from "@/redux/api.url";
import { getFormatData } from "@/lib/common";

interface CommentWrapperProps {
  comment: CommentProps;
}

export default function Comment({ comment }: CommentWrapperProps) {
  const { description, createdAt, infoUser } = comment;
  const formated = getFormatData(createdAt);
  return (
    <div className={styles.comment}>
      <div className={styles.avatar}>
        <img
          src={
            infoUser?.avatarUrl
              ? `${apiImg}${infoUser.avatarUrl}`
              : "/вопрос.png"
          }
          alt="аватарка"
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.login}>{infoUser.login}</div>
          <div className={styles.date}>
            {formated.formattedDate}
            {formated.formattedTime && (
              <span className={styles.time}> {formated.formattedTime}</span>
            )}
          </div>
        </div>

        <p className={styles.text}>{description}</p>
      </div>
    </div>
  );
}
