import styles from "./ColorBlock.module.scss";
import { standardHexColors } from "@/types/service.type";
import { HexColorLiteral } from "@/types/service.type";

type ColorProps = {
  setColor: (color: HexColorLiteral) => void;
};

export default function ColorBlock({ setColor }: ColorProps) {
  return (
    // Применяем CSS Grid к контейнеру
    <div className={styles.colorGrid}>
      {standardHexColors.map((colorHex, index) => (
        <div
          onClick={() => setColor(colorHex)}
          key={colorHex}
          className={styles.colorItem}
          // Устанавливаем цвет фона (background-color) напрямую из массива
          style={{ backgroundColor: colorHex }}
        >
          <span className={styles.hexCode}>{`Цвет № ${index + 1}`}</span>
        </div>
      ))}
    </div>
  );
}
