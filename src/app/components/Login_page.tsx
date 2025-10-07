"use client";
import {
  Field,
  Input,
  Button,
  Box,
  Stack,
  Flex,
  Heading,
  Text,
  InputGroup,
} from "@chakra-ui/react";
import Image from "next/image";
import { CiLock, CiMail } from "react-icons/ci";
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json(); 
      console.log("Login response:", data);

      if (res.ok && data.success) {
        router.push("/dashboard");
        router.refresh(); // Refresh to update auth state
      } else {
       setError(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <Stack
      spacing={4}
      w="full"
      px={{ base: "2px", md: 20 }}
      py={{ base: "20" }}
    >
      <Flex
        w={"full"}
        direction={{ base: "column", md: "row" }}
        alignItems={"center"}
        justifyContent={{ base: "center" }}
      >
        
        <Box
          bgColor={"blue.200"}
          w={{ base: "full", md: "full" }}  // Changed from "1/2"
          // px={{ base: 10, md: 20 }} 
          h={{ base: 200, md: "auto" }}
          borderRadius={'20px'}
          // overflow={'hidden '}
          display={'flex'}
          flexDirection={{ base: 'column', md: 'row' }}
          // alignItems="center"
          justifyContent="space-between"
        >
          <Image
            src="/charge.png"
            alt="alt"
            height={200}
            width={200}
          />

          <Box
            bgColor={"gray.50"}
            w={{ base: "full", md: "50%" }}  // Changed from "full" to match image box
            p={{ base: 10, md: 20 }}
            borderRightRadius={20}
          >
            <Box mb={5}>
              <Heading mb={2} fontSize={{ base: 14, md: 35 }} fontWeight={'800'}>
                Welcome back{" "}
              </Heading>
              <Text color={"gray.500"} fontSize={15}>
                Please enter your details to sign in
              </Text>
            </Box>
          <form onSubmit={handleSubmit}>
            <Field.Root id="email" mb={5}>
              <Field.Label>Email</Field.Label>
              <InputGroup  startElement={<CiMail  color="gray.200"/>}>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </InputGroup>
              <Field.HelperText>We'll never share your email.</Field.HelperText>
            </Field.Root>

            <Field.Root id="password">
              <Field.Label>Password</Field.Label>
              <InputGroup startElement={<CiLock color="gray.200" />}>
              <Input type="password" placeholder="••••••••"  value={password} onChange={(e) => setPassword(e.target.value)}/>
              </InputGroup>
            </Field.Root>

            <Button colorScheme="blue" w="full" mt={10} type="submit">
              Log in
            </Button>
            {error && (
                <Text color="red.500" mt={3}>
                  {error}
                </Text>
              )}
            </form>
          </Box>
        </Box>
      </Flex>
    </Stack>
  );
}
