import React, { useState } from "react";
import { Box, Flex, Text, Input, IconButton, InputGroup, InputLeftElement, Spacer, Stack, SlideFade } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

interface Project {
  id: number;
  name: string;
}

const projects: Project[] = [
  { id: 1, name: "Projeto 1" },
  { id: 2, name: "Projeto 2" },
  { id: 3, name: "Projeto 3" },
  { id: 4, name: "Projeto 4" },
  { id: 5, name: "Projeto 5" },
  { id: 6, name: "Projeto 6" },
  { id: 7, name: "Projeto 7" },
  { id: 8, name: "Projeto 8" },
  { id: 9, name: "Projeto 9" },
  { id: 10, name: "Projeto 10" },
  // Adicione mais projetos se desejar
];

const ProjectList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredProjects.length / projectsPerPage);

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageCount));
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minHeight="100vh"
      padding={4}
      bg="gray.100"
    >
      <Text fontSize="3xl" fontWeight="bold" marginBottom={4} textAlign="center">
        Lista de Projetos
      </Text>
      <SlideFade in offsetY="20px">
        <Box
          width="100%"
          maxWidth="600px"
          bg="white"
          borderRadius="md"
          boxShadow="md"
          padding={4}
          marginBottom={4}
        >
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              placeholder="Pesquisar por título, ano ou orientador"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              borderRadius="md"
              border="1px"
              borderColor="gray.200"
              _focus={{
                borderColor: "blue.300",
                boxShadow: "0 0 0 1px #3182ce",
              }}
              _placeholder={{ color: "gray.400" }}
            />
          </InputGroup>
        </Box>
      </SlideFade>
      <Stack spacing={4} width="100%" maxWidth="600px">
        {paginatedProjects.map((project) => (
          <SlideFade key={project.id} in offsetY="20px">
            <Link to={`/dashboard/${project.id}`} style={{ textDecoration: "none" }}>
              <Box
                bg="white"
                borderRadius="md"
                boxShadow="md"
                padding={4}
                borderWidth="1px"
                borderColor="gray.200"
                _hover={{ bg: "gray.50" }}
                cursor="pointer"
              >
                <Text fontSize="xl">{project.name}</Text>
              </Box>
            </Link>
          </SlideFade>
        ))}
      </Stack>
      <Flex align="center" justify="center" marginTop={4}>
        <IconButton
          aria-label="Página Anterior"
          icon={<ChevronLeftIcon />}
          onClick={handlePreviousPage}
          isDisabled={currentPage === 1}
          colorScheme="blue"
          bg="blue.400"
          color="white"
          _hover={{ bg: 'blue.500' }}
          mr={2}
        />
        {[...Array(pageCount)].map((_, index) => (
          <IconButton
            key={index}
            variant={index + 1 === currentPage ? "solid" : "outline"}
            mx={1}
            onClick={() => setCurrentPage(index + 1)}
            colorScheme="blue"
            bg="blue.400"
            color="white"
            _hover={{ bg: 'blue.500' }}
            aria-label={`Página ${index + 1}`}
            icon={<Text>{index + 1}</Text>}
          />
        ))}
        <IconButton
          aria-label="Próxima Página"
          icon={<ChevronRightIcon />}
          onClick={handleNextPage}
          isDisabled={currentPage === pageCount}
          colorScheme="blue"
          bg="blue.400"
          color="white"
          _hover={{ bg: 'blue.500' }}
          ml={2}
        />
      </Flex>
    </Flex>
  );
};

export default ProjectList;
