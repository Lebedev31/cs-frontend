import { ServiceUnionLiteral, BoxShadowUnionType } from "@/types/service.type";
import styles from "./ViewServices.module.scss";
import Image from "next/image";
type ViewServicesProps = {
  typeServices: ServiceUnionLiteral | "";
  colorBoxShadow: BoxShadowUnionType | "";
  setOpen: (open: boolean) => void;
};

function hexToRgb(hex: string) {
  if (!hex) return null;
  const cleaned = hex.replace("#", "");
  const bigint = parseInt(
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

export default function ViewServices({
  typeServices,
  colorBoxShadow,
  setOpen,
}: ViewServicesProps) {
  if (colorBoxShadow === "" || typeServices === "") return null;

  const rgb = hexToRgb(colorBoxShadow);

  const style: React.CSSProperties = {
    border: `2px solid ${colorBoxShadow}`,
    boxShadow: rgb
      ? `0 0 20px rgba(${rgb}, 0.4), 0 0 40px rgba(${rgb}, 0.2), 0 0 60px rgba(${rgb}, 0.1)`
      : undefined,
    // задаём конкретные размеры родителя (важно для next/image fill)
  };

  return (
    <div className={styles.viewServices} onClick={() => setOpen(false)}>
      <div
        className={styles.modal_image}
        style={style}
        onMouseLeave={() => setOpen(false)}
      >
        <Image
          alt="просмотр услуги"
          fill
          src={`/view-services/${typeServices}.png`}
        />
      </div>
    </div>
  );
}
