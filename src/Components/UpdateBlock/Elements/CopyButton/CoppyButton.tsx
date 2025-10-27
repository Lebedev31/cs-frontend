import styles from "./CoppyButton.module.scss";

export default function CoppyButton({
  ip,
  port,
}: {
  ip: string;
  port: string;
}) {
  const copyServerAddress = () => {
    navigator.clipboard.writeText(`${ip}:${port}`);
  };

  return (
    <button className={styles.copyButton} onClick={copyServerAddress}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <rect
          x="9"
          y="9"
          width="13"
          height="13"
          rx="2"
          ry="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}
