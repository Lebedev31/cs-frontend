"use client";

import { useEffect, useState } from "react";
import styles from "./AdminComment.module.scss";
import Pagination from "@/Components/Pagination/Pagination";
import {
  useLazyGetCommentsQuery,
  useDeleteCommentMutation,
} from "@/redux/apiSlice/adminApi";

export default function AdminComments({ id }: { id: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 4;

  const [fetchComments, { data, isLoading }] = useLazyGetCommentsQuery();
  const [deleteComment] = useDeleteCommentMutation();

  useEffect(() => {
    fetchComments({ id });
  }, [id]);

  const comments = data?.data?.comments ?? [];
  const idCommentsBlock = data?.data?.idCommentsBlock ?? "";

  const indexOfLast = currentPage * commentsPerPage;
  const indexOfFirst = indexOfLast - commentsPerPage;
  const currentComments = comments.slice(indexOfFirst, indexOfLast);

  const handleDelete = async (idComment: string) => {
    if (!confirm("Удалить комментарий?")) return;
    try {
      await deleteComment({ idCommentsBlock, idComment }).unwrap();
      // После удаления перезапрашиваем
      fetchComments({ id });
    } catch (e) {
      console.error("Ошибка удаления комментария", e);
    }
  };

  if (isLoading) {
    return <p className={styles.empty}>Загрузка...</p>;
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Комментарии сервера</h4>

      {comments.length === 0 ? (
        <p className={styles.empty}>Нет комментариев</p>
      ) : (
        <>
          <div className={styles.list}>
            {currentComments.map((comment) => (
              <div key={comment._id} className={styles.item}>
                <div className={styles.meta}>
                  <span className={styles.login}>
                    {(
                      comment.infoUser?.login ??
                      comment.deletedUserName ??
                      "Удалённый пользователь"
                    ).replace(/^(vk_|steam_)/, "")}
                  </span>
                  <span className={styles.date}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={styles.text}>{comment.description}</p>
                <button
                  className={styles.delBtn}
                  onClick={() => handleDelete(comment._id)}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          {comments.length > commentsPerPage && (
            <div className={styles.paginationWrapper}>
              <Pagination
                serversPerPage={commentsPerPage}
                totalServers={comments.length}
                currentPage={currentPage}
                paginate={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
