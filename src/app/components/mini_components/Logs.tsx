import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  VStack,
  Input,
  Select,
  Table,
  Badge,
  Text,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';

// Type definitions
interface LogEntry {
  id: string;
  timestamp: string;
  eventDescription: string;
  data: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

interface LogsTableProps {
  logs?: LogEntry[];
  onExport?: () => void;
  onSearch?: (query: string) => void;
  onFilterEventType?: (eventType: string) => void;
  onFilterSeverity?: (severity: string) => void;
  onFilterDate?: (date: string) => void;
}

// Sample data
const defaultLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2023-10-27 14:30:15',
    eventDescription: 'Charge point connected to CSMS.',
    data: '-',
    severity: 'Info',
  },
  {
    id: '2',
    timestamp: '2023-10-27 14:31:02',
    eventDescription: 'Charging started on connector 1.',
    data: 'Transaction ID: TXN12345',
    severity: 'Info',
  },
  {
    id: '3',
    timestamp: '2023-10-27 15:05:20',
    eventDescription: 'Charging stopped on connector 1.',
    data: 'Transaction ID: TXN12345, Reason: EVDisconnected',
    severity: 'Info',
  },
  {
    id: '4',
    timestamp: '2023-10-27 16:00:05',
    eventDescription: 'Firmware update initiated.',
    data: 'Version: 5.13.0',
    severity: 'Info',
  },
  {
    id: '5',
    timestamp: '2023-10-27 16:15:30',
    eventDescription: 'Firmware update successful.',
    data: 'Version: 5.13.0',
    severity: 'Info',
  },
  {
    id: '6',
    timestamp: '2023-10-27 17:00:00',
    eventDescription: 'Charge point connection lost.',
    data: '-',
    severity: 'Warning',
  },
  {
    id: '7',
    timestamp: '2023-10-27 17:01:10',
    eventDescription: 'An error occurred on connector 2.',
    data: 'Error Code: OverCurrentFailure',
    severity: 'Critical',
  },
];

// Severity color mapping
const getSeverityColor = (severity: LogEntry['severity']) => {
  switch (severity) {
    case 'Info':
      return 'green';
    case 'Warning':
      return 'yellow';
    case 'Critical':
      return 'red';
    default:
      return 'gray';
  }
};

