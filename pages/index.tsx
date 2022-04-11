import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
// @ts-ignore
import { Client } from "podcast-api";
import Genre from "../types/Genre";
import { Grid, Card, Text } from "@nextui-org/react";
import { useRouter } from "next/router";

const Home: NextPage<{ data: Genre[] }> = ({ data }: { data: Genre[] }) => {
  const router = useRouter();

  const navigate = (e: any, href: string) => {
    e.preventDefault();
    console.log(href);
    router.push(href);
  };

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
          Now Read your favourite podcasts!
          <br />
          Get started by clicking on your favourite genre
        </p>

        <Grid.Container gap={2} justify="center">
          {data.map(({ id, name }) => (
            <Grid key={id} md={3}>
              <Card
                onClick={(e) => navigate(e, `/genres/${id}`)}
                hoverable
                clickable
                css={{ width: "100%" }}
              >
                <Text h3>{name}</Text>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
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
export async function getServerSideProps({ res }: { res: any }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=100, stale-while-revalidate=200"
  );
  // If apiKey is null, then we will connect to a mock server
  // that returns fake data for testing purposes.
  const client = Client({ apiKey: process.env.API_KEY });
  const response = await client.fetchPodcastGenres({
    top_level_only: 1,
  });

  console.log(response.data);

  return { props: { data: response.data.genres } };
}

export default Home;
