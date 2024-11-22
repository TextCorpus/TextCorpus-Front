// src/components/Header.tsx
import { Box, Text } from '@chakra-ui/react';

const Header: React.FC = () => {
  return (
    <Box as="header" bg="primary" color="white" p={4} position="fixed" top={0} width="100%" zIndex={1}>
      <Text fontSize="xl" fontWeight="bold" textAlign="center">Sistema ImpactoSociedade.online</Text>
    </Box>
  );
};

export default Header;
