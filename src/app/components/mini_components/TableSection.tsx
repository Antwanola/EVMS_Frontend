
// components/TabsSection.jsx
import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import { StatusCard } from "./StatusCard";
import { Mail } from "lucide-react";

export const TabsSection = () => {
  return (
    <Box borderBottomWidth="1px" borderColor="gray.200">
      <Tabs.Root defaultValue="overview" variant="line" colorPalette="red">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="configuration">Configuration</Tabs.Trigger>
          <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <Heading fontWeight={'black'} textAlign={'left'}>Real-time Status</Heading>
          <Flex gap={20} fontSize="sm" color="gray.600" mt={4}>
            <StatusCard value="Online" icon={Mail} title={'Status'} color={'green'} />
            <StatusCard value="Charging" icon={Mail} title={'Status'} color={'orange'} />
            <StatusCard value="2024-01-20 10:30 AM" icon={Mail} title={'Last Heartbeat'} color={'gray.300'} />
            {/* <StatusCard value="45" icon={Mail} title={'hsjhv'} color={'gray.300'} /> */}
          </Flex>
        </Tabs.Content>
        
        <Tabs.Content value="configuration">
          <Box fontSize="sm" color="gray.600" mt={4}>
            Configuration settings go here...
          </Box>
        </Tabs.Content>
        
        <Tabs.Content value="logs">
          <Box fontSize="sm" color="gray.600" mt={4}>
            Logs content goes here...
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};