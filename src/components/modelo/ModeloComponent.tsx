import React, { useState, useEffect } from 'react';
import { Box, HStack, Text, Switch, SimpleGrid } from '@chakra-ui/react';
import fetchData from '../../utils/fetchData';
import { useCustomToast } from '../../utils/toastUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/free-solid-svg-icons';

interface Documento {
  id_documento: number;
  titulo: string;
  usar: boolean;
}

interface ModeloProps {
  id_modelo: number;
  documentos: Documento[];
}

const ModeloComponent: React.FC<ModeloProps> = ({ id_modelo, documentos }) => {
  const [docList, setDocList] = useState<Documento[]>([]);
  const toast = useCustomToast();
  // Atualiza o estado docList quando a prop documentos mudar
  useEffect(() => {
    if (documentos) {
      setDocList(documentos);
    }
  }, [documentos]);

  const handleTreinamentoClick = async () => {
    //setLoadingDocuments(true);
    try {
      const url = `http://185.137.92.41:3001/process/enqueue`;
      const metodo = 'post';
      const dados = {
        "processName": "trainBayesianNetwork",
        "data": {
          "trainingData": id_modelo,
          "parameters": {
            "learningRate": 0.01,
            "iterations": 1000
          }
        },
        "scheduledFor": new Date().toISOString()
      };
      const response = await fetchData(url, metodo, toast, dados);
      //setSelectedModel(response); 
    } catch (error) {
      toast({
        title: "Erro ao carregar documentos.",
        description: "Não foi possível obter a lista de documentos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      //setLoadingDocuments(false);
    }
  };

  const handleToggle = async (id: number) => {
    let xid_documento, xid_modelo, xusar;
    setDocList((prevList) =>
      prevList.map((doc) => {
        if (doc.id_documento === id) {
          xid_documento = doc.id_documento;
          xid_modelo = id_modelo;
          console.log('ID Documento:', doc.id_documento);
          console.log('ID Modelo:', id_modelo);
          console.log('Título:', doc.titulo);
          xusar = !doc.usar;
          return { ...doc, usar: !doc.usar };
        }
        return doc;
      })
    );
    await fetchData(`http://185.137.92.41:3001/documento-modelo/${xid_modelo}/${xid_documento}`, 'patch', toast, { usar: xusar });
  };

  return (
    <Box p={5} w="100%" mx="auto">
      <Box display="flex" h={16}>
        <FontAwesomeIcon
          icon={faServer}
          style={{
            fontSize: '24px',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            backgroundColor: 'teal',
            borderRadius: '5px',
            padding: '5px',
            color: 'white',
          }}
          onClick={handleTreinamentoClick}
          aria-label="Construir treinamento"
        />
        <Text fontSize="2xl" mb={0} ml={2} mr={4} textAlign="center">
          Após a escolha dos descritores inicie o treinamento do Modelo
        </Text>
      </Box>
      <SimpleGrid columns={2} spacing={8} w="100%">
        {docList.length > 0 ? (
          docList.map((documento) => (
            <HStack
              key={documento.id_documento}
              w="100%"
              justify="space-between"
              p={6}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="lg"
              bg="gray.50"
            >
              <Text flex="1">{documento.titulo}</Text>
              <Switch
                isChecked={documento.usar}
                onChange={() => handleToggle(documento.id_documento)}
              />
            </HStack>
          ))
        ) : (
          <Text>Nenhum documento encontrado.</Text>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default ModeloComponent;
