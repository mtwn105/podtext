import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../../styles/Home.module.css";
// @ts-ignore
import { Client } from "podcast-api";
import { Grid, Card, Text, Button } from "@nextui-org/react";
import { useRouter } from "next/router";

const Home: NextPage<{ data: any }> = ({ data }) => {
  const router = useRouter();

  const navigate = (e: any, href: string) => {
    e.preventDefault();
    console.log(href);
    router.push(href);
  };

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

      <main>
        <h1 className={styles.title}>
          <a href="">{data.genre.name}</a> Best Podcasts
        </h1>
        <p>These are based on US region</p>

        <Grid.Container gap={2} justify="center">
          {data.podcasts.map(
            ({
              id,
              title,
              publisher,
            }: {
              id: number;
              title: string;
              publisher: string;
            }) => (
              <Grid key={id} md={3}>
                <Card css={{ w: "100%" }}>
                  <Text h3>{title}</Text>
                  <Text>🚀 By {publisher}</Text>
                  <Card.Footer>
                    <Button
                      onClick={(e) => navigate(e, `/podcasts/${id}`)}
                      flat
                      auto
                      rounded
                      color="secondary"
                    >
                      <Text
                        css={{ color: "inherit" }}
                        size={12}
                        weight="bold"
                        transform="uppercase"
                      >
                        View podcasts
                      </Text>
                    </Button>
                  </Card.Footer>
                </Card>
              </Grid>
            )
          )}
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
