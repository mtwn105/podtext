/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_KEY: process.env.API_KEY,
    DEEPGRAM_API_SECRET: process.env.DEEPGRAM_API_SECRET,
  },
  images: {
    domains: ["cdn-images-1.listennotes.com"],
  },
};

// const withImages = require("next-images");
// const withTM = require("next-transpile-modules")(["@madzadev/audio-player"]);

// module.exports = withImages(withTM());

module.exports = nextConfig;
