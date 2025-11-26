'use client';

import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  Flex,
  VStack,
  HStack,
  Badge,
  Progress,
  Portal,
} from '@chakra-ui/react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogBackdrop,
  DialogCloseTrigger,
} from '@chakra-ui/react';
import { RiBattery2ChargeLine, RiBatteryChargeLine } from 'react-icons/ri';

interface MetricCardProps {
  label: string;
  value: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value }) => {
  return (
    <Box bg="gray.100" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
      <VStack align="stretch" gap={2}>
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          {label}
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="gray.900">
          {value}
        </Text>
      </VStack>
    </Box>
  );
};

interface ChargingSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId?: string;
}

export const ChargingSessionModal: React.FC<ChargingSessionModalProps> = ({
  isOpen,
  onClose,
  transactionId,
}) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        inset="0"
        zIndex={1400}
        bg="blackAlpha.600"
        backdropFilter="blur(4px)"
        onClick={onClose}
      />
      <Box
        position="fixed"
        inset="0"
        zIndex={1500}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
        pointerEvents="none"
      >
        <Box
          maxW="4xl"
          w="full"
          maxH="90vh"
          overflowY="auto"
          bg="white"
          borderRadius="xl"
          boxShadow="2xl"
          pointerEvents="auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Flex
            justify="space-between"
            align="center"
            p={6}
            borderBottom="1px"
            borderColor="gray.200"
          >
            <Text fontSize="lg" fontWeight="semibold" color="gray.900">
              Live Charging Session — TXN #{transactionId || '123456'}
            </Text>
            <Box
              as="button"
              onClick={onClose}
              w={8}
              h={8}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              bg="gray.100"
              color="gray.600"
              _hover={{ bg: 'gray.200' }}
              cursor="pointer"
            >
              ✕
            </Box>
          </Flex>

          {/* Body */}
          <Box p={6}>
            <VStack gap={6} align="stretch">
              {/* Metrics Grid */}
              <Grid
                templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }}
                gap={4}
              >
                <GridItem>
                  <MetricCard label="Meter Value" value="15.3 kWh" />
                </GridItem>
                <GridItem>
                  <MetricCard label="Voltage" value="240 V" />
                </GridItem>
                <GridItem>
                  <MetricCard label="Current" value="32 A" />
                </GridItem>
                <GridItem>
                  <MetricCard label="Power" value="7.6 kW" />
                </GridItem>
                <GridItem colSpan={{ base: 2, md: 1, lg: 1 }}>
                  <MetricCard label="Timestamp" value="14:32:05" />
                </GridItem>
              </Grid>

              {/* State of Charge */}
              <Box bg="gray.100" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
                <VStack gap={4} align="stretch">
                  <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    justify="space-between"
                    align={{ base: 'flex-start', sm: 'center' }}
                    gap={2}
                  >
                    <Text fontWeight="medium" color="gray.900">
                      Vehicle State of Charge (SoC)
                    </Text>
                    <HStack gap={2} fontSize="sm" color="gray.600">
                      <Text>Start: 22%</Text>
                      <Text color="gray.400">|</Text>
                      <Text>Current: 45%</Text>
                    </HStack>
                  </Flex>

                  <Flex align="center" gap={4}>
                    <Box fontSize="4xl" color="blue.500">
                      {/* ⚡ */}
                      <RiBattery2ChargeLine  />
                    </Box>
                    <Box flex="1">
                      <Progress.Root value={45} size="lg" colorPalette="blue">
                        <Progress.Track bg="gray.200" borderRadius="full">
                          <Progress.Range bg="#137fec" />
                        </Progress.Track>
                      </Progress.Root>
                    </Box>
                    <Text fontWeight="bold" fontSize="xl" color="blue.500" minW="14" textAlign="right">
                      45%
                    </Text>
                  </Flex>
                </VStack>
              </Box>

              {/* Energy Chart */}
              <Box bg="gray.100" p={4} pt={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
                <VStack gap={2} align="stretch">
                  <Box px={2}>
                    <Text fontWeight="medium" color="gray.900" mb={1}>
                      Energy Delivered Over Time
                    </Text>
                    <Flex align="center" gap={2}>
                      <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                        15.3 kWh
                      </Text>
                      <Badge
                        bg="green.100"
                        color="green.700"
                        px={2}
                        py={0.5}
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        +2.1%
                      </Badge>
                    </Flex>
                  </Box>

                  <Box minH="220px" py={4}>
                    <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%">
                      <path
                        d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                        fill="url(#paint0_linear_chart)"
                      />
                      <path
                        d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                        stroke="#137fec"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      <defs>
                        <linearGradient id="paint0_linear_chart" x1="236" x2="236" y1="1" y2="149" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#137fec" stopOpacity="0.2" />
                          <stop offset="1" stopColor="#137fec" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <Flex justify="space-between" px={2} mt={4}>
                      {['14:30', '14:31', '14:32', '14:33', '14:34', '14:35', '14:36'].map((time) => (
                        <Text key={time} fontSize="xs" fontWeight="medium" color="gray.500">
                          {time}
                        </Text>
                      ))}
                    </Flex>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Box>
    </Portal>
  );
};