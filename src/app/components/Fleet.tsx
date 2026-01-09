'use client';

import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Grid,
  Button,
  Input,
  Badge,
  Text,
  Heading,
  Image,
  Icon,
  Separator,
} from '@chakra-ui/react';
import {
  Search,
  Bell,
  Settings,
  Plus,
  Filter,
  MoreVertical,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap,
  Home,
  Truck,
  FileText,
  BarChart3,
} from 'lucide-react';

/* ---------------------------------- Types --------------------------------- */

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: string;
  image: string;
  alt: string;
  vin: string;
  capacity: string;
  motor: string;
  chemistry: string;
  status: string;
  statusColor: string;
  statusIcon: React.ElementType;
  footer: string;
}

/* ----------------------------- Vehicle Card -------------------------------- */

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  const StatusIcon = vehicle.statusIcon;

  return (
    <Box
      bg="white"
      _dark={{ bg: '#16222e', borderColor: '#2a3e52' }}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      overflow="hidden"
      shadow="sm"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
      role="group"
    >
      {/* Image */}
      <Box position="relative" h="180px" overflow="hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.alt}
          w="full"
          h="full"
          objectFit="cover"
          transition="transform 0.4s"
          _groupHover={{ transform: 'scale(1.05)' }}
        />
        <Badge
          position="absolute"
          top="3"
          right="3"
          colorScheme={vehicle.statusColor}
          fontSize="10px"
        >
          {vehicle.status}
        </Badge>
      </Box>

      <VStack align="start" p={4} gap={4}>
        <Flex justify="space-between" w="full">
          <Box>
            <Heading size="md">{vehicle.plate}</Heading>
            <Text fontSize="xs" color="red.500" fontWeight="bold">
              {vehicle.model} • {vehicle.year}
            </Text>
          </Box>
          <Icon as={MoreVertical} cursor="pointer" />
        </Flex>

        <Grid templateColumns="repeat(2, 1fr)" gap="3" w="full" fontSize="xs">
          <Info label="VIN" value={vehicle.vin} />
          <Info label="Capacity" value={vehicle.capacity} />
          <Info label="Motor" value={vehicle.motor} />
          <Info label="Chemistry" value={vehicle.chemistry} />
        </Grid>

        <Separator />

        <Flex justify="space-between" w="full" fontSize="xs">
          <HStack>
            <Icon as={StatusIcon} />
            <Text fontWeight="bold">{vehicle.footer}</Text>
          </HStack>
          <Button variant="ghost" size="xs" colorScheme="red">
            Details →
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <VStack align="start" gap={0}>
    <Text fontSize="10px" fontWeight="bold" color="gray.500">
      {label}
    </Text>
    <Text fontWeight="bold">{value}</Text>
  </VStack>
);

/* ------------------------------- Nav Link ---------------------------------- */

