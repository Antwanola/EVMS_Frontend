// components/Sidebar.tsx
import React from "react";
import { Box, VStack, HStack, Text, Button, Avatar } from "@chakra-ui/react";
import {
  MdDashboard,
  MdEvStation,
  MdReceiptLong,
  MdGroup,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { NavItem, IconType } from "@/app/types/header_types";

export const Sidebar: React.FC = () => {
  const navItems: NavItem[] = [
    { label: "Dashboard", icon: MdDashboard, href: "#" },
    { label: "Charge Points", icon: MdEvStation, href: "#", active: true },
    { label: "Transactions", icon: MdReceiptLong, href: "#" },
    { label: "Users", icon: MdGroup, href: "#" },
    { label: "Settings", icon: MdSettings, href: "#" },
  ];

  return (
    <Box
      w="256px"
      bg="white"
      borderRightWidth="1px"
      borderColor="gray.200"
      p={4}
      height="100vh"
    >
      <VStack align="stretch" height="full">
        {/* Logo */}
        <HStack mb={4}>
          <Avatar.Root>
            <Avatar.Fallback name="Segun Adebayo" />
            <Avatar.Image src="https://bit.ly/sage-adebayo" />
          </Avatar.Root>
        </HStack>

        {/* Navigation */}
        <VStack align="stretch" >
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.label}
                variant={item.active ? "solid" : "ghost"}
                colorPalette={item.active ? "red" : "gray"}
                justifyContent="flex-start"
                size="sm"
                fontWeight="medium"
              >
                <IconComponent size={16} style={{ marginRight: "8px" }} />
                {item.label}
              </Button>
            );
          })}
        </VStack>

        {/* Logout */}
        <Box mt="auto">
          <Button
            variant="ghost"
            colorPalette="gray"
            justifyContent="flex-start"
            size="sm"
            fontWeight="medium"
            w="full"
          >
            <MdLogout size={16} style={{ marginRight: "8px" }} />
            Logout
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};