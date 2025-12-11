import styles from "./ServerPageSkeleton.module.scss";

export default function ServerPageSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.server_info}>
        {/* Левая колонка */}
        <div className={styles.left_column}>
          {/* Карта */}
          <div className={styles.map_card}>
            <div className={styles.map_image_skeleton}></div>
            <div
              className={styles.text_line}
              style={{ width: "40%", margin: "15px auto 0" }}
            ></div>
          </div>

          {/* Прогресс */}
          <div className={styles.progress_card}>
            <div
              className={styles.text_line}
              style={{ width: "80%", marginBottom: "10px" }}
            ></div>
            <div className={styles.progress_bar_skeleton}></div>
          </div>

          {/* Теги */}
          <div className={styles.tags_card}>
            <div
              className={styles.text_line}
              style={{ width: "50%", marginBottom: "10px" }}
            ></div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.tag_skeleton}></div>
              ))}
            </div>
          </div>

          {/* Рейтинг */}
          <div className={styles.rating_card}>
            <div
              className={styles.text_line}
              style={{ width: "60%", marginBottom: "10px" }}
            ></div>
            <div className={styles.rating_circle}></div>
          </div>
        </div>

        {/* Правая обёртка */}
        <div className={styles.right_wrapper}>
          {/* Центральная и правая колонки в одном ряду */}
          <div className={styles.center_right_wrapper}>
            {/* Центральная колонка */}
            <div className={styles.center_column}>
              <div className={styles.header_card}>
                <div className={styles.info_grid}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px" }}>
                      <div
                        className={styles.text_line}
                        style={{ width: "80px" }}
                      ></div>
                      <div
                        className={styles.text_line}
                        style={{ width: "100px" }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Правая колонка - список игроков */}
            <div className={styles.right_column}>
              <div className={styles.players_card}>
                <div
                  className={styles.text_line}
                  style={{ width: "50%", margin: "0 auto 20px" }}
                ></div>
                {/* Имитация таблицы */}
                <div className={styles.table_rows}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={styles.table_row_skeleton}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Блок описания под центральной и правой колонками */}
          <div className={styles.description_card}>
            <div
              className={styles.text_line}
              style={{ width: "50%", marginBottom: "20px" }}
            ></div>
            <div className={styles.text_line} style={{ width: "90%" }}></div>
            <div className={styles.text_line} style={{ width: "80%" }}></div>
            <div className={styles.text_line} style={{ width: "85%" }}></div>
            <div className={styles.text_line} style={{ width: "40%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
