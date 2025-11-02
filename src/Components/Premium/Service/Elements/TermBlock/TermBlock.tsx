import styles from "./TermBlock.module.scss";
import { PlanUnionLiteral } from "@/types/service.type";

type TermProps = {
  price: number[];
  selectedPlan?: PlanUnionLiteral;
  onSelectPlan?: (plan: PlanUnionLiteral, price: number) => void;
};

export default function TermBlock({
  price,
  selectedPlan,
  onSelectPlan,
}: TermProps) {
  const terms: { label: string; value: PlanUnionLiteral }[] = [
    { label: "1 неделя", value: "oneWeek" },
    { label: "2 недели", value: "twoWeeks" },
    { label: "Месяц", value: "month" },
    { label: "Год", value: "year" },
  ];

  return (
    <div className={styles.term}>
      {terms.map(({ label, value }, idx) => (
        <div
          key={value}
          className={`${styles.item} ${
            selectedPlan === value ? styles.active : ""
          }`}
          onClick={() => onSelectPlan?.(value, price[idx])}
          style={{ cursor: onSelectPlan ? "pointer" : "default" }}
        >
          <p className={styles.term_date}>{label}</p>
          <div className={styles.price}>{price[idx] + " ₽"}</div>
        </div>
      ))}
    </div>
  );
}
