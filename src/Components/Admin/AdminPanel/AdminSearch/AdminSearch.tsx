"use client";

import styles from "./AdminSearch.module.scss";

type Props = {
  query: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function AdminSearch({ query, onChange, placeholder }: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>
      <input
        className={styles.input}
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Поиск..."}
      />
      {query && (
        <button className={styles.clear} onClick={() => onChange("")}>
          ×
        </button>
      )}
    </div>
  );
}
