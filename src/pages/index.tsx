import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView, HomeView } from "../views";
import { PdfView } from "views/pdf";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Solana Scaffold"
        />
      </Head>
      <PdfView />
    </div>
  );
};

export default Home;
