// CustomSelect.tsx
import { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.scss";

interface CustomSelectProps {
  placeholder: string;
  options: string[];
  selectRef: React.RefObject<HTMLSelectElement>;
}

export default function CustomSelect({
  placeholder,
  options,
  selectRef,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    if (selectRef.current) selectRef.current.value = value;
    setIsOpen(false);
  };

  return (
    <div className={styles.customSelect} ref={dropdownRef}>
      <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
        {selected || placeholder}
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option}
              className={styles.option}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      <select ref={selectRef} style={{ display: "none" }}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
