import React from 'react';
import {
  Box,
  Table,
  Badge,
  Button,
  Heading,
} from '@chakra-ui/react';

// Type definitions
interface Connector {
  id: number;
  status: 'Available' | 'Charging' | 'Faulted' | 'Unavailable';
  currentTransaction: string | null;
}

interface ConnectorTableProps {
  connectors?: Connector[];
}

// Sample data
const defaultConnectors: Connector[] = [
  {
    id: 1,
    status: 'Available',
    currentTransaction: null,
  },
  {
    id: 2,
    status: 'Charging',
    currentTransaction: 'TXN-12345',
  },
];

// Status color mapping
const getStatusColor = (status: Connector['status']) => {
  switch (status) {
    case 'Available':
      return 'green';
    case 'Charging':
      return 'yellow';
    case 'Faulted':
      return 'red';
    case 'Unavailable':
      return 'gray';
    default:
      return 'gray';
  }
};

// Button text based on status
const getActionText = (status: Connector['status']) => {
  switch (status) {
    case 'Available':
      return 'Start Charge';
    case 'Charging':
      return 'Stop Charge';
    case 'Faulted':
      return 'Reset';
    case 'Unavailable':
      return 'Unavailable';
    default:
      return 'Action';
  }
};

export const ConnectorTable: React.FC<ConnectorTableProps> = ({ 
  connectors = defaultConnectors 
}) => {
  const handleAction = (connectorId: number, status: Connector['status']) => {
    console.log(`Action triggered for connector ${connectorId} with status ${status}`);
    // Add your action logic here
  };

  return (
    <Box mt={8}>
      <Heading size="lg" mb={4} fontWeight={'black'}>
        Connectors
      </Heading>
      
      <Box border="1px" borderColor="gray.200" borderRadius="lg" overflow="hidden">
        <Table.Root size="sm" shadow={'lg'}>
          <Table.Header bgColor="green.50">
            <Table.Row bg={'gray.300'}>
              <Table.ColumnHeader
                color="gray.900" 
                fontSize="xs" 
                fontWeight="medium" 
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
                fontWeight="medium" 
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
                fontWeight="medium" 
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
                fontWeight="medium" 
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
            {connectors.map((connector) => (
              <Table.Row key={connector.id} borderBottom="1px" borderColor="gray.200">
                <Table.Cell fontWeight="medium" color="gray.900" px={6} py={4}>
                  {connector.id}
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
                    {connector.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell color="gray.500" px={6} py={4}>
                  {connector.currentTransaction || 'None'}
                </Table.Cell>
                <Table.Cell textAlign="right" px={6} py={4}>
                  <Button
                    variant="ghost"
                    color={'orange'}
                    colorScheme="brand"
                    fontWeight="semibold"
                    size="sm"
                    onClick={() => handleAction(connector.id, connector.status)}
                    disabled={connector.status === 'Unavailable'}
                  >
                    {getActionText(connector.status)}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
};

