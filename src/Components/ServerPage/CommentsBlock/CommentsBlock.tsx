"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./CommentsBlock.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { apiImg } from "@/redux/api.url";
import { useEffect, useRef, useState } from "react";
import { handleSubmit } from "@/lib/common";
import {
  CommentsSchema,
  CommentValidationForm,
  Comment,
  CreateComment,
} from "@/types/type";
import {
  useCreateCommentMutation,
  useGetCommentsQuery,
  useLazyGetCommentsPaginationQuery,
} from "@/redux/apiSlice/commentsApi";
import { toast } from "react-toastify";
import { default as CommentItem } from "./Comment/Comment";
const COUNT = 5;

type CommentBlockProps = {
  serverId: string;
};

export default function CommentsBlock({ serverId }: CommentBlockProps) {
  const infoUser = useSelector((state: RootState) => state.main.info);
  const [createComment] = useCreateCommentMutation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [validationError, setValidationError] = useState({
    errorDescription: "",
  });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [maxComments, setMaxComments] = useState<number>(0);
  const { data } = useGetCommentsQuery({ serverId, count: COUNT });
  const [trigger] = useLazyGetCommentsPaginationQuery();
  const hiddenPaginationButton = maxComments > comments.length;

  useEffect(() => {
    if (data && data.data) {
      console.log(data);
      setComments(data.data);
    }

    if (data && data.meta?.count) {
      setMaxComments(data.meta.count);
    }
  }, [data]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const text = textAreaRef.current;
    e.preventDefault();
    if (!text?.value) {
      return;
    }

    const validate: CommentValidationForm = {
      description: text.value,
    };

    const comment: CreateComment = {
      description: text.value,
      serverId,
      createdAt: Date.now(),
    };

    handleSubmit<CommentValidationForm, CreateComment, Comment[]>(
      e,
      (error) => {
        setValidationError({
          errorDescription: error.description || "",
        });
      },
      createComment,
      validate,
      CommentsSchema,
      comment,
      (data) => {
        if (data && data.data) {
          setComments((prev) => (data.data || []).concat(prev));
          text.value = "";
        }

        if (
          data &&
          typeof data.meta === "object" &&
          data.meta !== null &&
          "count" in data.meta
        ) {
          const meta = data.meta as { count: number };
          setMaxComments(meta.count);
        }
      }
    );
  };

  const paginationComments = async () => {
    try {
      const result = await trigger({
        serverId,
        count: COUNT,
        idComment: comments[comments.length - 1]._id,
      }).unwrap();

      if (result.data && result.meta) {
        setComments((prev) => prev.concat(result.data || []));
        setMaxComments(result.meta.count);
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message);
    }
  };

  return (
    <div className={styles.commentsBlock}>
      <h2>Оставить свой отзыв о сервере</h2>
      <div className={styles.comments}>
        <p className={styles.login}>
          {infoUser.login ? infoUser.login.replace(/^(vk_|steam_)/, "") : ""}
        </p>
        <form className={styles.sendComment} onSubmit={onSubmit}>
          <div className={styles.avatarAndTextArea}>
            <div className={styles.avatar}>
              <img
                src={
                  infoUser.avatarUrl
                    ? infoUser.avatarUrl.startsWith("http")
                      ? infoUser.avatarUrl
                      : `${apiImg}${infoUser.avatarUrl}`
                    : "/вопрос.png"
                }
                alt="аватарка"
              />
            </div>
            <textarea
              className={styles.textArea}
              placeholder="Оставьте свой комментарий..."
              ref={textAreaRef}
            ></textarea>
          </div>
          {validationError.errorDescription && (
            <p className={styles.error}>{validationError.errorDescription}</p>
          )}
          <div className={styles.buttonBlock}>
            {infoUser.login ? (
              <button className={styles.commentButton} type="submit">
                Комментировать
              </button>
            ) : (
              <p className={styles.error}>
                Для комментирования авторизируйтесь на сайте
              </p>
            )}
          </div>
        </form>
        <div className={styles.commentsBlockItems}>
          {comments.length === 0 ? (
            <div className={styles.noComments}>
              Отзывы для этого сервера отсутствуют. Станьте первым, кто оставит
              свой!
            </div>
          ) : (
            comments.map((item, index) => {
              return <CommentItem key={index} comment={item} />;
            })
          )}
          <div className={styles.buttonPagination}>
            {hiddenPaginationButton && (
              <button
                className={styles.commentButton}
                onClick={paginationComments}
              >
                Следущие комментарии
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
