import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/Home.module.css";
// @ts-ignore
import { Client } from "podcast-api";
import Genre from "../../../types/Genre";

const Home: NextPage<{ data: any }> = ({ data }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{data.genre.name}</title>
        <meta
          name="description"
          content={`${data.genre.name} - Best Podcasts`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="">{data.genre.name}</a> Best Podcasts
        </h1>
        <p>These are based on US region</p>

        <div className={styles.grid}>
          {data.podcasts.map(
            ({ id, title, thumbnail, description, publisher }) => (
              <a key={id} href={`/podcasts/${id}`} className={styles.card}>
                <h2>{title}</h2>
                <p>By {publisher}</p>
              </a>
            )
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://twitter.com/mtwn105"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with love by Amit Wani
        </a>
      </footer>
    </div>
  );
};

// Server side props
export async function getServerSideProps(context: any) {
  // Get the genre id from the url
  const genre_id = context.query.id;

  // If apiKey is null, then we will connect to a mock server
  // that returns fake data for testing purposes.
  const client = Client({ apiKey: null });

  const response = await client.fetchBestPodcasts({
    genre_id,
    page: 1,
    region: "us",
    sort: "listen_score",
    safe_mode: 0,
  });

  return {
    props: {
      data: {
        genre: {
          id: response.data.id,
          name: response.data.name,
        },
        podcasts: response.data.podcasts,
      },
    },
  };
}

export default Home;
