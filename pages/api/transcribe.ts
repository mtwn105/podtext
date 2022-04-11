// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { Deepgram } from "@deepgram/sdk";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { audio } = req.query;

  const deepgram = new Deepgram(process.env.DEEPGRAM_API_SECRET as string);

  console.log("Downloading audio...");

  // Download audio
  const audioRes = await fetch((audio as string), {
    method: "GET",
  });

  console.log("Downloaded audio");

  const blob = await audioRes.blob();

  // blob to buffer
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log("Transcribing audio...");

  // Transcribe audio
  const result = await deepgram.transcription.preRecorded(
    {
      buffer,
      mimetype: "audio/mp3",
    },
    {
      utterances: false,
      punctuate: true,
    }
  );

  console.log("Transcribed Audio");

  const transcript = result?.results?.channels[0].alternatives[0].transcript;

  res.status(200).json({ transcript })
}
