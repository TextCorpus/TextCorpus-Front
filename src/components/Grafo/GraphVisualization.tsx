import React, { useEffect } from 'react';
import { Input, Button, Flex, Box, Text } from '@chakra-ui/react';
import cytoscape from 'cytoscape';

interface GraphVisualizationProps {
  documentId: number;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ documentId }) => {
  useEffect(() => {
    const apiUrl = 'http://185.137.92.41:3001/documentos/atrib';

    async function fetchGraphData(id: number, attribute: string) {
      const response = await fetch(`${apiUrl}/${id}/${attribute}`);
      return response.json();
    }

    async function createGraph() {
      try {
        const elements = await fetchGraphData(documentId, 'graphData');

        const cy = cytoscape({
          container: document.getElementById('cy'),
          elements: elements,
          style: [
            {
              selector: 'node',
              style: {
                'shape': 'round-rectangle',
                'background-color': '#0074D9',
                'label': 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center',
                'font-size': '12px',
                'width': 'label',
                'height': 'label',
                'border-width': '2px',
                'border-color': '#0074D9',
                'border-opacity': 1,
                'text-wrap': 'wrap',
                'text-max-width': '100px',
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 2,
                'line-color': '#0074D9',
                'target-arrow-color': '#0074D9',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier'
              }
            }
          ],
          layout: {
            name: 'random',
            padding: 10
          }
        });

        // Adiciona evento de clique no nó
        cy.on('tap', 'node', function(event) {
          const node = event.target;
          const properties = node.data();
          displayNodeProperties(properties);
        });

        // Adiciona evento de busca por baseword
        document.getElementById('search-button-baseword')?.addEventListener('click', function() {
          const query = (document.getElementById('search-input-baseword') as HTMLInputElement).value.toLowerCase();
          searchNodesByAttribute(cy, 'baseWord', query);
        });

        // Adiciona evento de busca por stemmedWord
        document.getElementById('search-button-stemmedword')?.addEventListener('click', function() {
          const query = (document.getElementById('search-input-stemmedword') as HTMLInputElement).value.toLowerCase();
          searchNodesByAttribute(cy, 'stemmedWord', query);
        });

        // Atualiza documentId quando o valor é alterado
        document.getElementById('document-id-input')?.addEventListener('change', function() {
          documentId = parseInt((this as HTMLInputElement).value, 10);
          createGraph();
        });

      } catch (error) {
        console.error('Error creating graph:', error);
      }
    }

    function displayNodeProperties(properties: any) {
      const propertiesDiv = document.getElementById('node-properties');
      if (propertiesDiv) {
        propertiesDiv.innerHTML = '<h3>Node Properties</h3>';
        for (const key in properties) {
          if (properties.hasOwnProperty(key)) {
            propertiesDiv.innerHTML += `<p><strong>${key}:</strong> ${properties[key]}</p>`;
          }
        }
      }
    }

    function searchNodesByAttribute(cy: cytoscape.Core, attribute: string, value: string) {
      cy.nodes().forEach(node => {
        if (node.data(attribute) && node.data(attribute).toLowerCase().includes(value)) {
          node.style('background-color', '#FF4136'); // Vermelho
        } else {
          node.style('background-color', '#0074D9'); // Azul padrão
        }
      });
    }

    createGraph();

    // Cleanup function for useEffect
    return () => {
      // Cleanup code, if any
    };

  }, [documentId]);

  return (
    <Flex>
      <Box id="cy" w="80%" h="100vh"></Box>
      <Box
        id="sidebar"
        w="300px"
        p="4"
        position="fixed"
        right="1rem"
        top="1rem"
        bg="white"
        boxShadow="lg"
        borderRadius="lg"
        overflowY="auto"
        maxH="calc(100vh - 4rem)"
      >
        <Box id="search-form" mb="4">
          <Input type="text" id="search-input-baseword" placeholder="Search by baseword" />
          <Button id="search-button-baseword" mt="2" size="sm">Search</Button>
        </Box>
        <Box id="search-form-stemmed" mb="4">
          <Input type="text" id="search-input-stemmedword" placeholder="Search by stemmedWord" />
          <Button id="search-button-stemmedword" mt="2" size="sm">Search</Button>
        </Box>
        <Box id="node-properties" p="2" border="1px solid #ccc" borderRadius="md" minHeight="100px"></Box>
      </Box>
    </Flex>
  );
};

export default GraphVisualization;
