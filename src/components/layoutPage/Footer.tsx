// src/components/Footer.tsx
import { Box, Text } from '@chakra-ui/react';

const Footer: React.FC = () => {
  return (
    <Box as="footer" bg="primary" color="white" p={4} position="fixed" bottom={0} width="100%">
      <Text fontSize="sm">© 2024 Ferramenta de Análise de Texto</Text>
    </Box>
  );
};

export default Footer;
