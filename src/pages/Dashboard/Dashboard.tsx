import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Flex, Grid, GridItem, Stat, StatLabel, StatNumber, StatHelpText, CircularProgress, CircularProgressLabel, Stack, Divider, Badge } from '@chakra-ui/react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Dashboard: React.FC = () => {
  const { projectId } = useParams<Record<string, string>>();

  // Simulação dos detalhes do projeto
  const projectDetails = {
    title: 'Título do Projeto',
    year: 2024,
    discente: 'Nome do Discente',
    orientador: 'Nome do Orientador',
    resumo: 'Resumo do Projeto Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.',
    // Outros detalhes do projeto...
  };

  // Dados de exemplo para gráficos
  const barChartData = [
    { name: 'Janeiro', value: 65 },
    { name: 'Fevereiro', value: 59 },
    { name: 'Março', value: 80 },
    { name: 'Abril', value: 81 },
    { name: 'Maio', value: 56 },
    { name: 'Junho', value: 55 },
  ];

  const pieChartData = [
    { name: 'Red', value: 12 },
    { name: 'Blue', value: 19 },
    { name: 'Yellow', value: 3 },
    { name: 'Green', value: 5 },
    { name: 'Purple', value: 2 },
    { name: 'Orange', value: 3 },
  ];

  const lineChartData = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <Box p={8} mx="auto" maxWidth="1200px">
      <Flex mb={8} justifyContent="space-between" alignItems="center">
        <Heading>{projectDetails.title}</Heading>
        <Badge colorScheme="green">Projeto {projectDetails.year}</Badge>
      </Flex>
      <Divider mb={8} />

      <Grid templateColumns="repeat(3, 1fr)" gap={8}>
        <GridItem>
          <Box p={6} boxShadow="md" borderRadius="md">
            <Heading size="md" mb={4}>Detalhes do Projeto</Heading>
            <Text><strong>Discente:</strong> {projectDetails.discente}</Text>
            <Text><strong>Orientador:</strong> {projectDetails.orientador}</Text>
            <Text mt={4}>{projectDetails.resumo}</Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box p={6} boxShadow="md" borderRadius="md">
            <Heading size="md" mb={4}>Progresso do Projeto</Heading>
            <Stack spacing={4}>
              <Stat>
                <StatLabel>Tarefas Concluídas</StatLabel>
                <StatNumber>75%</StatNumber>
                <StatHelpText>35/50</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Tempo Restante</StatLabel>
                <StatNumber>28 dias</StatNumber>
              </Stat>
            </Stack>
          </Box>
        </GridItem>
        <GridItem>
          <Box p={6} boxShadow="md" borderRadius="md">
            <Heading size="md" mb={4}>Investimento</Heading>
            <Flex justifyContent="center" alignItems="center">
              <CircularProgress value={75} size="120px" thickness="8px" color="blue.400">
                <CircularProgressLabel>75%</CircularProgressLabel>
              </CircularProgress>
            </Flex>
            <Text mt={4}>Concluído</Text>
          </Box>
        </GridItem>
      </Grid>

      <Box mt={12}>
        <Heading size="lg" mb={4}>Estatísticas</Heading>
        <Flex justifyContent="space-between">
          <Box flex="1" p={6} boxShadow="md" borderRadius="md">
            <Heading size="md" mb={4}>Gráfico de Barra</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <Bar dataKey="value" fill="#69b4ff" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box flex="1" p={6} boxShadow="md" borderRadius="md">
            <Heading size="md" mb={4}>Gráfico de Pizza</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#69b4ff"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Flex>
      </Box>

      <Box mt={12}>
        <Heading size="lg" mb={4}>Tendência</Heading>
        <Box p={6} boxShadow="md" borderRadius="md">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pv" stroke="#8884d8" />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
