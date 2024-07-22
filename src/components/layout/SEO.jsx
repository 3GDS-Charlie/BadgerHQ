import Head from "next/head";
import React from "react";

const SEO = ({ title = "Badger HQ" }) => (
  <Head>
    <meta charSet="utf-8" />
    <title>{title}</title>
    <meta name="robots" content="index, follow" />
    <meta
      name="description"
      content="Badger HQ revolutionizes administrative tasks cutting-edge technology."
    />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Badger HQ - Charlie Admin Matters" />
    <meta
      property="og:description"
      content="Badger HQ revolutionizes administrative tasks cutting-edge technology."
    />
    <meta
      property="og:image"
      content="https://badger-hq.netlify.app/android-chrome-192x192.png"
    />
    <meta property="og:url" content="https://badger-hq.netlify.app/" />
    <meta property="og:site_name" content="Badger HQ" />
  </Head>
);

export default SEO;
