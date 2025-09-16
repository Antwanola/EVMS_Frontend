"use client";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Home, Settings, BarChart, Users } from "lucide-react"; // add any icons you need
import Link from "next/link";

export function Sidebar() {
  return (
    <Box
      as="aside"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      w="250px"
      h="100vh"
      p={4}
      position="fixed"
      left={0}
      top={0}
      shadow="md"
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        mb={8}
        color="black"
        _dark={{ color: "white" }}
      >
        EVMS
      </Text>

      <VStack align="stretch">
        <NavItem href="/" icon={<Home size={20} />}>
          Dashboard
        </NavItem>
        <NavItem href="/reports" icon={<BarChart size={20} />}>
          Reports
        </NavItem>
        <NavItem href="/users" icon={<Users size={20} />}>
          Users
        </NavItem>
        <NavItem href="/settings" icon={<Settings size={20} />}>
          Settings
        </NavItem>
      </VStack>
    </Box>
  );
}

function NavItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Flex
        align="center"
        gap={3}
        px={3}
        py={2}
        rounded="md"
        _hover={{ bg: "gray.200", _dark: { bg: "gray.700" } }}
      >
        {icon}
        <Text color="black" _dark={{ color: "white" }}>
          {children}
        </Text>
      </Flex>
    </Link>
  );
}
