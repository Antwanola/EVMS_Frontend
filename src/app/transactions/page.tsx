"use client"

import React, { useState } from "react"
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Input,
  InputGroup,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableColumnHeader,
  TableCell,
  Badge,
  HStack,
  VStack,
  Container,
  Card,
  IconButton,
} from "@chakra-ui/react"
import {
  SearchIcon,
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons"

//
// Types
//
interface Transaction {
  id: string
  chargePoint: string
  user: string
  startTime: string
  endTime: string
  energy: number
  duration: string
  status: "Completed" | "In Progress" | "Failed"
}

interface TransactionLogsProps {
  transactions?: Transaction[]
  onExport?: () => void
  onSearch?: (query: string) => void
}

//
// Sample data
//
const defaultTransactions: Transaction[] = [
  {
    id: "TXN12345",
    chargePoint: "CP001",
    user: "UserA",
    startTime: "2024-01-15 08:00",
    endTime: "2024-01-15 09:30",
    energy: 15.5,
    duration: "1h 30m",
    status: "Completed",
  },
  {
    id: "TXN67890",
    chargePoint: "CP002",
    user: "UserB",
    startTime: "2024-01-15 10:00",
    endTime: "2024-01-15 11:15",
    energy: 10.2,
    duration: "1h 15m",
    status: "Completed",
  },
  {
    id: "TXN11223",
    chargePoint: "CP001",
    user: "UserC",
    startTime: "2024-01-15 12:00",
    endTime: "2024-01-15 13:45",
    energy: 18.7,
    duration: "1h 45m",
    status: "In Progress",
  },
  {
    id: "TXN44556",
    chargePoint: "CP003",
    user: "UserD",
    startTime: "2024-01-15 14:00",
    endTime: "2024-01-15 15:30",
    energy: 12.3,
    duration: "1h 30m",
    status: "Completed",
  },
  {
    id: "TXN77889",
    chargePoint: "CP002",
    user: "UserE",
    startTime: "2024-01-15 16:00",
    endTime: "2024-01-15 17:45",
    energy: 16.8,
    duration: "1h 45m",
    status: "Failed",
  },
]

//
// Status badge colors
//
const getStatusColor = (status: Transaction["status"]): string => {
  switch (status) {
    case "Completed":
      return "green"
    case "In Progress":
      return "yellow"
    case "Failed":
      return "red"
    default:
      return "gray"
  }
}

//
// Pagination controls
//
const PaginationControls: React.FC = () => {
  return (
    <Flex justify="center" mt={6}>
      <HStack spacing={0}>
        <IconButton
          aria-label="Previous page"
          icon={<ChevronLeftIcon />}
          variant="outline"
          borderRadius="full"
          borderRightRadius="none"
          size="sm"
        />
        <Button
          bg="red.500"
          color="white"
          size="sm"
          borderRadius="none"
          _hover={{ bg: "red.600" }}
        >
          1
        </Button>
        <Button variant="outline" size="sm" borderRadius="none">
          2
        </Button>
        <Text
          px={4}
          py={2}
          border="1px"
          borderColor="gray.300"
          fontSize="sm"
        >
          ...
        </Text>
        <Button variant="outline" size="sm" borderRadius="none">
          9
        </Button>
        <Button variant="outline" size="sm" borderRadius="none">
          10
        </Button>
        <IconButton
          aria-label="Next page"
          icon={<ChevronRightIcon />}
          variant="outline"
          borderRadius="full"
          borderLeftRadius="none"
          size="sm"
        />
      </HStack>
    </Flex>
  )
}

//
// Main Component
//
export const TransactionLogs: React.FC<TransactionLogsProps> = ({
  transactions = defaultTransactions,
  onExport,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <Box bg="gray.50" minH="100vh" px={10} py={8}>
      <Container maxW="7xl" p={0}>
        {/* Page Header */}
        <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="xl" color="gray.900">
              Transaction Logs
            </Heading>
            <Text color="gray.500" fontSize="md">
              View and manage all charging transactions.
            </Text>
          </VStack>
          <Button
            leftIcon={<DownloadIcon />}
            bg="red.500"
            color="white"
            borderRadius="full"
            _hover={{ bg: "red.700" }}
            onClick={onExport}
            shadow="sm"
          >
            Export Data
          </Button>
        </Flex>

        {/* Search Bar */}
        <Flex align="center" mb={6}>
          <InputGroup
            flex={1}
            minW="300px"
            startElement={<SearchIcon color="gray.400" />}
          >
            <Input
              placeholder="Search transactions..."
              borderRadius="full"
              bg="white"
              borderColor="gray.300"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              focusRingColor="red.500"
              _focus={{ borderColor: "transparent" }}
            />
          </InputGroup>
        </Flex>

        {/* Transactions Table */}
        <Card.Root
          bg="white"
          borderRadius="2xl"
          overflow="hidden"
          shadow="sm"
          border="1px solid"
          borderColor="gray.200"
        >
          <Card.Body p={0}>
            <Box overflowX="auto">
              <Table.Root>
                <TableHeader bg="gray.50">
                  <TableRow>
                    <TableColumnHeader>Transaction ID</TableColumnHeader>
                    <TableColumnHeader>Charge Point</TableColumnHeader>
                    <TableColumnHeader>User</TableColumnHeader>
                    <TableColumnHeader>Start Time</TableColumnHeader>
                    <TableColumnHeader>End Time</TableColumnHeader>
                    <TableColumnHeader>Energy (kWh)</TableColumnHeader>
                    <TableColumnHeader>Duration</TableColumnHeader>
                    <TableColumnHeader>Status</TableColumnHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      _hover={{ bg: "gray.50" }}
                      transition="background 0.2s ease"
                    >
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.chargePoint}</TableCell>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell>{transaction.startTime}</TableCell>
                      <TableCell>{transaction.endTime}</TableCell>
                      <TableCell>{transaction.energy}</TableCell>
                      <TableCell>{transaction.duration}</TableCell>
                      <TableCell>
                        <Badge
                          colorPalette={getStatusColor(transaction.status)}
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="medium"
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table.Root>
            </Box>
          </Card.Body>
        </Card.Root>

        <PaginationControls />
      </Container>
    </Box>
  )
}

export default TransactionLogs
