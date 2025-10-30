import styles from "./TermBlock.module.scss";

type TermProps = {
  price: number[];
};

export default function TermBlock({ price }: TermProps) {
  const terms = ["1 неделя", "2 недели", "Mесяц", "Год"];

  return (
    <div className={styles.term}>
      {terms.map((label, idx) => (
        <div key={label} className={styles.item}>
          <p className={styles.term_date}>{label}</p>
          <div className={styles.price}>{price[idx] + " ₽"}</div>
        </div>
      ))}
    </div>
  );
}
