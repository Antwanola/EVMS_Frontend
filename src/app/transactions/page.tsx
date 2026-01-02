"use client"

import React, { useEffect, useState } from "react"
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
import { ocppApi } from "../lib/api"
import { formatDateTime } from "../dashboard/page"
import { formatRelativeTime, formatTimeForTxn } from "@/Util/formatter"
import { calculateDuration, calculateEnergy } from "@/helper"

//
// Types
//
interface Transactions {
  id: number
  transactionId: number
  chargePointId: string
  idTag: string
  startTimestamp: string
  stopTimestamp: string | null
  meterStart: number
  meterStop: number | null
  energy?: number
  startSoC?: number | null
  stopSoC?: number | null
  duration?: string
  status: "Completed" | "In Progress" | "Failed"
}

interface TransactionLogsProps {
  transactions?: Transactions[]
  onExport?: () => void
  onSearch?: (query: string) => void
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

//
// Status badge colors
//
const getStatusColor = (status: Transactions["status"]): string => {
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


//
// Helper function to determine status
//
const determineStatus = (stopTimestamp: string | null, stopReason: string | null): Transactions["status"] => {
  if (!stopTimestamp) return "In Progress"
  if (stopReason && ["EMERGENCY_STOP", "HARD_RESET", "POWER_LOSS"].includes(stopReason)) {
    return "Failed"
  }
  return "Completed"
}


interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
//
// Pagination controls
//
const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange, }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

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
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          _disabled={{ opacity: 0.5, cursor: "not-allowed" }}>
          <ChevronLeftIcon />
        </IconButton>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <Text
                px={4}
                py={2}
                border="1px"
                borderColor="gray.300"
                fontSize="sm"
              >
                ...
              </Text>
            ) : (
              <Button
                bg={currentPage === page ? "red.500" : "white"}
                color={currentPage === page ? "white" : "gray.700"}
                size="sm"
                borderRadius="none"
                _hover={{ bg: currentPage === page ? "red.600" : "gray.100" }}
                onClick={() => onPageChange(page as number)}
                border="1px"
                borderColor="gray.300"
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        <IconButton
          aria-label="Next page"
          icon={<ChevronRightIcon />}
          variant="outline"
          borderRadius="full"
          borderLeftRadius="none"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
        >
          < ChevronRightIcon />
        </IconButton>
      </HStack>
    </Flex>
  );
};

