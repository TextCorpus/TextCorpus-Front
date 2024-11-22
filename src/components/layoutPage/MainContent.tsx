// src/components/MainContent.tsx
import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface MainContentProps {
  children: ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <Box as="main" mt="64px" mb="64px" p={4}>
      {children}
    </Box>
  );
};

export default MainContent;
