import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import fetchData from "../../utils/fetchData";

interface Documento {
  className: string;
  validacao: number;
  probability: number;
  contributingTerms: string[];
}

interface ValidaDocumentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  idProjeto: number;
  idModelo: number;
  idDocumento: number | null;
}

const ValidaDocumentoModal: React.FC<ValidaDocumentoModalProps> = ({
  isOpen,
  onClose,
  idProjeto,
  idModelo,
  idDocumento,
}) => {
  const [data, setData] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(false);
  const [validacoes, setValidacoes] = useState<{ [key: string]: number }>({});
  const toast = useToast();

  // Busca os dados do endpoint
  useEffect(() => {
    if (isOpen && idProjeto && idModelo && idDocumento) {
      const fetchDataForDocument = async () => {
        setLoading(true);
        try {
          // URL do endpoint
          const url = `http://185.137.92.41:3001/documento/documentvalid/${idProjeto}/${idModelo}/${idDocumento}`;

          // Chama a função fetchData
          const response = await fetchData(url, 'get', toast);

          if (response) {
            setData(response);
            // Inicializa o estado das validações
            const initialValidations = response.reduce(
              (acc: Record<string, boolean>, item: any) => ({
                ...acc,
                [item.className]: item.validacao,
              }),
              {}
            );
            setValidacoes(initialValidations);
          }
        } catch (err) {
          console.error("Erro ao buscar dados:", err);
          toast({
            title: "Erro ao carregar dados",
            description: "Verifique sua conexão ou tente novamente mais tarde.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchDataForDocument();
    }
  }, [isOpen, idProjeto, idModelo, idDocumento]);

  // Atualiza a validação localmente
  const handleValidationChange = (className: string, value: number) => {
    setValidacoes((prev) => ({
      ...prev,
      [className]: value,
    }));
  };

  // Envia os dados atualizados para o endpoint com PUT
  const handleSubmit = async () => {
    // URL do endpoint
    const url = `http://185.137.92.41:3001/documento/documentvalid/${idProjeto}/${idModelo}/${idDocumento}`;

    // Corpo da requisição com todos os atributos
    const requestData = data.map((item) => ({
      className: item.className,
      validacao: validacoes[item.className],
      probability: item.probability,
      contributingTerms: item.contributingTerms,
    }));  
    // Fazendo a chamada usando fetchData
    const response = await fetchData(url, 'put', toast, requestData);
  
    // Fecha o modal se a resposta for bem-sucedida
    if (response) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Validação de Documento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Text>Carregando dados...</Text>
          ) : data.length > 0 ? (
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Class Name</Th>
                  <Th>Probabilidade</Th>
                  {/* <Th>Termos Contribuintes</Th> */}
                  <Th>Validação</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item) => (
                  <Tr key={item.className}>
                    <Td>{item.className}</Td>
                    <Td>{item.probability.toFixed(2)}%</Td>
                    {/* <Td>{item.contributingTerms.join(", ")}</Td> */}
                    <Td>
                      <Select
                        value={validacoes[item.className]}
                        onChange={(e) =>
                          handleValidationChange(item.className, parseInt(e.target.value))
                        }
                      >
                        <option value={0}>Não validado</option>
                        <option value={1}>Concordo</option>
                        <option value={2}>Não concordo</option>
                        <option value={3}>Não sei responder</option>
                      </Select>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text>Nenhum dado encontrado.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            OK
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ValidaDocumentoModal;
