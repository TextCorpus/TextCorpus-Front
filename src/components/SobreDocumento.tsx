import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Box,
  VStack,
  HStack,
} from '@chakra-ui/react';
import FreqWordsComponent from './words/FreqWordsComponent'; // Seu componente de Frequência de Palavras
import GraphSimilirity from './Graph/GraphSimilarity'; // Componente de Mapa de palavras
import { Word as CloudWord } from 'd3-cloud'; // Renomeia o tipo `Word` como `CloudWord`
import WordCloudComponent from './words/WordCloudComponent'; // Componente de Nuvem de Palavras
import fetchData from '../utils/fetchData';
import { useCustomToast } from '../utils/toastUtils';

interface SobreDocumentoProps {
  id_documento: number;
  titulo: string;
  isOpen: boolean;
  onClose: () => void;
}

interface NodeData {
  id: string;
  label: string;
  count: number;
}

interface EdgeData {
  source: string;
  target: string;
  similarity: number;
}

interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

interface WordData {
  word: string;
  count: number;
}

const SobreDocumento: React.FC<SobreDocumentoProps> = ({ id_documento, titulo, isOpen, onClose }) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [graphDocu, setGraphDocu] = useState<GraphData | null>(null);
  const [graphSema, setGraphSema] = useState<GraphData | null>(null);
  const [freqPalav, setFreqPalav] = useState<WordData[] | null>(null);
  const [nuvePalav, setNuvePalav] = useState<CloudWord[] | null>(null);
  const toast = useCustomToast();

  // Função para buscar as palavras
  const fetchFreqPalavras = async () => {
    try {
      const response: WordData[] = await fetchData(`http://185.137.92.41:3001/documento/freqwords/${id_documento}`, 'get', toast);
      setFreqPalav(response);
    } catch (error) {
      console.error('Erro ao buscar dados de similaridade do grafo:', error);
    }
  };

  // Função para buscar os dados para nuvens de palavras
  const fetchNuvemPalavras = async () => {
    try {
      const response = await fetchData(
        `http://185.137.92.41:3001/documento/WordsCloud/${id_documento}`,
        'get',
        toast
      );
      setNuvePalav(response);
    } catch (error) {
      console.error('Erro ao buscar dados para nuvem de palavras:', error);
    }
  }

    // Função para buscar os dados para o grafo semântico
    const fetchGraphSemantic = async () => {
      try {
        const response = await fetchData(
          `http://185.137.92.41:3001/documento/GraphSemantic/${id_documento}`,
          'get',
          toast
        );
  
        setGraphSema(response);
      } catch (error) {
        console.error('Erro ao buscar dados do grafo semântico:', error);
      }
    };

  // Função para buscar os dados de similaridade do grafo
  const fetchGraphSimilarity = async () => {
    try {
      const response = await fetchData(
        `http://185.137.92.41:3001/documento/GraphSimilarity/${id_documento}`,
        'get',
        toast
      );

      setGraphData(response);
    } catch (error) {
      console.error('Erro ao buscar dados de similaridade do grafo:', error);
    }
  };

  // Função para buscar os dados de similaridade do grafo
  const fetchGraphDocument = async () => {
    // Função convertGraphData como uma const
    const convertGraphData = (response: any): GraphData => {
      // Faz um type assertion (casting) para assegurar o tipo correto dos nodes
      const nodes: NodeData[] = Object.entries(response.graphData.nodes).map(
        ([word, data]) => {
          const nodeData = data as { count: number }; // Casting de 'data'
          return {
            id: word,          // O id será a palavra
            label: word,       // O label também será a palavra
            count: nodeData.count, // O número de ocorrências dessa palavra
          };
        }
      );

      // Converte as arestas para o formato EdgeData[]
      const edges: EdgeData[] = response.graphData.edges.map((edge: any) => ({
        source: edge.source,                     // Origem da aresta
        target: edge.target,                     // Destino da aresta
        similarity: edge.similarity || 1,        // Similaridade (padrão = 1)
      }));

      return { nodes, edges };
    };

    try {
      const response = await fetchData(
        `http://185.137.92.41:3001/documento/graph/${id_documento}`,
        'get',
        toast
      );

      // Usa convertGraphData para processar response.graphData
      setGraphDocu(convertGraphData(response));
    } catch (error) {
      console.error('Erro ao buscar dados de similaridade do grafo:', error);
    }
  };

  // useEffect para limpar dados quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      // Limpa todos os estados quando o modal é fechado
      setSelectedComponent(null);
      setGraphData(null);
      setGraphDocu(null);
      setFreqPalav(null);
      setNuvePalav(null);
      setGraphSema(null);
    }
  }, [isOpen]);

  // useEffect para carregar dados com base no componente selecionado
  useEffect(() => {
    if (isOpen) {
      // Limpa os dados ao mudar o componente selecionado
      setGraphData(null);
      setGraphDocu(null);
      setFreqPalav(null);
      setNuvePalav(null);
      setGraphSema(null);

      // Carrega os dados de acordo com o componente selecionado
      if (selectedComponent === 'Mapa de palavras') {
        fetchGraphSimilarity();
      } else if (selectedComponent === 'Grafo') {
        fetchGraphDocument();
      } else if (selectedComponent === 'Frequência de Palavras') {
        fetchFreqPalavras();
      } else if (selectedComponent === 'Nuvem de Palavras') {
        fetchNuvemPalavras();
      } else if (selectedComponent === 'Grafo semântico') {
        fetchGraphSemantic();
      }
    }
  }, [isOpen, selectedComponent]);

  // Função para renderizar o componente baseado na seleção
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'Grafo':
        if (graphDocu) {
          return <GraphSimilirity graphData={graphDocu} />;
        }
        return <Box>Carregando dados do grafo...</Box>;
      case 'Frequência de Palavras':
        if (freqPalav) {
          return <FreqWordsComponent wordsData={freqPalav} />;
        }
        return <Box>Carregando dados para construçã da frêquencia de palavras...</Box>;
      case 'Mapa de palavras':
        if (graphData) {
          return <GraphSimilirity graphData={graphData} />;
        }
        return <Box>Carregando grafo do mapa de palavras...</Box>;
      case 'Grafo semântico':
        if (graphSema) {
          return <GraphSimilirity graphData={graphSema} />;
        }
        return <Box>Carregando dados para o grafo semântico...</Box>;
      case 'Nuvem de Palavras':
        if (nuvePalav) {
          return <WordCloudComponent words={nuvePalav} />;
        }
        return <Box>Carregando dados para a nuvem de palavras...</Box>;
      default:
        return <Box>Selecione uma opção no menu</Box>; // Mensagem padrão
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dados estatísticos do documento {id_documento} - {titulo}</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding={0}> {/* Removendo o padding para garantir ocupação total */}
          <Box p={6} height="100vh" width="100%">
            <HStack align="start" height="100%">
              {/* Menu à esquerda */}
              <VStack
                spacing={4}
                align="stretch"
                width="250px"
                p={4}
                bg="gray.100"
                borderRight="1px solid"
                borderColor="gray.200"
                height="100%"
              >
                <Button
                  variant="solid"
                  onClick={() => setSelectedComponent('Grafo')}
                >
                  Grafo
                </Button>
                <Button
                  variant="solid"
                  onClick={() => setSelectedComponent('Mapa de palavras')}
                >
                  Mapa de palavras
                </Button>
                <Button
                  variant="solid"
                  onClick={() => setSelectedComponent('Grafo semântico')}
                >
                  Grafo semântico
                </Button>
                <Button
                  variant="solid"
                  onClick={() => setSelectedComponent('Frequência de Palavras')}
                >
                  Frequência de Palavras
                </Button>
                <Button
                  variant="solid"
                  onClick={() => setSelectedComponent('Nuvem de Palavras')}
                >
                  Nuvem de Palavras
                </Button>
              </VStack>

              {/* Área principal para renderizar o componente selecionado */}
              <Box flex="1" p={6} overflowY="auto" height="100%">
                {renderSelectedComponent()}
              </Box>
            </HStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SobreDocumento;
