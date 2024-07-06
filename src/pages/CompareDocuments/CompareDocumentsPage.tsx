import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SlideFade,
  Box,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import { DocumentosService } from "../../services/Documentos/DocumentosService";
import CompareDocuments from "./CompareDocuments";
import { Documentos } from "../../entity/Documentos/Documentos";
import CompareDocumentsModal from "./CompareDocumentsModal";

const CompareDocumentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [documentos, setDocumentos] = useState<Documentos[]>([]);
  const [filteredDocumentos, setFilteredDocumentos] = useState<Documentos[]>([]);
  const [selectedDocumentsLeft, setSelectedDocumentsLeft] = useState<Set<number>>(new Set());
  const [selectedDocumentsRight, setSelectedDocumentsRight] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageLeft, setCurrentPageLeft] = useState(1);
  const [currentPageRight, setCurrentPageRight] = useState(1);
  const [compareData, setCompareData] = useState<any>(null); // Estado para armazenar dados de comparação

  const { isOpen, onOpen, onClose } = useDisclosure();

  const documentsPerPage = 5;

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const documentosData = await DocumentosService.getByID(Number(id));
        setDocumentos(documentosData.documentos || []);
        setFilteredDocumentos(documentosData.documentos || []);
      } catch (error) {
        console.error("Erro ao buscar documentos do projeto:", error);
      }
    };

    fetchDocumentos();
  }, [id]);

  useEffect(() => {
    const filtered = documentos.filter((documento) =>
      (documento.titulo ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocumentos(filtered);
  }, [documentos, searchTerm]);

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectDocumentLeft = (documentId: number) => {
    const newSelectedLeft = new Set(selectedDocumentsLeft);
    if (newSelectedLeft.has(documentId)) {
      newSelectedLeft.delete(documentId);
    } else {
      newSelectedLeft.add(documentId);
    }
    setSelectedDocumentsLeft(newSelectedLeft);

    // Disable corresponding document on the right side
    const newSelectedRight = new Set(selectedDocumentsRight);
    if (newSelectedLeft.has(documentId)) {
      newSelectedRight.delete(documentId);
    }
    setSelectedDocumentsRight(newSelectedRight);
  };

  const handleSelectDocumentRight = (documentId: number) => {
    const newSelectedRight = new Set(selectedDocumentsRight);
    if (newSelectedRight.has(documentId)) {
      newSelectedRight.delete(documentId);
    } else {
      newSelectedRight.add(documentId);
    }
    setSelectedDocumentsRight(newSelectedRight);

    // Disable corresponding document on the left side
    const newSelectedLeft = new Set(selectedDocumentsLeft);
    if (newSelectedRight.has(documentId)) {
      newSelectedLeft.delete(documentId);
    }
    setSelectedDocumentsLeft(newSelectedLeft);
  };

  const handlePreviousPageLeft = () => {
    setCurrentPageLeft((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPageLeft = () => {
    setCurrentPageLeft((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredDocumentos.length / documentsPerPage))
    );
  };

  const handlePreviousPageRight = () => {
    setCurrentPageRight((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPageRight = () => {
    setCurrentPageRight((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredDocumentos.length / documentsPerPage))
    );
  };

  const handleCompareDocuments = () => {
    const selectedLeftArray = Array.from(selectedDocumentsLeft);
    const selectedRightArray = Array.from(selectedDocumentsRight);
  
    const compareData = {
      id_projeto: Number(id),
      documentos: {
        doc: selectedLeftArray.map((id_documento) => ({ id_documento })),
        compara: selectedRightArray.map((id_documento) => ({ id_documento })),
      },
    };
  
    setCompareData(compareData);
    onOpen();
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
      <Flex width="100%" justify="space-around">
        {/* Lista de Documentos à Esquerda */}
        <Flex
          direction="column"
          width="45%"
          maxWidth="600px"
          bg="white"
          borderRadius="md"
          boxShadow="md"
          padding={4}
          marginBottom={4}
        >
          <Text fontSize="3xl" fontWeight="bold" marginBottom={4} textAlign="center">
            Documentos
          </Text>
          <SlideFade in offsetY="20px">
            <Box
              width="100%"
              bg="white"
              borderRadius="md"
              boxShadow="md"
              padding={4}
              marginBottom={4}
            >
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
                <Input
                  placeholder="Pesquisar por título"
                  value={searchTerm}
                  onChange={handleSearchTermChange}
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
          <CompareDocuments
            documentos={filteredDocumentos.slice(
              (currentPageLeft - 1) * documentsPerPage,
              currentPageLeft * documentsPerPage
            )}
            onSelectDocument={handleSelectDocumentLeft}
            selectedDocuments={selectedDocumentsLeft}
            side="left"
          />
          <Flex justify="space-between" alignItems="center" marginTop={4}>
            <IconButton
              aria-label="Página anterior"
              icon={<ChevronLeftIcon />}
              onClick={handlePreviousPageLeft}
              disabled={currentPageLeft === 1}
              colorScheme="blue"
            />
            <Text>
              Página {currentPageLeft} de{" "}
              {Math.ceil(filteredDocumentos.length / documentsPerPage)}
            </Text>
            <IconButton
              aria-label="Próxima página"
              icon={<ChevronRightIcon />}
              onClick={handleNextPageLeft}
              disabled={
                currentPageLeft === Math.ceil(filteredDocumentos.length / documentsPerPage)
              }
              colorScheme="blue"
            />
          </Flex>
        </Flex>
        {/* Lista de Documentos à Direita */}
        <Flex
          direction="column"
          width="45%"
          maxWidth="600px"
          bg="white"
          borderRadius="md"
          boxShadow="md"
          padding={4}
          marginBottom={4}
        >
          <Text fontSize="3xl" fontWeight="bold" marginBottom={4} textAlign="center">
            Comparar
          </Text>
          <SlideFade in offsetY="20px">
            <Box
              width="100%"
              bg="white"
              borderRadius="md"
              boxShadow="md"
              padding={4}
              marginBottom={4}
            >
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
                <Input
                  placeholder="Pesquisar por título"
                  value={searchTerm}
                  onChange={handleSearchTermChange}
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
          <CompareDocuments
            documentos={filteredDocumentos.slice(
              (currentPageRight - 1) * documentsPerPage,
              currentPageRight * documentsPerPage
            )}
            onSelectDocument={handleSelectDocumentRight}
            selectedDocuments={selectedDocumentsRight}
            side="right"
          />
          <Flex justify="space-between" alignItems="center" marginTop={4}>
            <IconButton
              aria-label="Página anterior"
              icon={<ChevronLeftIcon />}
              onClick={handlePreviousPageRight}
              disabled={currentPageRight === 1}
              colorScheme="blue"
            />
            <Text>
              Página {currentPageRight} de{" "}
              {Math.ceil(filteredDocumentos.length / documentsPerPage)}
            </Text>
            <IconButton
              aria-label="Próxima página"
              icon={<ChevronRightIcon />}
              onClick={handleNextPageRight}
              disabled={
                currentPageRight === Math.ceil(filteredDocumentos.length / documentsPerPage)
              }
              colorScheme="blue"
            />
          </Flex>
        </Flex>
      </Flex>
      <Button
        onClick={handleCompareDocuments}
        colorScheme="blue"
        size="lg"
        disabled={selectedDocumentsLeft.size === 0 || selectedDocumentsRight.size === 0}
      >
        Comparar Documentos
      </Button>
      {compareData && (
        <CompareDocumentsModal isOpen={isOpen} onClose={onClose} compareData={compareData} />
      )}
    </Flex>
  );
};

export default CompareDocumentsPage;
