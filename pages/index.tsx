import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
// @ts-ignore
import { Client } from "podcast-api";
import Genre from "../types/Genre";

const Home: NextPage<{ data: Genre[] }> = ({ data }: { data: Genre[] }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>PodText</title>
        <meta
          name="description"
          content="Explore your favourite podcasts in Text Format"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="">PodText</a>
        </h1>

        <p className={styles.description}>
          Get started by clicking on your favourite genre
        </p>

        <div className={styles.grid}>
          {data.map(({ id, name }) => (
            <a key={id} href={`/genres/${id}`} className={styles.card}>
              <h2>{name}</h2>
            </a>
          ))}
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
export async function getServerSideProps() {
  // If apiKey is null, then we will connect to a mock server
  // that returns fake data for testing purposes.
  const client = Client({ apiKey: null });
  const response = await client.fetchPodcastGenres({
    top_level_only: 1,
  });

  console.log(response.data);

  return { props: { data: response.data.genres } };
}

export default Home;
