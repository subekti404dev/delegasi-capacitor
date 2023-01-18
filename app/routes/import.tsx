import { Container, Flex, Image } from "@chakra-ui/react";
import { Link, useSearchParams } from "react-router-dom";

export default function Deeplink() {
  const [searchParams] = useSearchParams();

  const data = JSON.parse(searchParams.get("data") || "[]") || [];

  return (
    <Container
      py={10}
      h={"100vh"}
      color={"#c5c7c8"}
      backgroundColor={"#141919"}
    >
      <Link to={"/"}>Back</Link>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <h1>import Page</h1>
      </Flex>
      {data.map((d: string, id: number) => (
        <Image key={`key_${id}`} src={d} />
      ))}
    </Container>
  );
}
