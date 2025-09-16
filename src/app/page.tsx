"use client";

import Layout from "./components/Layout";
import { Heading, SimpleGrid, Box, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Layout>
      <Heading size="lg" mb={6} color="black">
        Welcome to EVMS 🚀
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        <Box bg="teal.500" color="white" p={6} rounded="lg" shadow="md">
          <Text fontSize="xl" fontWeight="bold">
            Vehicles
          </Text>
          <Text mt={2}>Monitor and manage vehicle status.</Text>
        </Box>
        <Box bg="purple.500" color="white" p={6} rounded="lg" shadow="md">
          <Text fontSize="xl" fontWeight="bold">
            Reports
          </Text>
          <Text mt={2}>View performance and analytics.</Text>
        </Box>
        <Box bg="orange.500" color="white" p={6} rounded="lg" shadow="md">
          <Text fontSize="xl" fontWeight="bold">
            Users
          </Text>
          <Text mt={2}>Manage drivers and customers.</Text>
        </Box>
      </SimpleGrid>
    </Layout>
  );
}
