import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import { app, db } from "../firebase/clientApp";
import {
  collection,
  QueryDocumentSnapshot,
  DocumentData,
  query,
  where,
  limit,
  getDocs,
} from "@firebase/firestore";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const usersCollection = collection(db, "userData");

  const [users, setUsers] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(users);

  // console.log({ app, db });

  const getUsers = async () => {
    // construct a query to get users
    const usersQuery = query(usersCollection, limit(1000));
    // get the users data
    const querySnapshot = await getDocs(usersQuery);

    // map through users adding them to an array
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    console.log({ result });

    querySnapshot.forEach((snapshot) => {
      result.push(snapshot);
    });
    // set it to state
    setUsers(result);
  };

  useEffect(() => {
    // get the todos
    getUsers();
    // reset loading
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Url Shortener</title>
        <meta name="description" content="Shorten long urls" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>main</h1>
      </main>
    </div>
  );
};

export default Home;
