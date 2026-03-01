import React from "react";
import styles from "./ServerPageSkeleton.module.scss";

export default function ServerPageSkeleton() {
  return (
    <div className={styles.server_page}>
      <div className={styles.wrapper}>
        {/* Имитация заголовка страницы */}
        <div
          className={styles.skel_title}
          style={{ width: "30%", height: "32px", margin: "0 auto 25px" }}
        />

        <div className={styles.server_info}>
          {/* --- ЛЕВАЯ КОЛОНКА --- */}
          <div className={styles.left_column}>
            {/* 1. Карта */}
            <div className={styles.map_card}>
              <div className={styles.map_image}>
                <div className={styles.skel_img} />
              </div>
              <div
                className={styles.skel_text}
                style={{ width: "60%", margin: "15px auto 0" }}
              />
            </div>

            {/* 2. Прогресс */}
            <div className={styles.progress_card}>
              <div
                className={styles.skel_text}
                style={{ width: "80%", margin: "0 auto 10px" }}
              />
              <div className={styles.progress_bar}>
                <div className={styles.skel_img} />
              </div>
            </div>

            {/* 5. Теги (у тебя в адаптивке это order_tags) */}
            <div className={`${styles.tags_card} ${styles.order_tags}`}>
              <div
                className={styles.skel_text}
                style={{ width: "50%", margin: "0 auto 10px" }}
              />
              <div className={styles.tags_list}>
                <div
                  className={styles.skel_text}
                  style={{
                    width: "60px",
                    height: "24px",
                    borderRadius: "15px",
                    margin: 0,
                  }}
                />
                <div
                  className={styles.skel_text}
                  style={{
                    width: "80px",
                    height: "24px",
                    borderRadius: "15px",
                    margin: 0,
                  }}
                />
                <div
                  className={styles.skel_text}
                  style={{
                    width: "50px",
                    height: "24px",
                    borderRadius: "15px",
                    margin: 0,
                  }}
                />
              </div>
            </div>

            {/* 6. Рейтинг */}
            <div className={`${styles.rating_card} ${styles.order_rating}`}>
              <div
                className={styles.skel_text}
                style={{ width: "60%", margin: "0 auto 10px" }}
              />
              <div className={styles.skel_circle} />
            </div>
          </div>

          {/* --- ПРАВАЯ ОБЕРТКА --- */}
          <div className={styles.right_wrapper}>
            {/* 3. Центр и Игроки (Grid 50/50) */}
            <div className={styles.center_right_wrapper}>
              <div className={styles.center_column}>
                <div className={styles.server_header}>
                  <div
                    className={styles.skel_text}
                    style={{ width: "40%", margin: "0 auto 20px" }}
                  />
                  <div className={styles.server_info_grid}>
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginBottom: "5px",
                        }}
                      >
                        <div
                          className={styles.skel_text}
                          style={{ width: "30%", margin: 0 }}
                        />
                        <div
                          className={styles.skel_text}
                          style={{ width: "50%", margin: 0 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.right_column}>
                <div className={styles.players_card}>
                  <div
                    className={styles.skel_text}
                    style={{ width: "40%", margin: "0 auto 20px" }}
                  />
                  <div className={styles.table_container}>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={styles.skel_text}
                        style={{ height: "24px", opacity: 0.7 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Описание */}
            <div className={styles.description_card}>
              <div
                className={styles.skel_text}
                style={{ width: "30%", margin: "0 auto 20px" }}
              />
              <div className={styles.skel_text} style={{ width: "100%" }} />
              <div className={styles.skel_text} style={{ width: "95%" }} />
              <div className={styles.skel_text} style={{ width: "90%" }} />
              <div className={styles.skel_text} style={{ width: "60%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
