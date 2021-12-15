import {
  Button,
  Center,
  Code,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  List,
  ListItem,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdDoneAll } from "react-icons/md";
import { FaCopy } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { firebase, firestore } from "../../firebase/clientApp";
import axios from "axios";

type LinksType = {
  email: string;
  urls: [{ longUrl: string; shortUrl: string }];
};

const UrlList: React.FC = () => {
  const [links, setLinks] = useState<LinksType | any>({
    email: "",
    urls: [{ longUrl: "", shortUrl: "" }],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<number[]>([]);
  const [longLink, setLongLink] = useState("");

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
          setLinks(doc.data());
        });
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
    // set it to state
  };

  useEffect(() => {
    // get the todos
    getLinks();
    // reset loading
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

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
      .then((response) => {
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Center>
      <main>
        <Flex mb={30} justifyContent="center">
          <FormControl id="longLink" isRequired maxW={"70%"}>
            <FormLabel>Link to be shortened</FormLabel>
            <Input
              placeholder="Enter your link here"
              onChange={(event) => setLongLink(event.target.value)}
            />
            <Button
              isLoading={loading}
              mt={4}
              colorScheme="teal"
              onClick={() => submitLink()}
            >
              Submit
            </Button>
          </FormControl>
        </Flex>
        <List spacing={3} height={200} overflow="scroll">
          {links.urls.map((url: any, index: number) => {
            const itemCopied = copied.includes(index);
            return (
              <ListItem key={url.longUrl} display="flex">
                <Stack direction="row">
                  <Code
                    display="flex"
                    alignItems="center"
                    children={url.longUrl}
                  />
                  <CopyToClipboard
                    text={url.shortUrl}
                    onCopy={() => setCopied([...copied, index])}
                  >
                    <Code
                      display="flex"
                      alignItems="center"
                      colorScheme="red"
                      children={url.shortUrl}
                    />
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
        </List>
      </main>
    </Center>
  );
};

export default UrlList;
