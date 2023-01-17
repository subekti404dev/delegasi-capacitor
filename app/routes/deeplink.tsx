import { Container, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Deeplink() {
  return (
    <Container
      py={10}
      h={"100vh"}
      color={"#c5c7c8"}
      backgroundColor={"#141919"}
    >
      <Link to={"/"}>Back</Link>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <h1>Deeplink Page</h1>
      </Flex>
    </Container>
  );
}
