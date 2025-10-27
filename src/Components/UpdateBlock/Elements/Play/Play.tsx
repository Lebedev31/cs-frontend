import styles from "./Play.module.scss";

export default function Play({
  width,
  height,
}: {
  width: string;
  height: string;
}) {
  return (
    <button className={styles.playButton}>
      <svg
        width={`${width}`}
        height={`${height}`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <polygon points="5,3 19,12 5,21" fill="currentColor" />
      </svg>
    </button>
  );
}