export const TransactionLogs: React.FC<TransactionLogsProps> = ({
  transactions = [],
  onExport,
  onSearch,
}) => {
  const [allTransactions, setAllTransactions] = useState<Transactions[]>(transactions)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  // Add pagination state
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on search
    onSearch?.(value);
  };

  // Fetch transactions with pagination
  const getAllTxn = async (page: number = pagination.page, search: string = searchQuery) => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search: search,
        sortBy: 'startTimestamp',
        order: 'desc',
      });

      const allTxn = await ocppApi.getTransactions({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search: search,
        sortBy: 'startTimestamp',
        order: 'desc',
      });

      if (!allTxn || !allTxn.data || !allTxn.data.transactions) {
        setAllTransactions([]);
        return;
      }
      console.log("Raw Transactions Data:", allTxn.data);
      // Transform the API data to match UI expectations
      const transformedTransactions = allTxn.data.transactions.map((txn: any) => ({
        id: txn.id,
        transactionId: txn.transactionId,
        chargePointId: txn.chargePointId,
        idTag: txn.idTag?.idTag ?? "—",
        startTimestamp: formatTimeForTxn(txn.startTimestamp),
        stopTimestamp: formatTimeForTxn(txn.stopTimestamp),
        meterStart: txn.meterStart,
        meterStop: txn.meterStop,
        startSoC: txn.startSoC,
        stopSoC: txn.stopSoC,
        energy: calculateEnergy(txn.meterStart, txn.meterStop),
        duration: calculateDuration(txn.startTimestamp, txn.stopTimestamp),
        status: determineStatus(txn.stopTimestamp, txn.stopReason),
      }));

      setAllTransactions(transformedTransactions);

      // Update pagination data from backend response
      if (allTxn.data.pagination) {
        setPagination(allTxn.data.pagination);
      }

    } catch (error) {
      console.error("Error fetching transactions:", error);
      setAllTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    getAllTxn(newPage, searchQuery);
  };

  useEffect(() => {
    getAllTxn(pagination.page, searchQuery);

    // Fetch every 5 minutes (reduced frequency to avoid overwhelming with pagination)
    const interval = setInterval(() => {
      getAllTxn(pagination.page, searchQuery);
    }, 300000);

    // Cleanup
    return () => clearInterval(interval);
  }, []); // Only run on mount

  // Trigger fetch when search changes
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery !== undefined) {
        getAllTxn(1, searchQuery);
      }
    }, 500); // Debounce search

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

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
            <Box overflow="hidden" rounded="xl" border="1px" borderColor="gray.200" bg="white">
              <Table.Root size={'sm'}>
                <TableHeader bg="gray.100">
                  <TableRow bg={'gray.100'}>
                    <TableColumnHeader px={3} py={3} fontWeight={'900'} fontSize={12}>Transaction ID</TableColumnHeader>
                    <TableColumnHeader px={3} py={3} fontWeight={'900'} fontSize={12}>Charge Point</TableColumnHeader>
                    <TableColumnHeader px={3} py={3} fontWeight={'900'} fontSize={12}>User (ID Tag)</TableColumnHeader>
                    <TableColumnHeader px={3} py={3} fontWeight={'900'} fontSize={12}>Start Time</TableColumnHeader>
                    <TableColumnHeader px={3} py={3} fontWeight={'900'} fontSize={12}>End Time</TableColumnHeader>
                    <TableColumnHeader px={3} py={3} fontWeight={'900'} fontSize={12}>Energy (kWh)</TableColumnHeader>
                    <TableColumnHeader px={3} py={3} fontWeight={'900'} fontSize={12}>Duration</TableColumnHeader>
                    <TableColumnHeader px={3} py={3} fontWeight={'900'} fontSize={12}>Start SoC</TableColumnHeader>
                    <TableColumnHeader px={3} py={3} fontWeight={'900'} fontSize={12}>Stop SoC</TableColumnHeader>
                    <TableColumnHeader px={3} py={3} fontWeight={'900'} fontSize={12}>Status</TableColumnHeader>

                  </TableRow>
                </TableHeader>
                <TableBody fontSize={12} gap={5}>
                  {isLoading && allTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} textAlign="center" py={8}>
                        <Text color="gray.500">Loading transactions...</Text>
                      </TableCell>
                    </TableRow>
                  ) : allTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} textAlign="center" py={8}>
                        <Text color="gray.500">No transactions found</Text>
                      </TableCell>
                    </TableRow>
                  ) : (
                    allTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        _hover={{ bg: "gray.50" }}
                        transition="background 0.2s ease"
                      >
                        <TableCell>{transaction.transactionId}</TableCell>
                        <TableCell>{transaction.chargePointId}</TableCell>
                        <TableCell>{transaction.idTag ?? ""}</TableCell>
                        <TableCell>{transaction.startTimestamp}</TableCell>
                        <TableCell>{transaction.stopTimestamp || "—"}</TableCell>
                        <TableCell>{transaction.energy?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>{transaction.duration || "—"}</TableCell>
                        <TableCell>{transaction.startSoC || "—"}</TableCell>
                        <TableCell>{transaction.stopSoC || "—"}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table.Root>
            </Box>
          </Card.Body>
        </Card.Root>

        {pagination.totalPages > 1 && (
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}  // Add this prop
          />
        )}
      </Container>
    </Box>
  )
}

export default TransactionLogs