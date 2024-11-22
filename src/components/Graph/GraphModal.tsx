import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CytoscapeComponent from 'react-cytoscapejs';
import { Box, Spinner, Text, Button } from '@chakra-ui/react';

// Interfaces para o formato dos dados do grafo
interface GraphNode {
  count: number;
}

interface GraphEdge {
  source: string;
  target: string;
}

interface GraphData {
  nodes: { [key: string]: GraphNode };
  edges: GraphEdge[];
}

interface GraphProps {
  id_documento: number;
  titulo: string; 
}

const GraphComponent: React.FC<GraphProps> = ({ id_documento, titulo }) => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const cyRef = useRef<any>(null); // Referência para o componente Cytoscape

  const fetchGraphData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://185.137.92.41:3001/documento/graph/${id_documento}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (JSON.stringify(graphData) !== JSON.stringify(response.data.graphData)) {
        setGraphData(response.data.graphData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar os dados do grafo:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_documento) {
      fetchGraphData();
    }
  }, []);

  const layout = {
    name: 'random',
    padding: 30,
    fit: true,
    animate: true,
    animationDuration: 500,
  };

  const style: cytoscape.Stylesheet[] = [
    {
      selector: 'node',
      style: {
        'background-color': '#3182ce',
        label: 'data(id)',
        color: '#fff',
        shape: 'round-rectangle',
        'text-halign': 'center',
        'text-valign': 'center',
        'padding-left': '10px',
        'padding-right': '10px',
        'padding-top': '5px',
        'padding-bottom': '5px',
        'width': 'label',
        'height': 'label',
        'font-size': '12px',
      },
    },
    {
      selector: 'edge',
      style: {
        width: 3,
        'line-color': '#9f7aea',
        'target-arrow-color': '#9f7aea',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
      },
    },
  ];

  // Função para baixar a imagem do grafo
  const downloadGraphImage = () => {
    if (cyRef.current) {
      const pngData = cyRef.current.png({ scale: 2 }); // Escala a imagem para maior qualidade
      const link = document.createElement('a');
      link.href = pngData;
      link.download = `grafo_${id_documento}.png`;
      link.click();
    }
  };

  return (
    <Box>
      {/* <Text fontSize="xl" mb={4}>Grafo do Texto #{id_documento} - {titulo}</Text> */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Spinner size="xl" />
        </Box>
      ) : graphData ? (
        <Box width="100%" height="600px">
          <CytoscapeComponent
            cy={(cy) => { cyRef.current = cy; }} // Define a referência para o cy
            elements={
              graphData
                ? [
                    // Mapeia os nós
                    ...Object.keys(graphData.nodes).map((key) => ({
                      data: { id: key, label: key },
                    })),
                    // Mapeia as arestas
                    ...graphData.edges.map((edge: { source: string; target: string }) => ({
                      data: { source: edge.source, target: edge.target },
                    })),
                  ]
                : []
            }
            style={{ width: '100%', height: '100%' }}
            layout={layout}
            stylesheet={style}
          />
        </Box>
      ) : (
        <Box textAlign="center" mt={5}>
          <Text fontSize="xl" color="red.500">
            Erro ao carregar os dados do grafo.
          </Text>
        </Box>
      )}
      <Button colorScheme="teal" onClick={downloadGraphImage} mt={4}>
        Baixar Grafo
      </Button>
    </Box>
  );
};

export default GraphComponent;
