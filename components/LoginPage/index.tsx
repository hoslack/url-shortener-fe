import React from "react";
import { FcGoogle } from "react-icons/fc";
import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";
import Lottie from "react-lottie";

import * as linkAnimation from "../../statics/url-link-lottie.json";
import { firebase } from "../../firebase/clientApp";

const LoginPage: React.FC = () => {
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: linkAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  console.log(firebase);
  const signIn = () => {
    const google_provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(google_provider)
      .then((res) => console.log())
      .catch((err) => console.log(err));
  };

  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          URL Shortening{" "}
          <Text as={"span"} color={"orange.400"}>
            made easy
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Just add your long URL here and shorten it in seconds, for free.
        </Text>
        <Stack spacing={6} direction={"row"} mt={{ base: 12, sm: 16 }}>
          <Button
            onClick={() => signIn()}
            rounded={"full"}
            px={6}
            colorScheme="orange"
            _hover={{ bg: "orange.100" }}
            variant="outline"
            spacing="6"
            leftIcon={<FcGoogle />}
          >
            Login
          </Button>
          <Button
            rounded={"full"}
            px={6}
            onClick={(e) =>
              window.open(
                "https://www.hostgator.com/blog/reasons-shorten-url-structure/?utm_source=google&utm_medium=genericsearch&gclid=Cj0KCQiAnuGNBhCPARIsACbnLzqWJkdWTLclGzensbeVndrU5U_P4RRqaFuSj7TiJiWEklXaEFrIosUaAvoSEALw_wcB&gclsrc=aw.ds",
                "_blank"
              )
            }
          >
            Learn more
          </Button>
        </Stack>
        <Flex
          w={"min-content"}
          bg="#EC8936"
          borderRadius={20}
          height="14rem"
          mt={{ base: 12, sm: 16 }}
        >
          <Lottie options={lottieOptions} height={200} width={200} />
        </Flex>
      </Stack>
    </Container>
  );
};

export default LoginPage;
