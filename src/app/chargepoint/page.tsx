'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  VStack,
  Text,
  Circle,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { MdLocationOn } from 'react-icons/md'
import { ocppApi } from '../lib/api'
import { formatRelativeTime } from '@/Util/formatter'

interface ChargePoint {
  id: string
  model: string
  status: 'available' | 'occupied' | 'out-of-service' | 'faulted'
  connectors: number
  location: string
}

const ChargePoints: React.FC = () => {
  const router = useRouter();
  const [chargePoints, setChargePoints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchChargePoints = async () => {
      try {
        console.log("About to call ocppApi.getChargePoints()");
        const availableCP = await ocppApi.getChargePoints();
        console.log("available cp", availableCP);
        console.log("availableCP.data:", availableCP.data);
        setChargePoints(availableCP.data || []);
      } catch (error) {
        console.error("Failed to fetch charge points:", error);
        setChargePoints([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChargePoints();
  }, []);

  const getStatusConfig = (isOnline: boolean) => {
    if (isOnline) {
      return { color: 'green.400', label: 'Available' }
    } else {
      return { color: 'red.400', label: 'Offline' }
    }
  }

  const handleAddChargePoint = () => {
    console.log('Add charge point clicked')
  }

  const handleChargePointClick = (id: string) => {
    console.log(`Navigating to charge point ${id}`);
    router.push(`/chargepoint/${id}`);
  }





  console.log(chargePoints)

  // Show loading state to prevent hydration mismatch
  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }} p={8}>
        <Box maxW="7xl" mx="auto">
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="xl">Charge Points</Heading>
            <Button
              onClick={handleAddChargePoint}
              leftIcon={<AddIcon />}
              colorScheme="red"
              rounded="full"
            >
              Add Charge Point
            </Button>
          </Flex>
          <Text>Loading charge points...</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }} p={8}>
      <Box maxW="7xl" mx="auto">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="xl">Charge Points</Heading>
          <Button
            onClick={handleAddChargePoint}
            leftIcon={<AddIcon />}
            colorScheme="red"
            rounded="full"
          >
            Add Charge Point
          </Button>
        </Flex>

        {/* Grid */}
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
          }}
          gap={8}
        >
          {chargePoints.map((cp, index) => {
            const statusConfig = getStatusConfig(cp.isConnected)
            return (
              <GridItem
                key={`${cp.chargePoint?.id || cp.id}-${index}`}
                cursor="pointer"
                onClick={() => handleChargePointClick(cp.chargePoint?.id || cp.id)}
              >
                <Box
                  borderWidth="1px"
                  borderRadius="xl"
                  bg="white"
                  _dark={{ bg: 'gray.700' }}
                  shadow="lg"
                  _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
                  transition="all 0.3s"
                  overflow="hidden"
                  minH="280px"
                >
                  {/* Header Section */}
                  <Box bg="gray.50" _dark={{ bg: 'gray.600' }} p={6} borderBottom="1px" borderColor="gray.200">
                    <Flex justify="space-between" align="flex-start" mb={3}>
                      <Box>
                        <Heading size="lg" color="gray.800" _dark={{ color: 'white' }} mb={1}>
                          {cp.chargePoint?.id || cp.id}
                        </Heading>
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">
                          Charge Point ID
                        </Text>
                      </Box>
                      <Box textAlign="right">
                        <HStack spacing={2} mb={2}>
                          <Circle size="4" bg={statusConfig.color} />
                          <Text fontSize="sm" fontWeight="bold" color={statusConfig.color}>
                            {statusConfig.label}
                          </Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.400">
                         {formatRelativeTime(cp.chargePoint.lastSeen)}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  {/* Main Content */}
                  <Box p={6}>
                    <VStack spacing={4} align="stretch">
                      {/* Device Info */}
                      <Box>
                        <Text fontSize="xs" color="gray.500" fontWeight="semibold" textTransform="uppercase" mb={2}>
                          Device Information
                        </Text>
                        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                          <Box>
                            <Text fontSize="xs" color="gray.400" mb={1}>Model</Text>
                            <Text fontSize="sm" fontWeight="medium" color="gray.700" _dark={{ color: 'gray.200' }}>
                              {cp.chargePoint?.model || cp.model || 'Unknown'}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color="gray.400" mb={1}>Vendor</Text>
                            <Text fontSize="sm" fontWeight="medium" color="gray.700" _dark={{ color: 'gray.200' }}>
                              {cp.chargePoint?.vendor || 'Unknown'}
                            </Text>
                          </Box>
                        </Grid>
                      </Box>

                      {/* Connector Info */}
                      <Box>
                        <Text fontSize="xs" color="gray.500" fontWeight="semibold" textTransform="uppercase" mb={2}>
                          Connectors
                        </Text>
                        <Flex align="center" justify="space-between">
                          <HStack spacing={2}>
                            <Circle size="8" bg="blue.50" color="blue.500">
                              <Text fontSize="lg" fontWeight="bold">
                                {cp.chargePoint?.connectors.length - 1 || 1}
                              </Text>
                            </Circle>
                            <Box>
                              <Text fontSize="sm" fontWeight="medium" color="gray.700" _dark={{ color: 'gray.200' }}>
                                Connector{(cp.chargePoint.connectors || 1) !== 1 ? 's' : ''}
                              </Text>
                              <Text fontSize="xs" color="gray.400">
                                Available for charging
                              </Text>
                            </Box>
                          </HStack>
                        </Flex>
                      </Box>

                      {/* Location Info */}
                      <Box>
                        <Text fontSize="xs" color="gray.500" fontWeight="semibold" textTransform="uppercase" mb={2}>
                          Location
                        </Text>
                        <HStack spacing={2}>
                          <Box color="gray.400">
                            <MdLocationOn size={16} />
                          </Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.700" _dark={{ color: 'gray.200' }}>
                            {cp.chargePoint?.location || cp.location || 'Unknown Location'}
                          </Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Footer Actions */}
                  <Box 
                    borderTop="1px" 
                    borderColor="gray.200" 
                    _dark={{ borderColor: 'gray.600' }} 
                    p={4} 
                    bg="gray.25" 
                    _dark={{ bg: 'gray.650' }}
                  >
                    <Flex justify="space-between" align="center">
                      <Text fontSize="xs" color="gray.500">
                        Click to view details
                      </Text>
                      <HStack spacing={2}>
                        <Circle size="6" bg={statusConfig.color} opacity={0.2} />
                        <Text fontSize="xs" color="gray.400" fontWeight="medium">
                          ID: {cp.chargePoint?.serialNumber || 'N/A'}
                        </Text>
                      </HStack>
                    </Flex>
                  </Box>
                </Box>
              </GridItem>
            )
          })}
        </Grid>
      </Box>
    </Box>
  )
}

export default ChargePoints
