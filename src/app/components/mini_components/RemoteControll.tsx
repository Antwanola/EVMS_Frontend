// components/RemoteControl.jsx
import React from "react";
import {
  Box,
  HStack,
  Button,
  Heading,
} from "@chakra-ui/react";
import {
  MdRestartAlt,
  MdUpdate,
} from "react-icons/md";

export const RemoteControl = () => {
  return (
    <Box>
      <Heading size="md" mb={4}>
        Remote Control
      </Heading>
      <HStack spacing={4}>
        <Button
          variant="outline"
          size="md"
          fontWeight="semibold"
        >
          <MdRestartAlt size={16} style={{ marginRight: '8px' }} />
          Reset
        </Button>
        <Button
          variant="outline"
          size="md"
          fontWeight="semibold"
        >
          <MdUpdate size={16} style={{ marginRight: '8px' }} />
          Update Configuration
        </Button>
      </HStack>
    </Box>
  );
};

