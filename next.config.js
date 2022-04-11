/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_KEY: process.env.API_KEY,
    DEEPGRAM_API_SECRET: process.env.DEEPGRAM_API_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  images: {
    domains: ["cdn-images-1.listennotes.com"],
  },
  experimental: {
    outputStandalone: true,
  },
};

// const withImages = require("next-images");
// const withTM = require("next-transpile-modules")(["@madzadev/audio-player"]);

// module.exports = withImages(withTM());

module.exports = nextConfig;
