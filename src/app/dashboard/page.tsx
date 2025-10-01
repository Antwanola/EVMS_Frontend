'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  GridItem,
  Table,
  Badge,
  Avatar,
  HStack,
  VStack,
  Container,
  Link,
} from '@chakra-ui/react'
import { ocppApi } from '../lib/api'
import { ChargePoint } from '../types/ocpp';
import { PiPlugsConnectedFill, PiPlugsFill, PiPlugsLight } from 'react-icons/pi'
import NextLink from "next/link";

// Types
interface ChargePointStatus {
  id: string
  status: true | false
  lastActivity: string
  location: string
  icon?: string
}

interface RecentActivity {
  chargePointId: string
  user: string
  startTime: string
  endTime: string
  energyConsumed: number
}

interface DashboardProps {
  totalChargePoints?: number
  onlineChargePoints?: number
  chargingChargePoints?: number
  chargePointStatuses?: ChargePointStatus[]
  recentActivities?: RecentActivity[]
}

// Status color mapping
const getStatusColor = (status: boolean | undefined) => {
  if (status === true) return 'green'
  if(status === false) return 'gray'
  return 'gray'
}
const showStatus = (status: boolean | undefined) => {
  if (status === true) return "Online"
  if(status === false) return "Ofline"
  return 'Charging'
}

const showIcons = (status: boolean | undefined) => {
  if (status === true) return <PiPlugsConnectedFill     />
  if (status === false) return <PiPlugsFill  />
  return  <PiPlugsLight />
}

// Sample defaults
const defaultChargePointStatuses: ChargePointStatus[] = [
  { id: 'CP001', status: 'Online', lastActivity: '5 minutes ago', location: 'Parking Lot A', icon: '⚡' },
  { id: 'CP002', status: 'Offline', lastActivity: '2 hours ago', location: 'Parking Lot B', icon: '🔌' },
  { id: 'CP003', status: 'Charging', lastActivity: '1 minute ago', location: 'Parking Lot A', icon: '🔋' },
  { id: 'CP004', status: 'Online', lastActivity: '10 minutes ago', location: 'Parking Lot C', icon: '⚡' },
  { id: 'CP005', status: 'Offline', lastActivity: '3 hours ago', location: 'Parking Lot B', icon: '🔌' },
]

const defaultRecentActivities: RecentActivity[] = [
  { chargePointId: 'CP003', user: 'Alice Johnson', startTime: '10:00 AM', endTime: '10:30 AM', energyConsumed: 15 },
  { chargePointId: 'CP001', user: 'Bob Williams', startTime: '9:00 AM', endTime: '9:45 AM', energyConsumed: 22 },
  { chargePointId: 'CP004', user: 'Charlie Davis', startTime: '8:30 AM', endTime: '9:15 AM', energyConsumed: 18 },
  { chargePointId: 'CP002', user: 'Diana Evans', startTime: '7:00 AM', endTime: '7:45 AM', energyConsumed: 20 },
  { chargePointId: 'CP005', user: 'Ethan Foster', startTime: '6:00 AM', endTime: '6:30 AM', energyConsumed: 12 },
]

// const getChargers = async() => {
//     const OCPPAPI = await ocppApi.getChargePoint()
// }
export const formatDateTime = (isoString: string) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
};
const Dashboard: React.FC<DashboardProps> = ({
  chargePointStatuses = defaultChargePointStatuses,
  recentActivities = defaultRecentActivities,
}) => {
  const [chargers, setChargers] = useState<ChargePoint[] | null>(null)
  const [state, setState] = useState();
  const [loading, setLoading ] = useState(true)
  // const data = getChargers()

const formatDateTime = (isoString: string) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};


