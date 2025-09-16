"use client";

import { Flex, Text, Spacer, IconButton } from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react"; // using Lucide icons
import { useEffect, useState } from "react";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    if (typeof document === "undefined") return;
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  };

  return (
    <Flex
      as="nav"
      bg="gray.100"
      _dark={{ bg: "gray.800" }}
      px={6}
      py={4}
      align="center"
      ml="250px"
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Text fontWeight="bold" fontSize="lg" color="black" _dark={{ color: "white" }}>
        EVMS Dashboard
      </Text>
      <Spacer />
      <IconButton
        aria-label="Toggle Theme"
        icon={isDark ? <Sun size={20} color="grey" /> : <Moon size={20} />}
        onClick={toggleTheme}
        variant="ghost"
      />
    </Flex>
  );
}
