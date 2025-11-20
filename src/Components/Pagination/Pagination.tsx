/* eslint-disable prefer-const */
import styles from "./Pagination.module.scss";

type PaginationProps = {
  serversPerPage: number;
  totalServers: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
};

// Вспомогательная функция для создания диапазона чисел (например, [3, 4, 5])
const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export default function Pagination({
  serversPerPage,
  totalServers,
  currentPage,
  paginate,
}: PaginationProps) {
  const totalPages = Math.ceil(totalServers / serversPerPage);

  // --- ЛОГИКА ОТОБРАЖЕНИЯ СТРАНИЦ ---

  const getPaginationRange = (): (number | string)[] => {
    // Количество страниц, всегда видимых по краям (1 ... 4 5 6 ... 10)
    const totalNumbers = 5; // 1 + ... + current + ... + last
    const totalBlocks = totalNumbers + 2; // + 2 для многоточий

    // 1. Если страниц мало, показываем все
    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

    // Определяем, нужно ли показывать многоточие слева или справа
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // 2. Случай, когда многоточие нужно только справа
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, "...", totalPages];
    }

    // 3. Случай, когда многоточие нужно только слева
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, "...", ...rightRange];
    }

    // 4. Случай, когда многоточие нужно с обеих сторон
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    // По умолчанию возвращаем пустой массив, хотя этого не должно случиться
    return [];
  };

  const pageNumbers = getPaginationRange();

  // Не отображаем пагинацию, если страниц меньше двух
  if (totalPages < 2) {
    return null;
  }

  return (
    <nav>
      <ul className={styles.pagination}>
        {/* Кнопка "Назад" */}
        <li
          className={`${styles.pageItem} ${
            currentPage === 1 ? styles.disabled : ""
          }`}
        >
          <a
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            className={styles.pageLink}
          >
            &laquo;
          </a>
        </li>

        {/* Номера страниц и многоточия */}
        {pageNumbers.map((page, index) => {
          // Если это многоточие, отображаем его как текст
          if (typeof page === "string") {
            return (
              <li
                key={`${page}-${index}`}
                className={`${styles.pageItem} ${styles.dots}`}
              >
                &#8230;
              </li>
            );
          }

          // Иначе отображаем как номер страницы
          return (
            <li
              key={page}
              className={`${styles.pageItem} ${
                currentPage === page ? styles.active : ""
              }`}
            >
              <a onClick={() => paginate(page)} className={styles.pageLink}>
                {page}
              </a>
            </li>
          );
        })}

        {/* Кнопка "Вперед" */}
        <li
          className={`${styles.pageItem} ${
            currentPage === totalPages ? styles.disabled : ""
          }`}
        >
          <a
            onClick={() =>
              currentPage < totalPages && paginate(currentPage + 1)
            }
            href="#"
            className={styles.pageLink}
          >
            &raquo;
          </a>
        </li>
      </ul>
    </nav>
  );
}
