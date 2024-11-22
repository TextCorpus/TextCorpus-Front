import React from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";

const Dashboard: React.FC = () => {
  return (
    <Box p={5}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {/* Painel 1: Weight Matrices */}
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Box bg="gray.50" p={3} borderBottomWidth="1px">
            <Text fontWeight="bold">Modelos</Text>
          </Box>
          <Box p={4}>
            <div id="heatmap-vis"></div>
          </Box>
        </Box>
        {/* Painel 2: Vectors */}
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Box bg="gray.50" p={3} borderBottomWidth="1px">
            <Text fontWeight="bold">Projetos</Text>
          </Box>
          <Box p={4}>
            <div id="scatterplot-vis"></div>
          </Box>
        </Box>
        {/* Painel 3: Vectors */}
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Box bg="gray.50" p={3} borderBottomWidth="1px">
            <Text fontWeight="bold">Processos em execução</Text>
          </Box>
          <Box p={4}>
            <div id="scatterplot-vis"></div>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
