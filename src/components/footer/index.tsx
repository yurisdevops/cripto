import styles from "./footer.module.css";

export function Footer() {
  return (
    <>
      <footer className={styles.container}>
        <div className={styles.footer}>
          <p className={styles.name}>
            Direito de desenvolvimento a <strong>@Yuri Souza</strong>
          </p>
        </div>
      </footer>
    </>
  );
}