// Fetch chargers on mount
useEffect(() => {
  const getChargers = async () => {
    try {
      const OCPPAPI = await ocppApi.getChargePoints();
      console.log(OCPPAPI.data)
      setChargers(OCPPAPI.data);
    } catch (error) {
      console.error("Failed to fetch chargers:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch once on mount
  getChargers();

  // fetch every 5s
  const interval = setInterval(getChargers, 5000);

  // cleanup
  return () => clearInterval(interval);
}, []);


const totalChargePoints = chargers?.length || 0
const  onlineChargePoints = chargers?.filter(cp => cp.isConnected === true).length || 0
const chargingChargePoints = chargers?.filter(cp => cp.isConnected === undefined).length || 0

console.log('cp:', chargers?.map(cp => cp.chargePoint.id));


  return (
    <Box bg="gray.50" minH="100vh">

      {/* Main Content */}
      <Box as="main" px={{ base: 4, sm: 6, lg: 10 }} py={8}>
        <Container maxW="7xl" px={0}>
          {/* Title */}
          <Box mb={8}>
            <Heading size="2xl" fontWeight="bold" letterSpacing="tight">Dashboard</Heading>
          </Box>

          {/* Stats */}
          <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} mb={12}>
            <GridItem>
              <Box bg="white" p={6} rounded="xl" border="1px" borderColor="gray.200">
                <VStack align="flex-start" spacing={2}>
                  <Text color="gray.600" fontSize="sm" fontWeight="medium">Total Charge Points</Text>
                  <Text color="gray.900" fontSize="4xl" fontWeight="bold">{totalChargePoints}</Text>
                </VStack>
              </Box>
            </GridItem>

            <GridItem>
              <Box bg="white" p={6} rounded="xl" border="1px" borderColor="gray.200">
                <VStack align="flex-start" spacing={2}>
                  <Text color="gray.600" fontSize="sm" fontWeight="medium">Online</Text>
                  <Text color="green.500" fontSize="4xl" fontWeight="bold">{onlineChargePoints}</Text>
                </VStack>
              </Box>
            </GridItem>

            <GridItem>
              <Box bg="white" p={6} rounded="xl" border="1px" borderColor="gray.200">
                <VStack align="flex-start" spacing={2}>
                  <Text color="gray.600" fontSize="sm" fontWeight="medium">Charging</Text>
                  <Text color="blue.500" fontSize="4xl" fontWeight="bold">{chargingChargePoints}</Text>
                </VStack>
              </Box>
            </GridItem>
          </Grid>

          {/* Charge Point Status Table */}
          <Box mb={12}>
            <Heading size="lg" fontWeight="bold" mb={4}>Charge Point Status</Heading>
            <Box overflow="hidden" rounded="xl" border="1px" borderColor="gray.200" bg="white">
              <Table.Root size="sm">
                <Table.Header bg="gray.50">
                  <Table.Row bg={'gray.100'} >
                    <Table.ColumnHeader px={6} py={3} fontWeight={'900'}>Charge Point ID</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3} fontWeight={'900'}>Status</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3} fontWeight={'900'}>Last Activity</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3} fontWeight={'900'}>Location</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {chargers?.map((cp) => (
                    <Table.Row key={cp.chargePoint.id}>
                      <Table.Cell px={6} py={4} fontWeight="medium">
                         <Link as={NextLink} href={`/chargepoint/${cp.chargePoint.id}`} color="blue.500" _hover={{ textDecoration: "underline" }}>
                         {cp.chargePoint.id}
                         </Link>
                        </Table.Cell>
                      <Table.Cell px={6} py={4}>
                        <Badge
                          bg={`${getStatusColor(cp.isConnected)}.300`}
                          variant="subtle"
                          borderRadius="full"
                          px={3}
                          py={1}
                          display="inline-flex"
                          alignItems="center"
                          gap={2}
                        >
                          <Box>{showIcons(cp.isConnected)}</Box>
                          {showStatus(cp.isConnected)}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell px={6} py={4} color="gray.500">{formatDateTime(cp.chargePoint.lastSeen)}</Table.Cell>
                      <Table.Cell px={6} py={4} color="gray.500">{cp.location}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>

          {/* Recent Activity Table */}
          <Box>
            <Heading size="lg" fontWeight="bold" mb={4}>Recent Activity</Heading>
            <Box overflow="hidden" rounded="xl" border="1px" borderColor="gray.200" bg="white">
              <Table.Root size="sm">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader px={6} py={3}>Charge Point ID</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3}>User</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3}>Start Time</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3}>End Time</Table.ColumnHeader>
                    <Table.ColumnHeader px={6} py={3}>Energy Consumed (kWh)</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {recentActivities.map((activity, index) => (
                    <Table.Row key={index}>
                      <Table.Cell px={6} py={4} fontWeight="medium">{activity.chargePointId}</Table.Cell>
                      <Table.Cell px={6} py={4} color="gray.500">{activity.user}</Table.Cell>
                      <Table.Cell px={6} py={4} color="gray.500">{activity.startTime}</Table.Cell>
                      <Table.Cell px={6} py={4} color="gray.500">{activity.endTime}</Table.Cell>
                      <Table.Cell px={6} py={4} color="gray.500">{activity.energyConsumed}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Dashboard
