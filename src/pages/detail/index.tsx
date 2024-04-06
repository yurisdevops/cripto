import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CoinsProps } from "./../home";
import styles from "./detail.module.css";
interface ResponseData {
  data: CoinsProps;
}

interface ErroData {
  error: string;
}

type DataProps = ResponseData | ErroData;

export function Detail() {
  const { cripto } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinsProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
          .then((response) => response.json())
          .then((data: DataProps) => {
            if ("error" in data) {
              navigate("/");
              return;
            }

            let price = Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            });
            const priceCompact = Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              notation: "compact",
            });

            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(
                Number(data.data.marketCapUsd)
              ),
              formatedVolume: priceCompact.format(
                Number(data.data.volumeUsd24Hr)
              ),
            };
            setCoin(resultData);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }
    getCoin();
  }, [cripto]);

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.center}>Carregando detalhes da moeda...</h1>
      </div>
    );
  }
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.center}>{coin?.name}</h1>
        <h1 className={styles.center}>{coin?.symbol}</h1>

        <section className={styles.content}>
          <img
            className={styles.logo}
            src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
            alt="LOGO DA MOEDA"
          />
          <h1>
            {coin?.name} | {coin?.symbol}{" "}
          </h1>
          <p>
            <strong>Preço:</strong> {coin?.formatedPrice}
          </p>
          <a>
            <strong>Mercado</strong> {coin?.formatedMarket}{" "}
          </a>
          <a>
            <strong>Volume:</strong> {coin?.formatedVolume}{" "}
          </a>
          <a>
            <strong>Mudança 24:</strong>{" "}
            <span
              className={
                Number(coin?.changePercent24Hr) > 0
                  ? styles.profit
                  : styles.loss
              }
            >
              {" "}
              {Number(coin?.changePercent24Hr).toFixed(2)}{" "}
            </span>
          </a>
        </section>
      </div>
    </>
  );
}
