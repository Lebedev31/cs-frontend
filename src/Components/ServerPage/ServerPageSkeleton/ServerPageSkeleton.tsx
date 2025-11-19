import styles from "./ServerPageSkeleton.module.scss";

export default function ServerPageSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.server_info}>
        {/* Левая панель (ASIDE) */}
        <div className={styles.aside}>
          {/* Карта */}
          <div className={styles.map_card}>
            <div
              className={styles.text_line}
              style={{ width: "40%", margin: "0 auto" }}
            ></div>
            <div className={styles.map_image_skeleton}></div>
          </div>

          {/* Список игроков */}
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

        {/* Правая панель (MAIN CONTENT) */}
        <div className={styles.main_content}>
          {/* Хедер сервера */}
          <div className={styles.header_card}>
            <div className={styles.title_line}></div> {/* Название сервера */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <div className={styles.text_line} style={{ width: "30px" }}></div>
              <div
                className={styles.text_line}
                style={{ width: "150px" }}
              ></div>
            </div>
            {/* Сетка информации */}
            <div className={styles.info_grid}>
              {[...Array(6)].map((_, i) => (
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

          {/* Владелец */}
          <div className={styles.owner_card}>
            <div className={styles.text_line} style={{ width: "100px" }}></div>
            <div className={styles.text_line} style={{ width: "200px" }}></div>
          </div>

          {/* Рейтинг и Описание */}
          <div className={styles.block_flex}>
            <div className={styles.rating_card}>
              <div className={styles.text_line} style={{ width: "60%" }}></div>
              <div className={styles.rating_circle}></div>
              <div className={styles.text_line} style={{ width: "40%" }}></div>
            </div>

            <div className={styles.desc_card}>
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
    </div>
  );
}
