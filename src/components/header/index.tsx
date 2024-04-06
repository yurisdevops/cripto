import styles from "./header.module.css";
import logoCripto from "../../assets/logo.svg";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <>
      <header className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={logoCripto} alt="Logo Cripto" />
          </Link>
        </div>
      </header>
    </>
  );
}
