'use client';

import { Box } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { EVChargeDashboard } from '@/app/components/Dashboard';

export default function DashboardPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  if (!id) {
    return <div>Loading…</div>; 
  }

  return (
    <Box className="container mx-auto" bgColor="gray.400">
      <EVChargeDashboard id={id} />
    </Box>
  );
}
