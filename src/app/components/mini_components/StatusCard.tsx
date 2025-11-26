'use client'
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import {
  MdPower,
  MdEventAvailable,
  MdSchedule,
} from "react-icons/md";
import { IconType, StatusCardProps } from "@/app/types/header_types"

export const StatusCard: React.FC<StatusCardProps> = ({ icon: Icon, title, value, color }) => {
  console.log("value", value)
  return (
    <Card.Root size={'sm'} >
      <Card.Body >
        <HStack >
          <Box p={3} bg={`${color}.100`} rounded="full" color={`${color}.600`}>
            <Icon size={12} />
          </Box>
          <VStack align="start" pr={20}>
            <Text fontSize="sm" color="gray.500">
              {title}
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={`${color}.600`}>
              {value}
            </Text>
          </VStack >
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

const StatusCards = () => {
  const statusData = [
    {
      icon: MdPower,
      title: "Status",
      value: "Online",
      color: "green"
    },
    {
      icon: MdEventAvailable,
      title: "Availability",
      value: "Available",
      color: "blue"
    },
    {
      icon: MdSchedule,
      title: "Last Heartbeat",
      value: "2024-01-20 10:30 AM",
      color: "gray"
    }
  ];

  return (
    <Box>
      <Heading size="md" mb={4}>
        Real-time Status
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {statusData.map((status, index) => (
          <StatusCard
            key={index}
            icon={status.icon}
            title={status.title}
            value={status.value}
            color={status.color}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default StatusCards;