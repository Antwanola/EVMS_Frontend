'use client'
// components/PageHeader.tsx
import React from "react";
import { Box, Flex, HStack, Text, Heading, Breadcrumb } from "@chakra-ui/react";
import {
  BreadcrumbRoot,
  BreadcrumbLink,
  BreadcrumbCurrentLink,
} from "@chakra-ui/react";
import { MdChevronRight } from "react-icons/md";
import { PageHeaderProps } from "@/app/types/header_types";
import { LiaSlashSolid } from "react-icons/lia";



export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  chargePoint,
}) => {
  console.log(chargePoint)
  return (
    <Box py={1}>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <BreadcrumbLink href="#" _hover={{ color: "red.500" }}>
              Charge Points
            </BreadcrumbLink>
          </Breadcrumb.Item>
           <Breadcrumb.Separator>
            <LiaSlashSolid />
           </Breadcrumb.Separator>
          <Breadcrumb.Item>
            <BreadcrumbCurrentLink color="gray.900" fontWeight="medium">
              {chargePoint?.chargePoint.id} 
            </BreadcrumbCurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <Flex justify="space-between" align="center" mb={1}>
        <Heading size="3xl" textAlign={'center'} fontWeight={'black'}>{title}</Heading>
        <HStack>
          <Text fontSize="sm" color="gray.600">
            {chargePoint?.chargePoint.id}
          </Text>
          <Box
            w={3}
            h={3}
            bg={chargePoint?.isConnected? "green.500": 'gray.500'}
            rounded="full"
            css={{
              animation: "pulse 2s infinite",
            }}
          />
        </HStack>
      </Flex>

      <Text color="gray.500">{subtitle+` ${chargePoint?.chargePoint.id}`}</Text>
    </Box>
  );
};
