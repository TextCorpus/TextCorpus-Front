import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  IconButton,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image
} from '@chakra-ui/react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { ProjetosService } from '../../services/Projetos/ProjetosService'; // Substitua pelo caminho correto
import { Projetos } from '../../entity/Projetos/Projetos'; // Substitua pelo caminho correto
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
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
import { Grid } from '@chakra-ui/react';
import UserStorage from '../../util/UserStorage';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Projetos[]>([]);
  const [selectedProject, setSelectedProject] = useState<Projetos | null>(null); // Estado para o projeto selecionado
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen: isNewModalOpen, onOpen: openNewModal, onClose: closeNewModal } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: openEditModal, onClose: closeEditModal } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: openDeleteModal, onClose: closeDeleteModal } = useDisclosure();
  const projectsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const fetchedProjects = await ProjetosService.get();
      setProjects(fetchedProjects);
      console.log(fetchedProjects);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset pagination when searching
  };

  const handleNewProject = () => {
    setSelectedProject(null); // Reseta o projeto selecionado ao abrir o modal de novo projeto
    openNewModal();
  };

  const handleCreateProject = () => {
    if (!selectedProject) return;

    const newProject = new Projetos({
      titulo: selectedProject?.titulo || '',
      userid: UserStorage.getUserId(),
      ano_inicial: selectedProject?.ano_inicial || 0,
      ano_final: selectedProject?.ano_final || 0,
    });

    ProjetosService.create(newProject)
      .then((createdProject: any) => {
        setProjects([...projects, createdProject]);
        closeNewModal();
      })
      .catch((error: any) => {
        console.error('Erro ao criar projeto:', error);
      });
  };

  const handleEditProject = () => {
    if (!selectedProject) return;

    ProjetosService.update(selectedProject)
      .then((updatedProject: any) => {
        const updatedProjects = projects.map((project) =>
          project.id_projeto === updatedProject.id_projeto ? updatedProject : project
        );
        setProjects(updatedProjects);
        closeEditModal();
      })
      .catch((error: any) => {
        console.error('Erro ao atualizar projeto:', error);
      });
  };

  const handleDeleteProject = (id: number) => {
    ProjetosService.delete(id)
      .then(() => {
        const updatedProjects = projects.filter(project => project.id_projeto !== id);
        setProjects(updatedProjects);
        closeDeleteModal();
      })
      .catch((error: any) => {
        console.error('Erro ao excluir projeto:', error);
      });
  };

  const handleEditClick = (project: Projetos) => {
    setSelectedProject(project);
    openEditModal();
  };

  const handleDeleteClick = (id: number) => {
    setSelectedProject(projects.find(project => project.id_projeto === id) || null);
    openDeleteModal();
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

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
            key={project.id_projeto}
            position="relative"
            borderRadius="md"
            boxShadow="md"
            bg="white"
            p={4}
            onClick={() => navigate(`/lista-projetos/${project.id_projeto}`)}
            style={{ cursor: "pointer" }}
          >
            <Text fontSize="md " color="gray.500">{project.titulo}</Text>
            <Text fontSize="sm" color="gray.500">{project.ano_inicial} - {project.ano_final}</Text>

            <Flex justify="flex-end" position="absolute" top={2} right={2}>
              <IconButton
                aria-label="Editar"
                icon={<Icon as={FaEdit} />}
                mr={2}
                mt={6}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(project);
                }}
                colorScheme="blue"
                variant="ghost"
                _hover={{ color: 'blue.500' }}
              />

            </Flex>     
             <Flex justify="center" mt={4} flexWrap="wrap">
              {odsImages.map((image, index) => (
                <Box key={index} textAlign="center" mr={2} mb={2}>
                  <Image src={image} boxSize="35px" borderRadius="12" mb={1} />
                  <Text fontSize="sm" color="gray.500" mb={1}>
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
      <Modal isOpen={isNewModalOpen} onClose={closeNewModal}>
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md">
          <ModalHeader>Novo Projeto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="titulo" mb={4}>
              <FormLabel>Título do Projeto</FormLabel>
              <Input
                value={selectedProject?.titulo || ''}
                onChange={(e) => setSelectedProject({ ...selectedProject, titulo: e.target.value })}
                placeholder="Título do Projeto"
              />
            </FormControl>
            <FormControl id="ano_inicial" mb={4}>
              <FormLabel>Ano Inicial</FormLabel>
              <Input
                value={selectedProject?.ano_inicial || ''}
                onChange={(e) => setSelectedProject({ ...selectedProject, ano_inicial: Number(e.target.value) })}
                type="number"
                placeholder="Ano Inicial"
              />
            </FormControl>
            <FormControl id="ano_final" mb={4}>
              <FormLabel>Ano Final</FormLabel>
              <Input
                value={selectedProject?.ano_final || ''}
                onChange={(e) => setSelectedProject({ ...selectedProject, ano_final: Number(e.target.value) })}
                type="number"
                placeholder="Ano Final"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateProject}>
              Criar Projeto
            </Button>
            <Button onClick={closeNewModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md">
          <ModalHeader>Editar Projeto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="titulo" mb={4}>
              <FormLabel>Título do Projeto</FormLabel>
              <Input
                value={selectedProject?.titulo || ''}
                onChange={(e) => setSelectedProject({ ...selectedProject, titulo: e.target.value })}
                placeholder="Título do Projeto"
              />
            </FormControl>
            <FormControl id="ano_inicial" mb={4}>
              <FormLabel>Ano Inicial</FormLabel>
              <Input
                value={selectedProject?.ano_inicial || ''}
                onChange={(e) => setSelectedProject({ ...selectedProject, ano_inicial: Number(e.target.value) })}
                type="number"
                placeholder="Ano Inicial"
              />
            </FormControl>
            <FormControl id="ano_final" mb={4}>
              <FormLabel>Ano Final</FormLabel>
              <Input
                value={selectedProject?.ano_final || ''}
                onChange={(e) => setSelectedProject({ ...selectedProject, ano_final: Number(e.target.value) })}
                type="number"
                placeholder="Ano Final"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditProject}>
              Atualizar Projeto
            </Button>
            <Button onClick={closeEditModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md">
          <ModalHeader>Excluir Projeto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Tem certeza que deseja excluir o projeto?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleDeleteProject(selectedProject?.id_projeto || 0)}>
              Excluir
            </Button>
            <Button onClick={closeDeleteModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Projects;
