// src/components/Header.tsx
import { Box, Text } from '@chakra-ui/react';
import config from '../../config';

const Header: React.FC = () => {
  return (
    <Box as="header" bg="primary" color="white" p={4} position="fixed" top={0} width="100%" zIndex={1}>
      <Text fontSize="xl" fontWeight="bold" textAlign="center">{config.systemName}</Text>
    </Box>
  );
};

export default Header;
