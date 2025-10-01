'use client'

import React from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  Circle,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { MdLocationOn } from 'react-icons/md'

interface ChargePoint {
  id: string
  model: string
  status: 'available' | 'occupied' | 'out-of-service' | 'faulted'
  connectors: number
  location: string
}

const ChargePoints: React.FC = () => {
  const chargePoints: ChargePoint[] = [
    { id: 'CP-001', model: 'Terra 54', status: 'available', connectors: 2, location: 'Location A' },
    { id: 'CP-002', model: 'Terra 54', status: 'occupied', connectors: 2, location: 'Location A' },
    { id: 'CP-003', model: 'EVBox Troniq', status: 'out-of-service', connectors: 1, location: 'Location B' },
    { id: 'CP-004', model: 'ChargePoint Pro', status: 'available', connectors: 2, location: 'Location C' },
    { id: 'CP-005', model: 'Terra 54', status: 'available', connectors: 2, location: 'Location B' },
    { id: 'CP-006', model: 'ChargePoint Pro', status: 'faulted', connectors: 2, location: 'Location C' },
    { id: 'CP-007', model: 'EVBox Troniq', status: 'available', connectors: 1, location: 'Location A' },
    { id: 'CP-008', model: 'Terra 54', status: 'occupied', connectors: 2, location: 'Location D' },
  ]

  const getStatusConfig = (status: ChargePoint['status']) => {
    switch (status) {
      case 'available':
        return { color: 'green.400', label: 'Available' }
      case 'occupied':
        return { color: 'yellow.400', label: 'Occupied' }
      case 'out-of-service':
        return { color: 'gray.400', label: 'Out of Service' }
      case 'faulted':
        return { color: 'red.400', label: 'Faulted' }
      default:
        return { color: 'gray.400', label: 'Unknown' }
    }
  }

  const handleAddChargePoint = () => {
    console.log('Add charge point clicked')
  }

  const handleChargePointClick = (id: string) => {
    console.log(`Charge point ${id} clicked`)
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
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)',
          }}
          gap={6}
        >
          {chargePoints.map((cp) => {
            const statusConfig = getStatusConfig(cp.status)
            return (
              <GridItem
                key={cp.id}
                cursor="pointer"
                onClick={() => handleChargePointClick(cp.id)}
              >
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="white"
                  _dark={{ bg: 'gray.700' }}
                  shadow="sm"
                  _hover={{ shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  {/* Top */}
                  <Box p={5}>
                    <Flex justify="space-between" align="flex-start">
                      <Heading size="md">{cp.id}</Heading>
                      <HStack spacing={2}>
                        <Circle size="3" bg={statusConfig.color} />
                        <Text fontSize="sm" fontWeight="medium" color={statusConfig.color}>
                          {statusConfig.label}
                        </Text>
                      </HStack>
                    </Flex>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Model: {cp.model}
                    </Text>
                  </Box>

                  {/* Divider */}
                  <Box borderTop="1px solid" borderColor="gray.200" _dark={{ borderColor: 'gray.600' }} />

                  {/* Bottom */}
                  <Flex px={5} py={3} justify="space-between" fontSize="sm" color="gray.500">
                    <Text>
                      {cp.connectors} Connector{cp.connectors !== 1 ? 's' : ''}
                    </Text>
                    <HStack spacing={1}>
                      <MdLocationOn />
                      <Text>{cp.location}</Text>
                    </HStack>
                  </Flex>
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
