"use client";

import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import theme from "@/theme";
import { Sidebar } from "./mini_components/SideBar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body>
        <ChakraProvider value={ theme }>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
