import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/Home.module.css";
// @ts-ignore
import { Client } from "podcast-api";
import "react-h5-audio-player/lib/styles.css";
import { useState } from "react";
import {
  Collapse,
  Grid,
  Card,
  Text,
  Link,
  Button,
  Loading,
  Row,
  Col,
} from "@nextui-org/react";
import { useRouter } from "next/router";

const Episode: NextPage<{ data: any }> = ({ data }) => {
  // Transcript state
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const transcribe = async (audio: string) => {
    setLoading(true);

    try {
      const response = await fetch(data.url + "api/transcribe?audio=" + audio);

      const resData = await response.json();

      setTranscript(resData.transcript);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{data.episode.title}</title>
        <meta name="description" content={data.episode.description} />
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
          {data.episode.title}
        </Text>
        <h2>From {data.episode.podcast.title}</h2>
        <h3>By {data.episode.podcast.publisher}</h3>
        <p>
          Published on:{" "}
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(data.episode.pub_date_ms))}
        </p>

        <Collapse css={{ marginBottom: "1rem" }} title="Description">
          <Text
            dangerouslySetInnerHTML={{ __html: data.episode.description }}
          ></Text>
        </Collapse>

        <Card css={{ mw: "fit-content" }}>
          <Card.Body>
            <Card.Image
              src={data.episode.image}
              height={300}
              width={300}
              alt={data.episode.title}
            />
          </Card.Body>
          <Card.Footer>
            <Row justify="center" align="center">
              <Col>
                <Text size={12}>Powered by Deepgram</Text>
              </Col>
              <Col>
                <Row justify="flex-end">
                  <Button
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      transcribe(data.episode.audio);
                    }}
                    flat
                    auto
                    rounded
                    color="secondary"
                  >
                    {loading ? (
                      <Loading type="points" color="currentColor" size="sm" />
                    ) : (
                      <Text
                        css={{ color: "inherit" }}
                        size={12}
                        weight="bold"
                        transform="uppercase"
                      >
                        Transcribe
                      </Text>
                    )}
                  </Button>
                </Row>
              </Col>
            </Row>
          </Card.Footer>
        </Card>

        {!!transcript ? (
          <Card css={{ w: "100%", m: "1rem" }}>
            <Card.Body>
              <Text h3 css={{ marginTop: "1rem", marginBottom: "1rem" }}>
                Transcription
              </Text>
              <Text>{transcript}</Text>
            </Card.Body>
          </Card>
        ) : null}
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
export async function getServerSideProps({
  res,
  query,
}: {
  res: any;
  query: any;
}) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=100, stale-while-revalidate=200"
  );
  // Get the genre id from the url
  const episode_id = query.episode_id;

  // If apiKey is null, then we will connect to a mock server
  // that returns fake data for testing purposes.
  // const client = Client({ apiKey: process.env.API_KEY });
  const client = Client({ apiKey: null });

  const response = await client.fetchEpisodeById({
    id: episode_id,
  });

  console.log(response.data);

  let episode = response.data;
  // Transcribe audio

  return {
    props: {
      data: {
        episode,
        url: process.env.NEXT_PUBLIC_APP_URL,
      },
    },
  };
}

export default Episode;
