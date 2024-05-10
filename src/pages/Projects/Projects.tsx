import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  Grid,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaCalculator, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

import ods1Image from '../../assets/ods1_pt.png';
import ods2Image from '../../assets/ods2_pt.png';
import ods3Image from '../../assets/ods3_pt.png';
import ods4Image from '../../assets/ods4_pt.png';
import ods5Image from '../../assets/ods5_pt.png';
import ods6Image from '../../assets/ods6_pt.png';
import ods7Image from '../../assets/ods7_pt.png';
import ods8Image from '../../assets/ods8_pt.png';
import ods9Image from '../../assets/ods9_pt.png';
import ods10Image from '../../assets/ods10_pt.png';
import ods11Image from '../../assets/ods11_pt.png';
import ods12Image from '../../assets/ods12_pt.png';
import ods13Image from '../../assets/ods13_pt.png';
import ods14Image from '../../assets/ods14_pt.png';
import ods15Image from '../../assets/ods15_pt.png';
import ods16Image from '../../assets/ods16_pt.png';
import ods17Image from '../../assets/ods17_pt.png';


interface Project {
  id: number;
  year: number;
  title: string;
  discente: string;
  orientador: string;
  resumo: string;
}

const initialProjects: Project[] = [
  { id: 1, year: 2024, title: 'Título do Projeto 1', discente: 'Nome do Discente', orientador: 'Nome do Orientador', resumo: 'Resumo do Projeto 1' },
  { id: 2, year: 2023, title: 'Título do Projeto 2', discente: 'Outro Discente', orientador: 'Outro Orientador', resumo: 'Resumo do Projeto 2' },
  { id: 3, year: 2022, title: 'Título do Projeto 3', discente: 'Discente 3', orientador: 'Orientador 3', resumo: 'Resumo do Projeto 3' },
  // Adicione mais projetos de exemplo aqui
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: openDeleteModal, onClose: closeDeleteModal } = useDisclosure();
  const projectsPerPage = 5; // Número de projetos por página
  const toast = useToast();
  const navigate = useNavigate(); // Utilize useNavigate para navegar entre rotas

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset pagination when searching
  };

  const handleNewProject = () => {
    // Implemente a lógica para criar um novo projeto aqui
    toast({
      title: "Novo Projeto",
      description: "Novo projeto criado com sucesso!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onOpen();
  };

  const handleDeleteProject = (id: number) => {
    // Implemente a lógica para excluir um projeto aqui
    closeDeleteModal();
    toast({
      title: "Projeto Excluído",
      description: "O projeto foi excluído com sucesso!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Array com as imagens dos ODS
  const odsImages = [
    ods1Image,
    ods2Image,
    ods3Image,
    ods4Image,
    ods5Image,
    ods6Image,
    ods7Image,
    ods8Image,
    ods9Image,
    ods10Image,
    ods11Image,
    ods12Image,
    ods13Image,
    ods14Image,
    ods15Image,
    ods16Image,
    ods17Image
  ];

  return (
    <Box p={4} marginLeft={20} borderRadius="md" bg="white.100">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading>Listagem de Projetos</Heading>
        <Flex align="center">
          <Input
            placeholder="Pesquisar por título, ano ou orientador"
            value={searchTerm}
            onChange={handleSearch}
            maxWidth="250px"
            mr={2}
            bg="white"
          />
          <Button
            colorScheme="blue"
            leftIcon={<Icon as={FaPlus} />}
            onClick={handleNewProject}
            bg="blue.400"
            color="white"
            _hover={{ bg: 'blue.500' }}
          >
            Novo Projeto
          </Button>
        </Flex>
      </Flex>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
        {currentProjects.map((project) => (
          <Box
            key={project.id}
            position="relative"
            borderRadius="md"
            boxShadow="md"
            bg="white"
            p={4}
            onClick={() => navigate(`/lista-projetos/${project.id}`)} // Redireciona para o dashboard do projeto
            style={{ cursor: "pointer" }}
          >
            <Image src={odsImages[project.id % odsImages.length]} borderRadius="full" boxSize="50px" objectFit="cover" mb={2} />
            <Text fontSize="lg" fontWeight="bold">{project.title}</Text>
            <Text fontSize="sm" color="gray.500">{project.year}</Text>
            <Flex justify="flex-end" position="absolute" top={2} right={2}>
              <IconButton
                aria-label="Editar"
                icon={<Icon as={FaEdit} />}
                mr={2}
                onClick={(e) => {
                  e.stopPropagation(); // Impedir que o clique no botão de edição propague para o card
                  setSelectedProject(project);
                  onOpen();
                }}
                colorScheme="blue"
                variant="ghost"
                _hover={{ color: 'blue.500' }}
              />
              <IconButton
                aria-label="Excluir"
                icon={<Icon as={FaTrash} />}
                mr={2}
                onClick={(e) => {
                  e.stopPropagation(); // Impedir que o clique no botão de exclusão propague para o card
                  openDeleteModal();
                }}
                colorScheme="red"
                variant="ghost"
                _hover={{ color: 'red.500' }}
              />
              <IconButton
                aria-label="Calcular Similaridade"
                icon={<Icon as={FaCalculator} />}
                colorScheme="teal"
                variant="ghost"
                _hover={{ color: 'teal.500' }}
              />
            </Flex>
            <Flex justify="center" mt={4} flexWrap="wrap">
              {odsImages.map((image, index) => (
                <Box key={index} textAlign="center" mr={2} mb={2}>
                  <Image src={image} boxSize="35px" borderRadius="12" mb={1} />
                  <Text fontSize="sm" color="gray.500" mb={1}>   {/* Estilização do número percentual */}
                    <span style={{ fontSize: '12px', color: 'gray' }}>{Math.floor(Math.random() * 101)}</span>%
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>
        ))}
      </Grid>
      <Flex justify="center" mt={4}>
        {Array.from({ length: Math.ceil(projects.length / projectsPerPage) }).map((_, index) => (
          <Button
            key={index}
            variant={index + 1 === currentPage ? "solid" : "outline"}
            mx={1}
            onClick={() => paginate(index + 1)}
            colorScheme="blue"
            bg="blue.400"
            color="white"
            _hover={{ bg: 'blue.500' }}
          >
            {index + 1}
          </Button>
        ))}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md">
          <ModalHeader>Editar Projeto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>ID do Projeto: {selectedProject?.id}</Text>
            <Input value={selectedProject?.title} placeholder="Título" mb={4} />
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose} colorScheme="gray">
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md">
          <ModalHeader>Excluir Projeto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Tem certeza de que deseja excluir este projeto?
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={closeDeleteModal} colorScheme="gray">
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={() => handleDeleteProject(1)}>
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Projects;
