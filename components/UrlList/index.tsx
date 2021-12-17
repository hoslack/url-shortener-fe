import {
  Button,
  Center,
  Code,
  FormControl,
  IconButton,
  Input,
  ListIcon,
  ListItem,
  OrderedList,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdCheckCircle, MdDoneAll } from "react-icons/md";
import { FaCopy } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { firebase, firestore } from "../../firebase/clientApp";
import axios from "axios";

const UrlList: React.FC = () => {
  const [links, setLinks] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<number[]>([]);
  const [longLink, setLongLink] = useState("");
  const [currentId, setCurrentId] = useState("");

  const toast = useToast();

  const getLinks = async () => {
    const query = firestore
      .collection("links")
      .where("email", "==", firebase.auth().currentUser?.email);
    query.onSnapshot(
      (querySnapshot) => {
        if (querySnapshot.empty) {
          return;
        }
        querySnapshot.forEach((doc) => {
          setCurrentId(doc.id);
          setLinks(doc.data());
        });
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
  };

  useEffect(() => {
    getLinks();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  currentId &&
    firestore
      .collection("links")
      .doc(currentId)
      .get()
      .then((res) => console.log(res.data()));

  const submitLink = () => {
    setLoading(true);
    if (!longLink) {
      toast({
        title: "Error",
        description: "Kindly add a link to shorten",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
    axios
      .post(
        "https://api.tinyurl.com/create",
        {
          url: longLink,
          domain: "tiny.one",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TINY_URL_AUTH}`,
          },
        }
      )
      .then(({ data }) => {
        setLongLink("");
        setLoading(false);
        if (links.email) {
          firestore
            .collection("links")
            .doc(currentId)
            .update({
              urls: [
                ...links.urls,
                { shortUrl: data?.data?.tiny_url, longUrl: data?.data?.url },
              ],
            });
        } else {
          firestore.collection("links").add({
            email: firebase.auth().currentUser?.email,
            urls: [
              { shortUrl: data?.data?.tiny_url, longUrl: data?.data?.url },
            ],
          });
        }
      })
      .catch(() => {
        setLongLink("");
        toast({
          title: "Error",
          description: "There was an error converting the url",
          status: "error",
          duration: 2000,
          position: "top",
        });
      });
  };
  return (
    <Center w="100%" display="flex" flexDir="column">
      <FormControl
        id="longLink"
        isRequired
        w={[300, 400, 400]}
        display="flex"
        flexDir="row"
        alignItems="center"
        mt={10}
        mb={20}
        // justifyContent="center"
      >
        <Input
          placeholder="Enter your link here"
          onChange={(event) => setLongLink(event.target.value)}
          value={longLink}
        />
        <Button
          isLoading={loading}
          ml={10}
          colorScheme="teal"
          onClick={() => submitLink()}
        >
          Submit
        </Button>
      </FormControl>
      <OrderedList spacing={3} height={200} overflow="scroll">
        {links.urls &&
          links.urls.map((url: any, index: number) => {
            const itemCopied = copied.includes(index);
            return (
              <ListItem key={url.longUrl}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  w="fit-content"
                >
                  <Code
                    display="flex"
                    alignItems="center"
                    w={[200, 300, 400]}
                    overflow="scroll"
                  >
                    {url.longUrl}
                  </Code>
                  <CopyToClipboard
                    text={url.shortUrl}
                    onCopy={() => setCopied([...copied, index])}
                  >
                    <Code
                      display="flex"
                      alignItems="center"
                      colorScheme="red"
                      w={[150, 200, 300]}
                      overflow="scroll"
                    >
                      {url.shortUrl}
                    </Code>
                  </CopyToClipboard>
                  <Tooltip
                    label="Click on the short link to copy"
                    aria-label="A tooltip"
                  >
                    <IconButton
                      onClick={() => {}}
                      aria-label="copy"
                      borderColor="orange.400"
                      rightIcon={
                        itemCopied ? (
                          <MdDoneAll color="green.500" />
                        ) : (
                          <FaCopy />
                        )
                      }
                    ></IconButton>
                  </Tooltip>
                </Stack>
              </ListItem>
            );
          })}
      </OrderedList>
    </Center>
  );
};

export default UrlList;
