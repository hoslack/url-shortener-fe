import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";

import { firebase, firestore } from "../firebase/clientApp";
import LoginPage from "../components/LoginPage";
import { Box, VStack } from "@chakra-ui/layout";
import UrlList from "../components/UrlList";

const Home: NextPage = () => {
  const [signedIn, setSignedIn] = useState(false);
  firebase.auth().onAuthStateChanged((user) => {
    return user ? setSignedIn(true) : setSignedIn(false);
  });

  return (
    <VStack pt={20}>
      <Head>
        <title>Url Shortener</title>
        <meta name="description" content="Shorten long urls" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {signedIn && <UrlList />}
        {!signedIn && <LoginPage />}
      </main>
    </VStack>
  );
};

export default Home;
