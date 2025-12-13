'use client'
import React, { useEffect, useState } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import { StatusCard } from "./StatusCard";

import ChargePointConfigForm from "./Configuration_form";
import { ConnectorTable } from "./ConnectorTables";
import { RemoteControl } from "./RemoteControll";
import LogsTable from "./Logs";
import { PiPlugsConnectedFill, PiPlugsFill } from "react-icons/pi";
import { ocppApi } from "@/app/lib/api";
import { ChargePoint } from "@/app/types/ocpp";
import { MdOutlineEventAvailable } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { formatDateTime } from "@/app/dashboard/page";
import { FaHeartCircleBolt } from "react-icons/fa6";

interface ChargePointIDProps {
  chargePoint: ChargePoint | null;
  loading: boolean
}

export const TabsSection: React.FC<ChargePointIDProps> = ({ chargePoint, loading }) => {
  console.log("this is chargepoint", chargePoint?.chargePoint.connectors)
  return (
    <Box borderBottomWidth="1px" borderColor="gray.200">
      <Tabs.Root defaultValue="overview" variant="line" colorPalette="brand">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="configuration">Configuration</Tabs.Trigger>
          <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <Heading fontWeight={"black"} textAlign={"left"}>Real-time Status</Heading>
          <Flex gap={20} fontSize="sm" color="gray.600" mt={4}>
            <StatusCard
              value={chargePoint?.isConnected ? "Online" : loading ? "Loading..." : "Offline"}
              icon={chargePoint?.isConnected ? PiPlugsConnectedFill : PiPlugsFill} // Fixed: removed .data and added space after ?
              title={"Status"}
              color={chargePoint?.isConnected ? "green" : "gray"} // Fixed: removed .data
            />
            <StatusCard
              value={chargePoint.realTimeData === null || chargePoint.realTimeData[0].status == null ? "Unavailable" : chargePoint.realTimeData[0].status}
              icon={chargePoint?.isConnected ? MdOutlineEventAvailable  : PiPlugsFill}
              title={"Availability"}
              color={chargePoint?.isConnected ? "blue" : "gray"} // Fixed: removed .data
            />

            <StatusCard
              value={formatDateTime(chargePoint?.chargePoint.lastSeen)}
              icon={FaHeartCircleBolt}
              title={"Last Heartbeat"}
              color={chargePoint?.isConnected ? "green" : "gray"} // Fixed: removed .data
            />
            {/* Add more StatusCards as needed */}
          </Flex>
          <Box py={5}>
            <ConnectorTable connectors={chargePoint?.chargePoint.connectors} />
          </Box>
          <Box mt={10}>
            <RemoteControl />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="configuration">
          <Box fontSize="sm" color="gray.600" mt={4}>
            <ChargePointConfigForm initialData={chargePoint ?? undefined} />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="logs">
          <LogsTable />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};