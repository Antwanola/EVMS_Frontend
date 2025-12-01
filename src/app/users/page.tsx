"use client"
import React, { useState, useEffect } from "react"
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
  AddIcon,
} from "@chakra-ui/icons"
import { FaSearchengin } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { PiExportBold } from "react-icons/pi";
import { authApi } from "../lib/api";
import { BiEditAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";


// Types
interface User {
  id: string
  idTag: string
  name: string
  email: string
  phone?: string
  status: "Active" | "Inactive" | "Suspended"
  createdAt: string
  lastActivity?: string
  totalTransactions: number
}

interface PaginationInfo {
  page: number
  limit: number
  totalPages: number
  totalItems: number
}

// Pagination Component
const PaginationControls: React.FC<{
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Flex justify="space-between" align="center" mt={6} wrap="wrap" gap={4}>
      <Text color="gray.600" fontSize="sm">
        Page {currentPage} of {totalPages}
      </Text>
      <HStack gap={2}>
        <IconButton
          aria-label="Previous page"
          icon={<ChevronLeftIcon />}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          variant="outline"
          borderRadius="full"
          size="sm"
        />
        <IconButton
          aria-label="Next page"
          icon={<ChevronRightIcon />}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          variant="outline"
          borderRadius="full"
          size="sm"
        />
      </HStack>
    </Flex>
  )
}

