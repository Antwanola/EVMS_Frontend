'use client'
import { EmailIcon } from "@chakra-ui/icons";
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
  InputElement,
} from "@chakra-ui/react";
import Image from "next/image";
import { AiOutlineMail } from "react-icons/ai";
import { CiLock, CiMail } from "react-icons/ci";
import { MdEmail } from "react-icons/md";

export default function LoginForm() {
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
            <Field.Root id="email" mb={5}>
              <Field.Label>Email</Field.Label>
              <InputGroup  startElement={<CiMail  color="gray.200"/>}>
              <Input type="email" placeholder="you@example.com" />
              </InputGroup>
              <Field.HelperText>We'll never share your email.</Field.HelperText>
            </Field.Root>

            <Field.Root id="password">
              <Field.Label>Password</Field.Label>
              <InputGroup startElement={<CiLock color="gray.200" />}>
              <Input type="password" placeholder="••••••••" />
              </InputGroup>
            </Field.Root>

            <Button colorScheme="blue" w="full" mt={10}>
              Log in
            </Button>
          </Box>
        </Box>

      </Flex>
    </Stack>
  );
}