import { BiSearch } from "react-icons/bi";
import styles from "./home.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";

//https://coinlib.io/api/v1/coinlist?key=f3607eb9f8dbe2a2&pref=BTC&page=1&order=volume_desc

export interface CoinsProps {
  // Construindo uma interface para receber os item da api que iremos utilizar.
  rank: string;
  marketCapUsd: string;
  name: string;
  priceUsd: string;
  symbol: string;
  volumeUsd24Hr: string;
  maxSupply: string;
  explorer: string;
  supply: string;
  changePercent24Hr: string;
  vwap24Ht: string;
  id: string;
  formatedPrice: string;
  formatedMarket: string;
  formatedVolume: string;
}

interface DataProps {
  // Criando interface para receber a interface acima ficando melhor o gerenciamento.
  data: CoinsProps[];
}

export function Home() {
  const [coins, setCoins] = useState<CoinsProps[]>([]); // State que receber os atributos da interface CoinsProps
  const [input, setInput] = useState("");
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [offset]);

  async function getData() {
    await fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`)
      .then((response) => response.json())
      .then((data: DataProps) => {
        const coinsData = data.data;

        let price = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        const priceCompact = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          notation: "compact",
        });

        const formartResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
          };
          return formated;
        });
        // console.log(formartResult);

        const listCoins = [...coins, ...formartResult];
        setCoins(listCoins);
      });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input === "") return;
    navigate(`/detail/${input}`);
  }

  function handleGetMore() {
    if (offset === 0) {
      setOffset(10);
      return;
    }
    setOffset(offset + 10);
  }

  return (
    <>
      <main className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="cripto"
            id="cripto"
            placeholder="Digite o nome da moeda: ex: Bitcoin..."
            value={input}
            onChange={(e) => setInput(e.target.value.toLowerCase())}
          />
          <button type="submit">
            <BiSearch size={30} color="#fff" />
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th scope="col">Moeda</th>
              <th scope="col">Valor Mercado</th>
              <th scope="col">Preço</th>
              <th scope="col">Volume</th>
              <th scope="col">Mudança 24h</th>
            </tr>
          </thead>
          <tbody id="tbody">
            {coins.map(
              (
                coin //percorrendo a state coins com um map
              ) => (
                <tr key={coin.name} className={styles.tr}>
                  <td className={styles.tdLabel} data-label="Moeda">
                    <div className={styles.name}>
                      <img
                        className={styles.logo}
                        src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase().trim()}@2x.png`}
                        alt="LOGO MOEDA"
                      />
                      <Link className={styles.link} to={`/detail/${coin.id}`}>
                        <span>{coin.name}</span> | {coin.symbol}
                      </Link>
                    </div>
                  </td>
                  <td className={styles.tdLabel} data-label="Mercado">
                    {coin.formatedMarket}
                  </td>
                  <td className={styles.tdLabel} data-label="Preco">
                    {coin.formatedPrice}
                  </td>
                  <td className={styles.tdLabel} data-label="Volume">
                    <span>{coin.formatedVolume}</span>
                  </td>
                  <td
                    className={
                      Number(coin?.changePercent24Hr) >= 0
                        ? styles.tdProfit
                        : styles.tdLoss
                    }
                    data-label="Mudança 24h"
                  >
                    {Number(coin.changePercent24Hr).toFixed(2)}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        <button className={styles.buttonMore} onClick={handleGetMore}>
          Carregar mais
        </button>
      </main>
    </>
  );
}
