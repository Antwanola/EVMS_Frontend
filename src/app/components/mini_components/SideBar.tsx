'use client';
// components/Sidebar.tsx
import React from "react";
import NextLink from "next/link";
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
import { usePathname } from "next/navigation";

export const Sidebar: React.FC = () => {
const pathname = usePathname();

function isActive(pathname: string, item: NavItem) {
  // Exact match for the item's href
  if (pathname.includes(item.href)) return true;
  
  // Check children routes
  if (item.children) {
    return item.children.some((child) => {
      console.log({child})
      // Replace :id with regex pattern
      const pattern = child.replace(/:id/g, "[^/]+");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    });
  }

  // Check if pathname starts with item.href + "/" (nested routes)
  return pathname.startsWith(item.href + "/");
}

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: MdDashboard, href: "/dashboard" },
    {
      label: "Charge Points",
      icon: MdEvStation,
      href: "/chargepoint",
      // children: ""
      // active: true,
    },
    { label: "Transactions", icon: MdReceiptLong, href: "/transactions" },
    { label: "Users", icon: MdGroup, href: "/users" },
    { label: "Settings", icon: MdSettings, href: "/settings" },
  ];

  return (
    <Box
      w="256px"
      bg="white"
      borderRightWidth="1px"
      borderColor="gray.200"
      p={4}
      height="100vh"
      overflow={'hidden'}
      position={'fixed'}
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
        <VStack align="stretch">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = pathname === item.href || pathname.includes(item.href+ '/')
            return (
              <NextLink key={item.label} href={item.href} passHref>
                <Button
                  variant={active ? "solid" : "ghost"}
                  colorPalette={active ? "red" : "gray"}
                  justifyContent="flex-start"
                  size="sm"
                  fontWeight="medium"
                  w="full"
                >
                  <IconComponent size={16} style={{ marginRight: "8px" }} />
                  {item.label}
                </Button>
              </NextLink>
            );
          })}
        </VStack>

        {/* Logout */}
        <Box mt="auto">
          <NextLink href="/logout" passHref>
            <Button
              variant="ghost"
              justifyContent="flex-start"
              size="sm"
              fontWeight="medium"
              w="full"
            >
              <MdLogout size={16} style={{ marginRight: "8px" }} />
              Logout
            </Button>
          </NextLink>
        </Box>
      </VStack>
    </Box>
  );
};