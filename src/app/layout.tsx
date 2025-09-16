// src/app/layout.tsx
"use client";

import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import theme from "@/theme";
import { Sidebar } from "./components/mini_components/SideBar";
import { usePathname } from "next/navigation";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isLogin = pathName === "/login" || pathName === "/";

  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <ChakraProvider value={theme}>
          {isLogin ? (
            children
          ) : (
            <Flex>
              <Box minH="100%" w="250px">
                <Sidebar />
              </Box>
              <Box flex="1">
                {children}
              </Box>
            </Flex>
          )}
        </ChakraProvider>
      </body>
    </html>
  );
}
