"use client";

import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { forwardRef } from "react";

// Create a properly typed MotionBox using asChild pattern
export const MotionBox = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Box> & React.ComponentProps<typeof motion.div>
>((props, ref) => {
  return (
    <Box asChild {...props} ref={ref}>
      <motion.div />
    </Box>
  );
});

MotionBox.displayName = "MotionBox";