const UsersPage: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  })
  const router = useRouter();

  // Fetch users from API
  const fetchUsers = async (page: number = 1, search: string = "") => {
    setIsLoading(true)
    try {
      // Replace with your actual API endpoint
      const response = await authApi.getAllUsers()

      // Check if response is OK and is JSON
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.message}`)
      }


      const data = response.data
      console.log("Fetched users response:", data.users)
      setAllUsers(data.users)
      setPagination({
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
      })
    } catch (error) {
      console.log("Using mock data for development")
      // Mock data for development
      const mockUsers = getMockUsers()
      const filteredUsers = search
        ? mockUsers.filter(user =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.idTag.toLowerCase().includes(search.toLowerCase())
        )
        : mockUsers

      setAllUsers(filteredUsers)
      setPagination({
        page: 1,
        limit: 10,
        totalPages: 1,
        totalItems: filteredUsers.length,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mock data for development
  const getMockUsers = (): User[] => [
    {
      id: "1",
      idTag: "USER_001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+234 801 234 5678",
      status: "Active",
      createdAt: "2024-01-15",
      lastActivity: "2024-11-14",
      totalTransactions: 42,
    },
    {
      id: "2",
      idTag: "USER_002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+234 802 345 6789",
      status: "Active",
      createdAt: "2024-02-20",
      lastActivity: "2024-11-13",
      totalTransactions: 28,
    },
    {
      id: "3",
      idTag: "USER_003",
      name: "Michael Johnson",
      email: "m.johnson@example.com",
      status: "Inactive",
      createdAt: "2024-03-10",
      lastActivity: "2024-10-05",
      totalTransactions: 15,
    },
    {
      id: "4",
      idTag: "USER_004",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      phone: "+234 803 456 7890",
      status: "Suspended",
      createdAt: "2024-04-05",
      lastActivity: "2024-09-20",
      totalTransactions: 8,
    },
  ]

  useEffect(() => {
    fetchUsers(pagination.page, searchQuery)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchUsers(1, query)
  }

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, searchQuery)
  }


  const goToEdit = (id: string) => {
    router.push(`/users/edit/${id}`);
  }

  const handleExport = () => {
    // Convert users to CSV
    const headers = ["ID Tag", "Name", "Email", "Phone", "Status", "Created At", "Last Activity", "Total Transactions"]
    const csvData = allUsers.map(user => [
      user.idTag,
      user.name,
      user.email,
      user.phone || "—",
      user.status,
      user.createdAt,
      user.lastActivity || "—",
      user.totalTransactions,
    ])

    const csv = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const getStatusColor = (status: boolean) => {
    switch (status) {
      case true:
        return "green"
      case false:
        return "gray"
      // case "Suspended":
      //   return "red"
      default:
        return "gray"
    }
  }

  return (
    <Box bg="gray.50" minH="100vh" px={10} py={8}>
      <Container maxW="7xl" p={0}>
        {/* Page Header */}
        <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="xl" color="gray.900">
              Users
            </Heading>
            <Text color="gray.500" fontSize="md">
              View and manage all registered users.
            </Text>
          </VStack>
          <HStack gap={3}>
            <Button
              leftIcon={<IoIosAdd />}
              bg="blue.500"
              color="white"
              borderRadius="full"
              _hover={{ bg: "blue.600" }}
              shadow="sm"
            >
              <IoIosAdd />Add User
            </Button>
            <Button
              leftIcon={<PiExportBold />}
              bg="red.500"
              color="white"
              borderRadius="full"
              _hover={{ bg: "red.700" }}
              onClick={handleExport}
              shadow="sm"
            >
              <PiExportBold /> Export Data
            </Button>
          </HStack>
        </Flex>

        {/* Search Bar */}
        <Flex align="center" mb={6}>
          <InputGroup
            flex={1}
            minW="300px"
            startElement={<FaSearchengin color="gray.400" />}
          >
            <Input
              placeholder="Search by name, email, or ID tag..."
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

        {/* Users Table */}
        <Box
          bg="white"
          borderRadius="2xl"
          overflow="hidden"
          shadow="sm"
          border="1px solid"
          borderColor="gray.200"
        >
          <Box p={0}>
            <Box overflow="hidden" rounded="xl" border="1px" borderColor="gray.200" bg="white">
              {/* <Table.ScrollArea borderWidth="1px" rounded="md" height="160px"> */}
              <Table.Root size={"sm"} stickyHeader>
                <Table.Header >
                  <Table.Row bg="gray.300" >
                    <Table.ColumnHeader px={6} py={3} fontWeight={"900"}>ID Tag</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3} fontWeight={"900"}>Name</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3} fontWeight={"900"}>Email</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3} fontWeight={"900"}>Phone</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3} fontWeight={"900"}>Status</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3} fontWeight={"900"}>Role</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3} fontWeight={"900"}>Actions</Table.ColumnHeader>
                    {/* <Table.ColumnHeader     fontWeight={"900"}>Transactions</Table.ColumnHeader> */}
                  </Table.Row>
                </Table.Header>
                <TableBody>
                  {isLoading && allUsers.length === 0 ? (
                    <TableRow>
                      <TableCell px={6} py={4} color="gray.500" colSpan={8} textAlign="center" py={8}>
                        <Text color="gray.500">Loading users...</Text>
                      </TableCell>
                    </TableRow>
                  ) : allUsers.length === 0 ? (
                    <TableRow>
                      <TableCell px={6} py={4} color="gray.500" colSpan={8} textAlign="center" py={8}>
                        <Text color="gray.500">No users found</Text>
                      </TableCell>
                    </TableRow>
                  ) : (
                    allUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        _hover={{ bg: "gray.50" }}
                        transition="background 0.2s ease"
                      >
                        <TableCell px={6} py={4} color="gray.500" fontWeight="medium"> {user.idTag?.idTag ?? 'N/A'}</TableCell>
                        <TableCell px={6} py={4} color="gray.500" fontWeight={'medium'}>{user.username}</TableCell>
                        <TableCell px={6} py={4} color="gray.500" fontWeight={'medium'}>{user.email}</TableCell>
                        <TableCell px={6} py={4} color="gray.500" fontWeight={'medium'}>{user.phone || "—"}</TableCell>
                        <TableCell color="gray.500" >
                          <Badge
                            colorPalette={getStatusColor(user.isActive)}
                            variant="subtle"
                            borderRadius="full"
                            px={3}
                            py={1}
                            display="inline-flex"
                            alignItems="center"
                            gap={2}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell px={6} py={4} color="gray.500" fontWeight={'medium'} >{user.role}</TableCell>
                        <TableCell color="gray.500">
                          <Button
                            variant="outline"
                            colorScheme="gray"
                            borderRadius="sm"
                            size={'sm'}
                            display="flex"
                            alignItems="center"
                            gap={2}
                            onClick={() =>  goToEdit(user.id)}
                          >
                            Edit <BiEditAlt />
                          </Button>
                        </TableCell>

                        {/* <TableCell>{user.totalTransactions}</TableCell> */}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table.Root>
              {/* </Table.ScrollArea> */}
            </Box>
          </Box>
        </Box>

        {pagination.totalPages > 1 && (
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Container>
    </Box>
  )
}

export default UsersPage