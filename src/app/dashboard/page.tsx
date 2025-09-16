import { Metadata } from 'next';
import { EVChargeDashboard } from "../components/dashboard/Dashboard"
import { Sidebar } from '../components/mini_components/SideBar';
import { Box } from '@chakra-ui/react';


export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard page',
};
export default function DashboardPage() {
  return (
    <Box className="container mx-auto" bgColor={'gray.400'} >
      <EVChargeDashboard/>
      {/* <Sidebar /> */}
    </Box>
  );
}