export const LogsTable: React.FC<LogsTableProps> = ({
  logs = defaultLogs,
  onExport,
  onSearch,
  onFilterEventType,
  onFilterSeverity,
  onFilterDate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('All Event Types');
  const [severityFilter, setSeverityFilter] = useState('All Severities');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(2); // Set to 2 to match original design

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleEventTypeChange = (value: string) => {
    setEventTypeFilter(value);
    onFilterEventType?.(value);
  };

  const handleSeverityChange = (value: string) => {
    setSeverityFilter(value);
    onFilterSeverity?.(value);
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
    onFilterDate?.(value);
  };

  const handleExport = () => {
    onExport?.();
  };

  return (
    <Box bg="white" p={6} rounded="lg" border="1px" borderColor="gray.200">
      <Heading size="lg" mb={4}>
        Logs
      </Heading>

      {/* Filters Section */}
      <Flex 
        direction={{ base: 'column', lg: 'row' }}
        align={{ base: 'stretch', lg: 'center' }}
        justify="space-between"
        gap={4}
        mb={6}
        wrap="wrap"
      >
        <HStack spacing={4} wrap="wrap">
          {/* Search Input */}
          <Box position="relative" minW="256px">
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              pl={10}
              pr={4}
              py={2}
              border="1px"
              borderColor="gray.300"
              rounded="lg"
              fontSize="sm"
              _focus={{
                borderColor: '#ea2a33',
                boxShadow: '0 0 0 1px #ea2a33',
              }}
            />
            <Box
              position="absolute"
              left={3}
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
              fontSize="20px"
            >
              🔍
            </Box>
          </Box>

          {/* Event Type Filter */}
          <Select.Root
            value={[eventTypeFilter]}
            onValueChange={(e) => handleEventTypeChange(e.value[0])}
            size="sm"
          >
            <Select.Trigger
              minW="160px"
              borderColor="gray.300"
              _focus={{
                borderColor: '#ea2a33',
                boxShadow: '0 0 0 1px #ea2a33',
              }}
            >
              <Select.ValueText />
            </Select.Trigger>
            <Select.Content>
              <Select.Item item="All Event Types">
                <Select.ItemText>All Event Types</Select.ItemText>
              </Select.Item>
              <Select.Item item="Connection">
                <Select.ItemText>Connection</Select.ItemText>
              </Select.Item>
              <Select.Item item="Charging">
                <Select.ItemText>Charging</Select.ItemText>
              </Select.Item>
              <Select.Item item="Error">
                <Select.ItemText>Error</Select.ItemText>
              </Select.Item>
              <Select.Item item="Firmware">
                <Select.ItemText>Firmware</Select.ItemText>
              </Select.Item>
            </Select.Content>
          </Select.Root>

          {/* Severity Filter */}
          <Select.Root
            value={[severityFilter]}
            onValueChange={(e) => handleSeverityChange(e.value[0])}
            size="sm"
          >
            <Select.Trigger
              minW="160px"
              borderColor="gray.300"
              _focus={{
                borderColor: '#ea2a33',
                boxShadow: '0 0 0 1px #ea2a33',
              }}
            >
              <Select.ValueText />
            </Select.Trigger>
            <Select.Content>
              <Select.Item item="All Severities">
                <Select.ItemText>All Severities</Select.ItemText>
              </Select.Item>
              <Select.Item item="Info">
                <Select.ItemText>Info</Select.ItemText>
              </Select.Item>
              <Select.Item item="Warning">
                <Select.ItemText>Warning</Select.ItemText>
              </Select.Item>
              <Select.Item item="Critical">
                <Select.ItemText>Critical</Select.ItemText>
              </Select.Item>
            </Select.Content>
          </Select.Root>

          {/* Date Filter */}
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => handleDateChange(e.target.value)}
            minW="192px"
            border="1px"
            borderColor="gray.300"
            rounded="lg"
            fontSize="sm"
            _focus={{
              borderColor: '#ea2a33',
              boxShadow: '0 0 0 1px #ea2a33',
            }}
          />
        </HStack>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          bg="#ea2a33"
          color="white"
          size="sm"
          leftIcon={<Box fontSize="16px">📥</Box>}
          _hover={{
            bg: '#d0262d',
          }}
          _focus={{
            boxShadow: '0 0 0 2px #ea2a33',
          }}
        >
          Export Data
        </Button>
      </Flex>

      {/* Logs Table */}
      <Box overflow="auto">
        <Table.Root size="sm">
          <Table.Header bg="gray.50">
            <Table.Row>
              <Table.ColumnHeader
                color="gray.700"
                fontSize="xs"
                fontWeight="medium"
                textTransform="uppercase"
                px={6}
                py={3}
              >
                Timestamp
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="gray.700"
                fontSize="xs"
                fontWeight="medium"
                textTransform="uppercase"
                px={6}
                py={3}
              >
                Event Description
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="gray.700"
                fontSize="xs"
                fontWeight="medium"
                textTransform="uppercase"
                px={6}
                py={3}
              >
                Data
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="gray.700"
                fontSize="xs"
                fontWeight="medium"
                textTransform="uppercase"
                px={6}
                py={3}
              >
                Severity
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {logs.map((log, index) => (
              <Table.Row 
                key={log.id} 
                bg={index % 2 === 0 ? 'white' : 'gray.50'}
                borderBottom="1px"
                borderColor="gray.200"
              >
                <Table.Cell
                  px={6}
                  py={4}
                  fontFamily="mono"
                  fontSize="xs"
                  whiteSpace="nowrap"
                >
                  {log.timestamp}
                </Table.Cell>
                <Table.Cell px={6} py={4} fontSize="sm">
                  {log.eventDescription}
                </Table.Cell>
                <Table.Cell
                  px={6}
                  py={4}
                  fontFamily="mono"
                  fontSize="xs"
                >
                  {log.data}
                </Table.Cell>
                <Table.Cell px={6} py={4}>
                  <Badge
                    colorScheme={getSeverityColor(log.severity)}
                    variant="subtle"
                    fontSize="xs"
                    fontWeight="medium"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {log.severity}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Pagination */}
      <Flex justify="space-between" align="center" pt={4}>
        <Text fontSize="sm" color="gray.500">
          Showing 1 to 7 of 25 entries
        </Text>
        <HStack spacing={0}>
          <Button
            variant="outline"
            size="sm"
            borderColor="gray.300"
            color="gray.500"
            bg="white"
            roundedRight="none"
            _hover={{
              bg: 'gray.100',
              color: 'gray.700',
            }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            borderColor="gray.300"
            color="gray.500"
            bg="white"
            rounded="none"
            _hover={{
              bg: 'gray.100',
              color: 'gray.700',
            }}
          >
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            borderColor="#ea2a33"
            color="#ea2a33"
            bg="red.50"
            rounded="none"
            _hover={{
              bg: 'red.100',
              color: '#d0262d',
            }}
          >
            2
          </Button>
          <Button
            variant="outline"
            size="sm"
            borderColor="gray.300"
            color="gray.500"
            bg="white"
            rounded="none"
            _hover={{
              bg: 'gray.100',
              color: 'gray.700',
            }}
          >
            3
          </Button>
          <Button
            variant="outline"
            size="sm"
            borderColor="gray.300"
            color="gray.500"
            bg="white"
            roundedLeft="none"
            _hover={{
              bg: 'gray.100',
              color: 'gray.700',
            }}
          >
            Next
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default LogsTable;