import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";

import { firebase, firestore } from "../firebase/clientApp";
import LoginPage from "../components/LoginPage";
import { Box, Center, VStack } from "@chakra-ui/layout";
import UrlList from "../components/UrlList";
import { Button } from "@chakra-ui/button";

const Home: NextPage = () => {
  const [signedIn, setSignedIn] = useState(false);
  firebase.auth().onAuthStateChanged((user) => {
    return user ? setSignedIn(true) : setSignedIn(false);
  });

  return (
    <VStack p={10} alignItems="flex-end">
      <Head>
        <title>Url Shortener</title>
        <meta name="description" content="Shorten long urls" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2>{firebase.auth().currentUser?.email}</h2>
      {signedIn && (
        <Button
          colorScheme="orange"
          variant="outline"
          onClick={() => firebase.auth().signOut()}
        >
          Logout
        </Button>
      )}
      <Box p={10} w="100%">
        {signedIn && <UrlList />}
        {!signedIn && <LoginPage />}
      </Box>
    </VStack>
  );
};

export default Home;
