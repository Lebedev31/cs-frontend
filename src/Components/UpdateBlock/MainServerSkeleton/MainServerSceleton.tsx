"use client";
import styles from "./MainServerSkeleton.module.scss";

export default function MainPageSkeleton() {
  return (
    <div className={styles.skeleton_wrapper}>
      {/* Левая колонка: Обычные сервера */}
      <div className={styles.left_col}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className={styles.server_item}>
            {/* Инфо (Название + IP) */}
            <div className={styles.server_info}>
              <div className={styles.line_name}></div>
              <div className={styles.line_address}></div>
            </div>

            {/* Статистика (Иконки + Карта) */}
            <div className={styles.server_stats}>
              <div className={styles.circle_icon}></div>
              <div className={styles.line_map}></div>
            </div>

            {/* Картинка справа */}
            <div className={styles.server_img}></div>
          </div>
        ))}
      </div>

      {/* Правая колонка: Премиум блок */}
      <div className={styles.right_col}>
        <div className={styles.premium_container}>
          {/* Заголовок "ТОП СЕРВЕРА" */}
          <div className={styles.premium_title}></div>

          <div className={styles.premium_list}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.premium_item}>
                {/* Название сервера */}
                <div
                  className={styles.line_name}
                  style={{ width: "90%", marginBottom: "10px" }}
                ></div>

                <div className={styles.premium_row}>
                  {/* Инфо внутри премиум карточки */}
                  <div className={styles.premium_info}>
                    <div
                      className={styles.line_map}
                      style={{ width: "80px" }}
                    ></div>
                    <div
                      className={styles.line_address}
                      style={{ width: "120px" }}
                    ></div>
                  </div>

                  {/* Картинка премиум сервера */}
                  <div className={styles.server_img}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
