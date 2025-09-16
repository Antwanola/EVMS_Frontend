'use client'
import React from "react";
import { Flex, Box, VStack } from "@chakra-ui/react";
import { Sidebar } from "@/app/components/mini_components/SideBar";
import { PageHeader } from "../mini_components/PageHeader";
import { TabsSection } from "../mini_components/TableSection";
import { StatusCard } from "../mini_components/StatusCard";
import { ConnectorTable } from "../mini_components/ConnectorTables";
import { RemoteControl } from "../mini_components/RemoteControll";

export const EVChargeDashboard: React.FC = () => {
  return (
    <Flex h="100vh" bg="gray.50">
      
      {/* Main Content */}
      <Box flex={1} p={8} overflow="auto">
        <VStack align="stretch" gap={5}>
          <PageHeader 
            title="Charge Point Management"
            subtitle="Manage and monitor the charge point CP-001"
            chargePointId="CP-001"
          />
          
          <TabsSection />
          
          
          
          <ConnectorTable />
          
          <RemoteControl />
        </VStack>
      </Box>
    </Flex>
  );
};

export default EVChargeDashboard;