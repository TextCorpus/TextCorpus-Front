import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  InputGroup,
  InputLeftElement,
  Stack,
  SlideFade,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Textarea,
  FormErrorMessage,
  useDisclosure,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  AddIcon,
  EditIcon,
  DragHandleIcon,
} from "@chakra-ui/icons";
import { DocumentosService } from "../../services/Documentos/DocumentosService";
import { Documentos } from "../../entity/Documentos/Documentos";
import UserStorage from "../../util/UserStorage";
import GraphVisualization from "../../components/Grafo/GraphVisualization";
import DimensaoModal from "../../components/Dimensao/DimensaoModal";

const ProjectList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [documentos, setDocumentos] = useState<Documentos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [graphUpdateTrigger, setGraphUpdateTrigger] = useState(0);
  const documentsPerPage = 5;
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Documentos | null>(null);
  const [newDocumentData, setNewDocumentData] = useState({
    userId: UserStorage.getUserId(),
    projetoId: Number(id),
    anoPublicacao: "",
    titulo: "",
    discente: "",
    orientador: "",
    resumo: "",
  });
  const [formErrors, setFormErrors] = useState<{
    [key: string]: string;
  }>({});

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const documentosData = await DocumentosService.getByID(Number(id));
        setDocumentos(documentosData.documentos || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar documentos do projeto:", error);
        setIsLoading(false);
      }
    };

    fetchDocumentos();
  }, [id]);


  const navigate = useNavigate();

  const filteredDocumentos = documentos.filter((doc) =>
    (doc.titulo ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredDocumentos.length / documentsPerPage);

  const paginatedDocumentos = filteredDocumentos.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageCount));
  };

  const handleCreateNewDocument = () => {
    setIsCreating(true);
    setIsEditing(false);
    setNewDocumentData({
      userId: UserStorage.getUserId(),
      projetoId: Number(id),
      anoPublicacao: "",
      titulo: "",
      discente: "",
      orientador: "",
      resumo: "",
    });
  };

  const handleEditDocument = (documento: Documentos) => {
    setIsCreating(true);
    setIsEditing(true);
    setCurrentDocument(documento);
    setNewDocumentData({
      userId: UserStorage.getUserId(),
      projetoId: Number(id),
      anoPublicacao:
        documento.anoPublicacao !== undefined
          ? documento.anoPublicacao.toString()
          : "",
      titulo: documento.titulo || "",
      discente: documento.discente || "",
      orientador: documento.orientador || "",
      resumo: documento.resumo || "",
    });
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setIsEditing(false);
    setCurrentDocument(null);
    setFormErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "anoPublicacao" && !/^\d*$/.test(value)) {
      return;
    }

    setNewDocumentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let valid = true;
    const errors: { [key: string]: string } = {};

    if (!newDocumentData.titulo.trim()) {
      errors.titulo = "Título é obrigatório";
      valid = false;
    }

    if (!newDocumentData.anoPublicacao.trim()) {
      errors.anoPublicacao = "Ano de publicação é obrigatório";
      valid = false;
    } else {
      const ano = parseInt(newDocumentData.anoPublicacao);
      const currentYear = new Date().getFullYear();
      if (isNaN(ano) || ano < 1900 || ano > currentYear) {
        errors.anoPublicacao = `Ano de publicação deve estar entre 1900 e ${currentYear}`;
        valid = false;
      }
    }

    setFormErrors(errors);
    return valid;
  };

  const handleCreateDocument = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await DocumentosService.create({
        ...newDocumentData,
        anoPublicacao: parseInt(newDocumentData.anoPublicacao),
      });
      setIsCreating(false);
      const documentosData = await DocumentosService.getByID(Number(id));
      setDocumentos(documentosData.documentos || []);
      setGraphUpdateTrigger(prev => prev + 1); // trigger graph update
    } catch (error) {
      console.error("Erro ao criar documento:", error);
    }
  };

  const handleUpdateDocument = async () => {
    if (!validateForm()) {
      return;
    }

    if (!currentDocument) {
      console.error("Documento atual não está definido para atualização.");
      return;
    }

    try {
      await DocumentosService.update(currentDocument.id_documento || 0, {
        ...newDocumentData,
        anoPublicacao: parseInt(newDocumentData.anoPublicacao),
      });
      setIsCreating(false);
      const documentosData = await DocumentosService.getByID(Number(id));
      setDocumentos(documentosData.documentos || []);
      setGraphUpdateTrigger(prev => prev + 1); // trigger graph update
    } catch (error) {
      console.error("Erro ao atualizar documento:", error);
    }
  };


  const handleViewHistory = () => {
    // Implement the logic for viewing document history here
    console.log("Histórico de Resultados");
  };

  return (
    <Flex
      direction="row"
      align="flex-start"
      justify="flex-start"
      minHeight="100vh"
      padding={4}
      bg="gray.100"
    >
      {/* Lista de Documentos à Esquerda */}
      <Flex
        direction="column"
        width="30%"
        maxWidth="600px"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        padding={4}
        marginBottom={4}
      >
        <Text fontSize="3xl" fontWeight="bold" marginBottom={4} textAlign="center">
          Lista de Documentos
        </Text>
        <SlideFade in offsetY="20px">
          <Box width="100%" bg="white" borderRadius="md" boxShadow="md" padding={4} marginBottom={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
              <Input
                placeholder="Pesquisar por título"
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
        <Flex justify="center" marginBottom={3} width="100%" maxWidth="600">
          <Button
            colorScheme="blue"
            variant="solid"
            onClick={handleCreateNewDocument}
            width="full"
          >
            Novo Documento
          </Button>
          <Button
            ml={2}
            colorScheme="teal"
            variant="solid"
            onClick={() => navigate(`/compara/${id}`)}
            width="full"
          >
            Comparar
          </Button>
          <Button
            ml={2}
            colorScheme="green"
            variant="solid"
            onClick={handleViewHistory}
            width="full"
          >
            Histórico
          </Button>
          <Button
  ml={2}
  colorScheme="purple"
  variant="solid"
  onClick={onOpen} // Abre o modal DimensaoModal
  width="full"
>
  Dimensão
</Button>
        </Flex>
        {isLoading ? (
          <Text>Carregando...</Text>
        ) : (
          <Stack spacing={4} width="100%" maxWidth="600px">
            {paginatedDocumentos.map((documento) => (
              <SlideFade key={documento.id_documento} in offsetY="20px">
                <Box
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                  padding={5}
                  borderWidth="1px"
                  borderColor="gray.200"
                  _hover={{ bg: "gray.50" }}
                  cursor="pointer"
                  position="relative"
                >
                  <Text marginRight={2} fontSize="md" isTruncated>
                    {documento.titulo && documento.titulo.length > 40
                      ? `${documento.titulo.slice(0, 40)}...`
                      : documento.titulo}
                  </Text>
                  <Flex position="absolute" top={4} right={2} >
                    <Button
                      size="sm"
                      onClick={() => setSelectedDocumentId(documento.id_documento || null)}
                      mr={1}
                    >
                      <DragHandleIcon />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEditDocument(documento)}
                    >
                      <EditIcon />
                    </Button>
                  </Flex>
                </Box>
              </SlideFade>
            ))}
          </Stack>
        )}
        <Flex justify="space-between" alignItems="center" marginTop={4}>
          <IconButton
            aria-label="Página anterior"
            icon={<ChevronLeftIcon />}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            colorScheme="blue"
          />
          <Text>
            Página {currentPage} de {pageCount}
          </Text>
          <IconButton
            aria-label="Próxima página"
            icon={<ChevronRightIcon />}
            onClick={handleNextPage}
            disabled={currentPage === pageCount}
            colorScheme="blue"
          />
        </Flex>
      </Flex>
      {/* Visualização de Grafo à Direita */}
      <Flex
        direction="column"
        width="70%"
        marginLeft={4}
      >
        {selectedDocumentId && <GraphVisualization documentId={selectedDocumentId} key={graphUpdateTrigger} />}
      </Flex>
      {/* Modal de Edição/Criação */}
      <Modal isOpen={isCreating} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Editar Documento" : "Novo Documento"}</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired isInvalid={!!formErrors.titulo}>
                <FormLabel>Título</FormLabel>
                <Input
                  name="titulo"
                  value={newDocumentData.titulo}
                  onChange={handleInputChange}
                />
                <FormErrorMessage>{formErrors.titulo}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!formErrors.anoPublicacao}>
                <FormLabel>Ano de Publicação</FormLabel>
                <Input
                  name="anoPublicacao"
                  value={newDocumentData.anoPublicacao}
                  onChange={handleInputChange}
                />
                <FormErrorMessage>{formErrors.anoPublicacao}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Discente</FormLabel>
                <Input
                  name="discente"
                  value={newDocumentData.discente}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Orientador</FormLabel>
                <Input
                  name="orientador"
                  value={newDocumentData.orientador}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Resumo</FormLabel>
                <Textarea
                  name="resumo"
                  height={"300px"}
                  value={newDocumentData.resumo}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={isEditing ? handleUpdateDocument : handleCreateDocument}>
              {isEditing ? "Salvar Alterações" : "Criar Documento"}
            </Button>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <DimensaoModal isOpen={isOpen} onClose={onClose} />

    </Flex>
  );
};

export default ProjectList;
