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
        <title>{data.podcast.title}</title>
        <meta name="description" content={data.podcast.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{data.podcast.title}</h1>
        <h2>By {data.podcast.publisher}</h2>
        <div
          dangerouslySetInnerHTML={{ __html: data.podcast.description }}
        ></div>

        <Image
          width={300}
          height={300}
          objectFit="cover"
          src={data.podcast.image}
          alt=""
        />

        <div className={styles.grid}>
          {data.podcast.episodes.map(
            ({ id, title, description, pub_date_ms, image }) => (
              <a key={id} href={`/episodes/${id}`} className={styles.card}>
                <Image
                  width={300}
                  height={300}
                  objectFit="cover"
                  src={data.podcast.image}
                  alt=""
                />
                <h2>{title}</h2>
                <p>
                  Published on:{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(pub_date_ms))}
                </p>
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
  const podcast_id = context.query.podcast_id;

  // If apiKey is null, then we will connect to a mock server
  // that returns fake data for testing purposes.
  const client = Client({ apiKey: null });

  const response = await client.fetchPodcastById({
    id: podcast_id,
  });

  console.log(response.data);

  return {
    props: {
      data: {
        podcast: response.data,
      },
    },
  };
}

export default Home;
