import React, { useState } from "react";
import styles from "./ColorBlock.module.scss";

// Предполагается, что эти типы и константы корректно импортированы
import { standardHexColors } from "@/types/service.type";
import { HexColorLiteral } from "@/types/service.type";

type ColorProps = {
  // Добавим initialColor для удобства, но он опционален
  setColor: (color: HexColorLiteral) => void;
  initialColor?: HexColorLiteral;
};

export default function ColorBlock({ setColor, initialColor }: ColorProps) {
  // Добавляем состояние для отслеживания выбранного цвета.
  // Используем initialColor, если он передан.
  const [selectedColor, setSelectedColor] = useState<
    HexColorLiteral | undefined
  >(initialColor);

  const handleColorClick = (color: HexColorLiteral) => {
    // 1. Обновляем локальное состояние для выделения
    setSelectedColor(color);
    // 2. Вызываем внешний обработчик (пропс)
    setColor(color);
  };

  return (
    // Применяем CSS Grid к контейнеру
    <div className={styles.colorGrid}>
      {standardHexColors.map((colorHex, index) => {
        // Проверяем, является ли текущий цвет выбранным
        const isSelected = colorHex === selectedColor;

        return (
          <div
            onClick={() => handleColorClick(colorHex)}
            key={colorHex}
            // Добавляем класс .selected, если элемент выбран
            className={`${styles.colorItem} ${
              isSelected ? styles.selected : ""
            }`}
            // Устанавливаем цвет фона (background-color) напрямую из массива
            style={{ backgroundColor: colorHex }}
          >
            <span className={styles.hexCode}>{`Цвет № ${index + 1}`}</span>
          </div>
        );
      })}
    </div>
  );
}
