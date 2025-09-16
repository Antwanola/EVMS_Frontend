import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import LoginPage from '../components/Login_page';

export default function Login() {
  return (
    <Box  display={'flex'} justifyItems={'center'}>
     <LoginPage/>
    </Box>
  )
}
