'use client'

import React, { useCallback, useMemo } from "react";
import { Flex, Box, VStack, Spinner, Text } from "@chakra-ui/react";
import { Sidebar } from "@/app/components/mini_components/SideBar";
import { PageHeader } from "./mini_components/PageHeader";
import { TabsSection } from "./mini_components/TableSection";
import { useChargePoints } from "@/hooks/chargepoint";
import { ChargePoint } from "@/app/types/ocpp";

interface ID {
  id: string;
}

export const EVChargeDashboard: React.FC<ID> = ({ id }) => {
  // 🔑 use the hook
  const { chargePoints, loading, error, refetch, sendCommand } = useChargePoints({
    autoRefresh: true,   // keeps updating automatically
    refreshInterval: 5000,
  });

  // 🔎 find a single charger by id
  const charger = useMemo(
    () => chargePoints.find((item) => item.chargePoint?.id === id) as ChargePoint,
    [chargePoints, id]
  );
  // console.log(charger )

  if (loading) {
    return (
      <Flex h="100vh" justify="center" align="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex h="100vh" justify="center" align="center">
        <Text color="red.500">Error: {error}</Text>
      </Flex>
    );
  }

  if (!charger) {
    return (
      <Flex h="100vh" justify="center" align="center">
        <Text>No charge point found with ID {id}</Text>
      </Flex>
    );
  }

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar could go here if you want */}
      <Box flex={1} p={8} overflow="auto">
        <VStack align="stretch" gap={5}>
          <PageHeader
            title="Charge Point Management"
            subtitle="Manage and monitor the charge point"
            chargePoint={charger}
          />

          <TabsSection chargePoint={charger} loading={loading} />
        </VStack>
      </Box>
    </Flex>
  );
};

export default EVChargeDashboard;
