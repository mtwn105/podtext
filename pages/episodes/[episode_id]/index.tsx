import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/Home.module.css";
// @ts-ignore
import { Client } from "podcast-api";
import "react-h5-audio-player/lib/styles.css";
import { useState } from "react";

const Home: NextPage<{ data: any }> = ({ data }) => {
  // Transcript state
  const [transcript, setTranscript] = useState("");

  return (
    <div className={styles.container}>
      <Head>
        <title>{data.episode.title}</title>
        <meta name="description" content={data.episode.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{data.episode.title}</h1>
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
        <div
          dangerouslySetInnerHTML={{ __html: data.episode.description }}
        ></div>

        <Image
          width={300}
          height={300}
          objectFit="cover"
          src={data.episode.image}
          alt=""
        />

        {/* Button to transcribe the audio */}
        <button
          onClick={(e) => {
            e.preventDefault();
            transcribe(data.episode.audio, setTranscript);
          }}
        >
          Transcribe
        </button>

        <p>{transcript}</p>

        {/* <Player
          trackList={data.trackList}
          includeTags={false}
          includeSearch={false}
          showPlaylist={false}
          autoPlayNextTrack={false}
        /> */}

        {/* <ReactPlayer url={data.episode.audio} /> */}

        {/* <audio></audio>
        <AudioPlayer
          src={data.episode.audio}
          // other props here
          showSkipControls
          autoPlayAfterSrcChange
        /> */}
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
  const episode_id = context.query.episode_id;

  // If apiKey is null, then we will connect to a mock server
  // that returns fake data for testing purposes.
  const client = Client({ apiKey: null });

  const response = await client.fetchEpisodeById({
    id: episode_id,
  });

  console.log(response.data);

  const trackList = [
    {
      url: response.data.audio,
      title: response.data.title,
    },
  ];

  // Transcribe audio

  return {
    props: {
      data: {
        episode: response.data,
        trackList,
      },
    },
  };
}

const transcribe = async (audio: string, setTranscript: any) => {
  const response = await fetch(
    "http://localhost:3000/api/transcribe?audio=" + audio
  );

  const data = await response.json();

  setTranscript(data.transcript);
};

export default Home;