const NavLink = ({
  icon,
  label,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) => (
  <HStack
    px="3"
    py="2.5"
    borderRadius="lg"
    cursor="pointer"
    bg={active ? 'red.50' : 'transparent'}
    color={active ? 'red.500' : 'gray.600'}
    borderRight={active ? '3px solid' : 'none'}
    borderColor="red.500"
    _hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
  >
    <Icon as={icon} boxSize="5" />
    <Text fontWeight={active ? 'bold' : 'medium'}>{label}</Text>
  </HStack>
);

/* ------------------------------ Main Page ---------------------------------- */

export default function FleetVehicleInventory() {
  const [filter, setFilter] = useState<'all' | 'active' | 'maintenance'>('all');

  const vehicles: Vehicle[] = [
    {
      id: '1',
      plate: 'ABC-1234',
      model: 'Tesla Model Y',
      year: '2023',
      image:
        'https://images.unsplash.com/photo-1619767886558-efdc7b4b4a8c',
      alt: 'Tesla Model Y',
      vin: '1N4BL4CV5HC...',
      capacity: '75 kWh',
      motor: 'PMSM (Dual)',
      chemistry: 'LFP',
      status: 'Charging',
      statusColor: 'green',
      statusIcon: Zap,
      footer: 'CP-7722',
    },
    {
      id: '2',
      plate: 'XYZ-5678',
      model: 'Ford F-150 Lightning',
      year: '2023',
      image:
        'https://images.unsplash.com/photo-1617814076231-9f6db30fcd21',
      alt: 'Ford Lightning',
      vin: '5YJ3E1EB4KF...',
      capacity: '131 kWh',
      motor: 'Dual Motor',
      chemistry: 'NMC',
      status: 'Idle',
      statusColor: 'yellow',
      statusIcon: Clock,
      footer: 'Last used 2h ago',
    },
    {
      id: '3',
      plate: 'EV-9900',
      model: 'Rivian EDV 700',
      year: '2023',
      image:
        'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead',
      alt: 'Rivian Van',
      vin: 'KMHC051EA6L...',
      capacity: '100 kWh',
      motor: 'Single Axle',
      chemistry: 'NMC',
      status: 'Offline',
      statusColor: 'gray',
      statusIcon: AlertCircle,
      footer: 'Signal Lost',
    },
    {
      id: '4',
      plate: 'FLT-4421',
      model: 'Hyundai Ioniq 5',
      year: '2023',
      image:
        'https://images.unsplash.com/photo-1619767886558-efdc7b4b4a8c',
      alt: 'Ioniq 5',
      vin: '1N4AZ1CPXKC...',
      capacity: '77.4 kWh',
      motor: 'Synchronous',
      chemistry: 'NMC',
      status: 'Fully Charged',
      statusColor: 'green',
      statusIcon: CheckCircle,
      footer: 'Available',
    },
  ];

  return (
    <Flex h="100vh" bg="gray.50" _dark={{ bg: '#101922' }}>
      {/* Sidebar */}
      <Box
        w="64"
        bg="white"
        _dark={{ bg: '#16222e' }}
        borderRightWidth="1px"
        p="6"
      >
        <HStack mb="8">
          <Box bg="red.500" p="2" borderRadius="lg" color="white">
            <Icon as={Zap} />
          </Box>
          <Box>
            <Heading size="sm">OCPP CSMS</Heading>
            <Text fontSize="xs" color="gray.500">
              Fleet Management
            </Text>
          </Box>
        </HStack>

        <VStack align="stretch" gap={1}>
          <NavLink icon={Home} label="Home" />
          <NavLink icon={Truck} label="Fleets" active />
          <NavLink icon={Zap} label="Charge Points" />
          <NavLink icon={FileText} label="Transactions" />
          <NavLink icon={BarChart3} label="Reports" />
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex="1" overflowY="auto">
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          p="6"
          bg="white"
          _dark={{ bg: '#16222e' }}
          borderBottomWidth="1px"
        >
          <HStack>
            <Heading size="lg">Vehicle Inventory</Heading>
            <Badge colorScheme="red">42 Total</Badge>
          </HStack>

          <HStack>
            <Button variant="ghost">
              <Icon as={Bell} />
            </Button>
            <Button variant="ghost">
              <Icon as={Settings} />
            </Button>
            <Button colorScheme="red" size="sm">
              <Icon as={Plus} />
              Add Vehicle
            </Button>
          </HStack>
        </Flex>

        {/* Filters */}
        <Box p="6">
          <Flex gap="4" flexWrap="wrap" mb="6">
            <Box position="relative" maxW="400px">
              <Input
                placeholder="Search vehicles..."
                bg="gray.50"
                pl="10"
                _focusVisible={{
                  boxShadow:
                    '0 0 0 2px var(--chakra-colors-red-500)',
                }}
              />
              <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" pointerEvents="none">
                <Icon as={Search} color="gray.400" />
              </Box>
            </Box>

            <HStack>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button size="sm" variant="ghost">
                Active
              </Button>
              <Button size="sm" variant="ghost">
                Maintenance
              </Button>
            </HStack>

            <Button size="sm" variant="ghost">
              <Icon as={Filter} />
              More Filters
            </Button>
          </Flex>

          {/* Grid */}
          <Grid
            templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
            gap="6"
          >
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </Grid>
        </Box>
      </Box>
    </Flex>
  );
}
