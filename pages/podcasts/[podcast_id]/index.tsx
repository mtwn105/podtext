import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/Home.module.css";
// @ts-ignore
import { Client } from "podcast-api";
import Genre from "../../../types/Genre";
import { Grid, Card, Text, Link, Button } from "@nextui-org/react";
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
        <title>{data.podcast.title}</title>
        <meta name="description" content={data.podcast.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Text
          h1
          css={{
            textGradient: "45deg, $blue500 -20%, $pink500 50%",
          }}
          className={styles.title}
        >
          {data.podcast.title}
        </Text>
        <Text h2>By {data.podcast.publisher}</Text>
        <Text
          css={{
            m: "1rem",
          }}
          dangerouslySetInnerHTML={{ __html: data.podcast.description }}
        ></Text>

        <Image
          width={300}
          height={300}
          objectFit="cover"
          src={data.podcast.image}
          alt=""
        />

        <Text
          h2
          css={{
            textGradient: "45deg, $blue500 -20%, $pink500 50%",
            m: "1rem",
          }}
          weight="bold"
        >
          Episodes
        </Text>

        <Grid.Container gap={2} justify="center">
          {data.podcast.episodes.map(
            ({
              id,
              title,
              pub_date_ms,
              image,
            }: {
              id: number;
              title: string;
              pub_date_ms: number;
              image: string;
            }) => (
              <Grid key={id} md={3}>
                <Card css={{ w: "100%" }}>
                  <Card.Body>
                    <Card.Image
                      src={image}
                      height={300}
                      width="100%"
                      alt={title}
                    />

                    <Text h3>{title}</Text>
                    <Text>
                      Published on:{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(pub_date_ms))}
                    </Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      onClick={(e) => navigate(e, `/episodes/${id}`)}
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
                        View episode
                      </Text>
                    </Button>
                    {/* <Link
                      color="primary"
                      target="_blank"
                      href={`/podcasts/${id}`}
                    >
                      View podcasts
                    </Link> */}
                  </Card.Footer>
                </Card>
              </Grid>
              // <a key={id} href={`/episodes/${id}`} className={styles.card}>
              //   <Image
              //     width={300}
              //     height={300}
              //     objectFit="cover"
              //     src={data.podcast.image}
              //     alt=""
              //   />
              //   <h2>{title}</h2>
              //   <p>
              //     Published on:{" "}
              //     {new Intl.DateTimeFormat("en-US", {
              //       year: "numeric",
              //       month: "2-digit",
              //       day: "2-digit",
              //       hour: "2-digit",
              //       minute: "2-digit",
              //     }).format(new Date(pub_date_ms))}
              //   </p>
              // </a>
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
  const podcast_id = context.query.podcast_id;

  // If apiKey is null, then we will connect to a mock server
  // that returns fake data for testing purposes.
  const client = Client({ apiKey: process.env.API_KEY });

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
