import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
  useToast,
  Grid,
  GridItem,
  IconButton,
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import fetchData from '../../utils/fetchData';
import ModeloComponent from './ModeloComponent';
import config from '../../config';

interface Modelo {
  id_modelo: number;
  titulo: string;
  descricao: string;
  data_criacao: string;
  data_atualizacao: string;
  classifier: string;
  projeto: {
    id_projeto: number;
  };
}

interface ModelosModalProps {
  isOpen: boolean;
  onClose: () => void;
  id_projeto: number;
}

interface DocumentoModelo {
  id_modelo: number;
  documentos: {
    id_documento: number;
    titulo: string;
    usar: boolean;
  }[];
}

const classifiertypes = [
  'Naive Bayes',
  'Regressão Logística',
  'TFIDF',
  'Máquina de Vetor de Suporte',
  'Hierarchical Agglomerative Clustering (HAC)',
];

const ModelosModal: React.FC<ModelosModalProps> = ({ isOpen, onClose, id_projeto }) => {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedModel, setSelectedModel] = useState<DocumentoModelo | null>(null);
  const [loadingDocuments, setLoadingDocuments] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await fetchData(`${config.apiUrl}/modelos/projeto/${id_projeto}`, 'get', toast);
        setModelos(Array.isArray(response) ? response : []);
      } catch (error) {
        toast({
          title: "Erro ao carregar modelos.",
          description: "Não foi possível obter a lista de modelos.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchModelos();
  }, [id_projeto]);

  useEffect(() => {
    if (!isOpen) {
      // Resetar os estados ao fechar o modal
      //setModelos([]);
      //setIsLoading(true);
      setSelectedModel(null);
      setLoadingDocuments(false);
    }
  }, [isOpen]);


  const handleDocumentosClick = async (id_modelo: number) => {
    setLoadingDocuments(true);
    try {
      const url = `${config.apiUrl}/documento-modelo/${id_projeto}`;
      const metodo = 'post';
      const dados = { id_modelo: id_modelo };
      const response = await fetchData(url, metodo, toast, dados);
      setSelectedModel(response);
    } catch (error) {
      toast({
        title: "Erro ao carregar documentos.",
        description: "Não foi possível obter a lista de documentos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleAddModelDescritor = async (id_modelo: number) => {
    setLoadingDocuments(true);
    const url = `${config.apiUrl}/modelos`;
    const metodo = 'post';
    const dados = { descricao: "Modelo de Classificação Bayesiana", projeto: id_projeto, treinamento: {} };

    const response = await fetchData(url, metodo, toast, dados);
    if (response) {
      setSelectedModel(response);
    }

    setLoadingDocuments(false);
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Lista de Modelos construídos para o descritor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && (
            <Spinner size="xl" />
          )}

          {!isLoading && (
            <Grid templateColumns="40% 59%" gap={4} height="90vh">
              <GridItem
                border="1px solid"
                borderColor="gray.400"
                p={4}
                borderRadius="md"
                height="100%"
                overflowY="auto"
              >
                <Button
                  colorScheme="teal"
                  onClick={() => handleAddModelDescritor(id_projeto)} // Substitua por sua função de clique
                >
                  Adicionar outro modelo ao descritor
                </Button>
                <VStack spacing={4} align="start">
                  {modelos.length > 0 ? (
                    modelos.map((modelo) => (
                      <Box
                        key={modelo.id_modelo}
                        w="100%"
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                        borderRadius="md"
                      >
                        <HStack justify="space-between" mb={4}>
                          <HStack>
                            <IconButton
                              icon={<EditIcon />}
                              aria-label="Editar modelo"
                              size="sm"
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              aria-label="Excluir modelo"
                              size="sm"
                              colorScheme="red"
                            />
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleDocumentosClick(modelo.id_modelo)}
                            >
                              Documentos
                            </Button>
                          </HStack>
                          <Text fontSize="lg" fontWeight="bold" isTruncated>{modelo.titulo}</Text>
                        </HStack>
                        <Stack spacing={2}>
                          <HStack justify="space-between">
                            <Text fontSize="sm" color="gray.500">Criado em: {new Date(modelo.data_criacao).toLocaleDateString()}</Text>
                            <Text fontSize="sm" color="gray.500">Atualizado em: {new Date(modelo.data_atualizacao).toLocaleDateString()}</Text>
                          </HStack>
                          <Text fontSize="sm">
                            Tipo de Classificador: {classifiertypes[parseInt(modelo.classifier, 10) - 1] || "Indefinido"}
                          </Text>
                          <Text fontSize="sm" noOfLines={3}>
                            {modelo.descricao}
                          </Text>
                        </Stack>
                      </Box>
                    ))
                  ) : (
                    <Text>Nenhum modelo encontrado.</Text>
                  )}
                </VStack>
              </GridItem>

              <GridItem
                border="1px solid"
                borderColor="gray.400"
                p={4}
                borderRadius="md"
                height="100%"
                overflowY="auto"
              >
                {loadingDocuments && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    h="60vh"
                  >
                    <Spinner size="xl" />
                  </Box>
                )}

                {!loadingDocuments && selectedModel && (
                  <ModeloComponent
                    id_modelo={selectedModel.id_modelo}
                    documentos={selectedModel.documentos || []}
                  />
                )}

                {!loadingDocuments && !selectedModel && (
                  <Box>Selecione um modelo para visualizar os documentos.</Box>
                )}
              </GridItem>
            </Grid>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModelosModal;
