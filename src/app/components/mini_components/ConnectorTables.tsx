import React from "react";
import { Box, Table, Badge, Button, Heading } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import { BiSolidZap, BiError, BiCheckCircle, BiPause } from "react-icons/bi";
import { IconType } from "react-icons";

// Type definitions
interface Connector {
  id: number;
  status:
    | "AVAILABLE"
    | "PREPARING"
    | "CHARGING"
    | "SUSPENDED_EVSE"
    | "SUSPENDED_EV"
    | "FINISHING"
    | "RESERVED"
    | "UNAVAILABLE"
    | "FAULTED";
  currentTransaction: string | null;
  connectorId: number;
}

interface ConnectorTableProps {
  connectors?: Connector[];
}

const statusIcons: Record<string, IconType | null> = {
  AVAILABLE: BiCheckCircle,
  PREPARING: BiPause,
  CHARGING: BiSolidZap,
  SUSPENDED_EVSE: BiPause,
  SUSPENDED_EV: BiPause,
  FINISHING: BiSolidZap,
  RESERVED: BiPause,
  UNAVAILABLE: null,  // no icon
  FAULTED: BiError,
};


// Status color mapping
const getStatusColor = (status: Connector["status"]) => {
  switch (status) {
    case "AVAILABLE":
      return "green"; // free and ready
    case "PREPARING":
      return "blue"; // getting ready to charge
    case "CHARGING":
      return "yellow"; // actively charging
    case "SUSPENDED_EVSE":
      return "orange"; // stopped by station
    case "SUSPENDED_EV":
      return "orange"; // stopped by vehicle
    case "FINISHING":
      return "teal"; // wrapping up
    case "RESERVED":
      return "purple"; // reserved for a session
    case "UNAVAILABLE":
      return "gray"; // offline/disabled
    case "FAULTED":
      return "red"; // error condition
    default:
      return "gray"; // fallback
  }
};

// Button text based on status
const getActionText = (status: Connector["status"]) => {
  switch (status) {
    case "AVAILABLE":
      return "Start Charge";
    case "PREPARING":
      return "Preparing...";
    case "CHARGING":
      return "Stop Charge";
    case "SUSPENDED_EVSE":
      return "Resume from EVSE";
    case "SUSPENDED_EV":
      return "Resume from EV";
    case "FINISHING":
      return "Finishing...";
    case "RESERVED":
      return "Reserved";
    case "UNAVAILABLE":
      return "Unavailable";
    case "FAULTED":
      return "Reset";
    default:
      return "Action";
  }
};

export const ConnectorTable: React.FC<ConnectorTableProps> = ({
  connectors,
}) => {
  const sortedConnectors = (connectors: Connector[]) => {
    const filtered = connectors.filter(
      (connector) => connector.connectorId != 0
    );
    return filtered.sort((a, b) => a.connectorId - b.connectorId);
  };
  const handleAction = (connectorId: number, status: Connector["status"]) => {
    console.log(
      `Action triggered for connector ${connectorId} with status ${status}`
    );
    // Add your action logic here
  };

  return (
    <Box mt={8}>
      <Heading size="lg" mb={4} fontWeight={"black"}>
        Connectors
      </Heading>

      <Box
        border="1px"
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
      >
        <Table.Root size="sm" shadow={"lg"}>
          <Table.Header bgColor="green.50">
            <Table.Row bg={"gray.300"}>
              <Table.ColumnHeader
                color="gray.900"
                fontSize="xs"
                fontWeight="900"
                textTransform="uppercase"
                letterSpacing="wide"
                px={6}
                py={3}
              >
                Connector ID
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="gray.900"
                fontSize="xs"
                fontWeight="900"
                textTransform="uppercase"
                letterSpacing="wide"
                px={6}
                py={3}
              >
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="gray.900"
                fontSize="xs"
                fontWeight="900"
                textTransform="uppercase"
                letterSpacing="wide"
                px={6}
                py={3}
              >
                Current Transaction
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="gray.900"
                fontSize="xs"
                fontWeight="900"
                textTransform="uppercase"
                letterSpacing="wide"
                textAlign="right"
                px={6}
                py={3}
              >
                Action
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedConnectors(connectors ?? defaultConnectors).map(
              (connector) => (
                <Table.Row
                  key={connector.id}
                  borderBottom="1px"
                  borderColor="gray.200"
                >
                  <Table.Cell
                    fontWeight="medium"
                    color="gray.900"
                    px={6}
                    py={4}
                  >
                    {connector.connectorId}
                  </Table.Cell>
                  <Table.Cell px={6} py={4}>
                    <Badge
                      bg={`${getStatusColor(connector.status)}.200`}
                      variant="subtle"
                      fontSize="xs"
                      fontWeight="semibold"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      <HStack spacing={1}>
                        {statusIcons[connector.status] &&
                          React.createElement(statusIcons[connector.status]!, {
                            size: 12,
                          })}
                        <span>{connector.status}</span>
                      </HStack>
                    </Badge>
                  </Table.Cell>
                  <Table.Cell color="gray.500" px={6} py={4}>
                    {connector.currentTransaction || "None"}
                  </Table.Cell>
                  <Table.Cell textAlign="right" px={6} py={4}>
                    <Button
                      variant="ghost"
                      color={"orange"}
                      colorScheme="brand"
                      fontWeight="semibold"
                      size="sm"
                      onClick={() =>
                        handleAction(connector.id, connector.status)
                      }
                      disabled={connector.status === "Unavailable"}
                    >
                      {getActionText(connector.status)}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
};
