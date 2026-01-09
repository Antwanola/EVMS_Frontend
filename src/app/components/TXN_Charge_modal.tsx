'use client';

import React, { useEffect, useState } from 'react';
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
import { RiBattery2ChargeLine } from 'react-icons/ri';
import { ocppApi } from '../lib/api';
import { API_BASE_URL } from '@/config/apiConfig';

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
  chargePointId?: string;
  connectorid?: string;
}

export const ChargingSessionModal: React.FC<ChargingSessionModalProps> = ({
  isOpen,
  onClose,
  transactionId,
  chargePointId,
  connectorid
}) => {
  // State for transaction data and real-time meter values
  const [transactionData, setTransactionData] = useState<any>(null);
  const [startSoC, setStartSoC] = useState<string>('--');
  const [stopSoC, setStopSoC] = useState<string | null>(null);
  const [isTransactionCompleted, setIsTransactionCompleted] = useState<boolean>(false);
  const [meterData, setMeterData] = useState({
    meterValue: '',
    voltage: '',
    current: '',
    power: '',
    timestamp: '',
    soc: ''
  });
  const [loading, setLoading] = useState(false);

  // Debug: Log current state values
  console.log('Current state values:', {
    startSoC,
    stopSoC,
    isTransactionCompleted,
    meterDataSoC: meterData.soc,
    hasTransactionData: !!transactionData
  });

  // Fetch transaction data when modal opens
  useEffect(() => {
    if (!isOpen || !transactionId) {
      return;
    }

    const fetchTransactionData = async () => {
      setLoading(true);
      // Reset meter data to empty state but keep startSoC
      setMeterData({
        meterValue: '',
        voltage: '',
        current: '',
        power: '',
        timestamp: '',
        soc: ''
      });
      // Don't reset startSoC here - only reset if we're fetching new transaction
      setStopSoC(null);
      setIsTransactionCompleted(false);

      try {
        const response = await ocppApi.getTransaction(Number(transactionId));
        setTransactionData(response.data);                                                                                                                                                                                                                                     
        
        // Extract startSoC from transaction data
        const transaction = response.data as any; // Type assertion to access dynamic properties
        let initialSoC = '--';
        let finalSoC = null;
        
        console.log("Full transaction:", transaction); // Debug: see full transaction structure
        
        // Check if transaction has startSoC (capital C)
        if (transaction.startSoC !== null && transaction.startSoC !== undefined) {
          initialSoC = `${transaction.startSoC}%`;
          console.log("Found startSoC:", transaction.startSoC);
          setStartSoC(initialSoC);
        } else {
          console.log("No startSoC found in transaction");
          setStartSoC('--');
        }
        
        // Check if transaction is completed (has stopSoC and stopTimestamp)
        if (transaction.stopSoC !== null && transaction.stopSoC !== undefined && transaction.stopTimestamp) {
          finalSoC = `${transaction.stopSoC}%`;
          console.log("Found stopSoC:", transaction.stopSoC, "- Transaction completed");
          setStopSoC(finalSoC);
          setIsTransactionCompleted(true);
          
          // For completed transactions, set the final meter data
          setMeterData({
            meterValue: transaction.meterStop ? `${transaction.meterStop} Wh` : '--',
            voltage: '--', // Not available in transaction data
            current: '--', // Not available in transaction data  
            power: '--', // Not available in transaction data
            timestamp: transaction.stopTimestamp ? new Date(transaction.stopTimestamp).toLocaleTimeString() : '--',
            soc: finalSoC
          });
        }
        
        console.log("Extracted SOC:", initialSoC);
        console.log("Transaction completed:", !!finalSoC, "Final SoC:", finalSoC);
        
      } catch (error) {
        console.error('Failed to fetch transaction data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [isOpen, transactionId]);

  useEffect(() => {
    // Always connect to SSE if we have transaction data and modal is open
    if (!isOpen || !transactionData) {
      console.log('Skipping SSE connection:', { 
        isOpen, 
        hasTransactionData: !!transactionData
      });
      return;
    }

    // Use chargePointId and connectorId from the transaction data
    const txnChargePointId = transactionData.chargePointId;
    const txnConnectorId = transactionData.connectorId;

    if (!txnChargePointId || !txnConnectorId) {
      console.error('Missing chargePointId or connectorId in transaction data');
      return;
    }

    console.log('Connecting to SSE for transaction:', transactionId);
    console.log('Using chargePointId:', txnChargePointId, 'connectorId:', txnConnectorId);
    console.log('Transaction completed status:', isTransactionCompleted);

    // Create EventSource connection using transaction data
    const eventSource = ocppApi.streamMeterValues(txnChargePointId, Number(txnConnectorId));
    
    // Debug: Check EventSource configuration
    console.log('EventSource withCredentials:', eventSource.withCredentials);
    console.log('EventSource URL:', eventSource.url);

    // Handle connection opened
    eventSource.onopen = () => {
      console.log('SSE connection opened successfully');
    };

    // Handle incoming messages
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received meter data:', data);
        
        // Extract values from OCPP sampledValue array
        const sampledValues = data.meterValue?.sampledValue || [];

        // Helper function to get value by measurand
        const getValue = (measurand: string, unit?: string) => {
          const item = sampledValues.find((v: any) => v.measurand === measurand);
          return item ? `${item.value}${unit ? ` ${unit}` : ''}` : '--';
        };

        // Only update meter data if transaction is NOT completed
        // For completed transactions, we want to show the final values from transaction data
        if (!isTransactionCompleted) {
          setMeterData({
            meterValue: getValue('Energy.Active.Import.Register', 'Wh'),
            voltage: getValue('Voltage', 'V'),
            current: getValue('Current.Import', 'A'),
            power: getValue('Power.Active.Import', 'W'),
            timestamp: new Date(data.timestamp).toLocaleTimeString(),
            soc: getValue('SoC', '%') // State of Charge
          });
        }
        
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    // Handle errors with more detailed logging
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      console.error('EventSource readyState:', eventSource.readyState);
      console.error('EventSource URL:', eventSource.url);
       
      // EventSource readyState values:
      // 0 = CONNECTING
      // 1 = OPEN  
      // 2 = CLOSED
      
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('SSE connection was closed');
      } else if (eventSource.readyState === EventSource.CONNECTING) {
        console.log('SSE is trying to reconnect...');
      }
    };

    // Cleanup function - IMPORTANT: close connection when modal closes
    return () => {
      console.log('Closing SSE connection');
      eventSource.close();
    };
  }, [isOpen, transactionData, transactionId]);

  return (
    <Portal>
     {isOpen && (<>
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
              {isTransactionCompleted ? 'Completed' : 'Live'} Charging Session — TXN #{transactionId || 'Loading...'}
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
            {loading ? (
              <Box textAlign="center" py={8}>
                <Text color="gray.500">Loading transaction data...</Text>
              </Box>
            ) : (
            <VStack gap={6} align="stretch">
              {/* Metrics Grid */}
              <Grid
                templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }}
                gap={4}
              >
                <GridItem>
                  <MetricCard label="Meter Value" value={meterData.meterValue} />
                </GridItem>
                <GridItem>
                  <MetricCard label="Voltage" value={meterData.voltage} />
                </GridItem>
                <GridItem>
                  <MetricCard label="Current" value={meterData.current} />
                </GridItem>
                <GridItem>
                  <MetricCard label="Power" value={meterData.power} />
                </GridItem>
                <GridItem colSpan={{ base: 2, md: 1, lg: 1 }}>
                  <MetricCard label="Timestamp" value={meterData.timestamp} />
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
                      <Text>Start: {startSoC || '--'}</Text>
                      <Text color="gray.400">|</Text>
                      <Text>
                        {isTransactionCompleted 
                          ? `Final: ${stopSoC}` 
                          : meterData.soc 
                            ? `Current: ${meterData.soc}` 
                            : 'Current: --'
                        }
                      </Text>
                    </HStack>
                  </Flex>

                  <Flex align="center" gap={4}>
                    <Box fontSize="4xl" color="blue.500">
                      <RiBattery2ChargeLine  />
                    </Box>
                    <Box flex="1">
                      <Progress.Root 
                        value={parseInt(
                          isTransactionCompleted 
                            ? (stopSoC || '0') 
                            : (meterData.soc || '0')
                        ) || 0} 
                        size="lg" 
                        colorPalette={isTransactionCompleted ? "green" : "blue"}
                      >
                        <Progress.Track bg="gray.200" borderRadius="full">
                          <Progress.Range bg={isTransactionCompleted ? "#22c55e" : "#137fec"} />
                        </Progress.Track>
                      </Progress.Root>
                    </Box>
                    <Text 
                      fontWeight="bold" 
                      fontSize="xl" 
                      color={isTransactionCompleted ? "green.500" : "blue.500"} 
                      minW="14" 
                      textAlign="right"
                    >
                      {isTransactionCompleted ? stopSoC : (meterData.soc || '--')}
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
                        {meterData.meterValue}
                      </Text>
                      <Badge
                        bg={isTransactionCompleted ? "green.100" : "blue.100"}
                        color={isTransactionCompleted ? "green.700" : "blue.700"}
                        px={2}
                        py={0.5}
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        {isTransactionCompleted ? 'Completed' : 'Live'}
                      </Badge>
                    </Flex>
                  </Box>

                  {/* <Box minH="220px" py={4}>
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
                  </Box> */}
                </VStack>
              </Box>
            </VStack>
            )}
          </Box>
        </Box>
      </Box>
     </>)}
    </Portal>
  );
};