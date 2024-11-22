import React, { useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import { Box, Select, VStack } from '@chakra-ui/react';

interface NodeData {
    id: string;
    label: string;
    count: number;
}

interface EdgeData {
    source: string;
    target: string;
    similarity: number | string; // Pode ser número ou string
}

interface GraphData {
    nodes: NodeData[];
    edges: EdgeData[];
}

interface GraphSimilarityProps {
    graphData: GraphData;
}

const GraphSimilarity: React.FC<GraphSimilarityProps> = ({ graphData }) => {
    const [isFiltered, setIsFiltered] = useState(false);
    const [selectedWord, setSelectedWord] = useState('');
    const [cyInstance, setCyInstance] = useState<cytoscape.Core | null>(null);
    const [clickedEdgesIds, setClickedEdgesIds] = useState<string[]>([]); // Armazena os IDs de todas as arestas clicadas
    const [similarityType, setSimilarityType] = useState<'number' | 'string'>('number'); // Estado para alternar entre número e string

    if (!graphData) {
        return <p>Loading...</p>;
    }

    const sortedNodes = graphData.nodes.sort((a, b) => a.label.localeCompare(b.label));

    const elements = [
        ...graphData.nodes.map((node) => ({
            data: { id: node.id, label: node.label },
        })),
        ...graphData.edges.map((edge) => ({
            data: {
                id: `${edge.source}-${edge.target}`, // Definir um id único para cada aresta
                source: edge.source,
                target: edge.target,
                label: similarityType === 'number' ? `${Number(edge.similarity).toFixed(2)}` : `Sim: ${edge.similarity}`, // Similaridade como rótulo
            },
        })),
    ];

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
                'label': 'data(id)',
                'color': '#fff',
                'shape': 'round-rectangle',
                'text-halign': 'center',
                'text-valign': 'center',
                'padding-left': '10px',
                'padding-right': '10px',
                'padding-top': '5px',
                'padding-bottom': '5px',
                'width': (ele: cytoscape.NodeSingular) => `${ele.data('label').length * 8}px`,
                'height': '30px',
                'font-size': '12px',
            },
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#9f7aea',
                'target-arrow-color': '#9f7aea',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'label': (ele: cytoscape.EdgeSingular) => clickedEdgesIds.includes(ele.id()) ? ele.data('label') : '', // Exibe o rótulo apenas se a aresta foi clicada
                'font-size': '12px',
                'color': '#000000',
                'text-background-color': '#ffffff',
                'text-background-opacity': 1,
                'text-background-padding': '2px',
                'text-border-color': '#000',
                'text-border-width': 1,
                'text-border-opacity': 1,
            },
        },
        {
            selector: '.highlighted',
            style: {
                'background-color': '#f39c12',
                'line-color': '#f39c12',
                'target-arrow-color': '#f39c12',
                'source-arrow-color': '#f39c12',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': 500,
            },
        },
        {
            selector: '.clicked-node',
            style: {
                'background-color': '#e74c3c',
                'line-color': '#e74c3c',
                'target-arrow-color': '#e74c3c',
                'source-arrow-color': '#e74c3c',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': 500,
            },
        },
    ];

    const handleNodeClick = (cy: cytoscape.Core, nodeId: string) => {
        if (isFiltered) {
            cy.elements().removeClass('highlighted clicked-node clicked-edge').style('display', 'element');
            setIsFiltered(false);
        } else {
            const node = cy.getElementById(nodeId);
            cy.elements().removeClass('highlighted clicked-node clicked-edge').style('display', 'element');

            node.addClass('clicked-node');
            const outgoingEdges = node.outgoers('edge');
            const connectedNodes = outgoingEdges.targets();

            outgoingEdges.addClass('clicked-edge');
            connectedNodes.addClass('highlighted');

            cy.nodes().not(node).not(connectedNodes).style('display', 'none');
            cy.edges().not(outgoingEdges).style('display', 'none');

            setIsFiltered(true);
        }
    };

    const handleEdgeClick = (cy: cytoscape.Core, edgeId: string) => {
        setClickedEdgesIds((prevClickedEdges) =>
            prevClickedEdges.includes(edgeId)
                ? prevClickedEdges.filter(id => id !== edgeId) // Remove a aresta se já foi clicada
                : [...prevClickedEdges, edgeId] // Adiciona a aresta se não foi clicada ainda
        );
        cy.style().update(); // Atualiza o estilo para refletir o novo estado
    };

    const handleWordSelect = (word: string) => {
        setSelectedWord(word);
        if (cyInstance) {
            handleNodeClick(cyInstance, word);
        }
    };

    const handleSimilarityTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSimilarityType(e.target.value as 'number' | 'string');
    };

    return (
        <VStack spacing={4}>
            <Select
                placeholder="Selecione uma palavra"
                onChange={(e) => handleWordSelect(e.target.value)}
                value={selectedWord}
            >
                {sortedNodes.map((node) => (
                    <option key={node.id} value={node.id}>
                        {node.label}
                    </option>
                ))}
            </Select>

            <Select
                placeholder="Selecione o tipo de Similaridade"
                onChange={handleSimilarityTypeChange}
                value={similarityType}
            >
                <option value="number">Numérica</option>
                <option value="string">String</option>
            </Select>

            <Box height="600px" width="100%">
                <CytoscapeComponent
                    elements={elements}
                    style={{ width: '100%', height: '100%' }}
                    layout={layout}
                    stylesheet={style}
                    cy={(cy) => {
                        setCyInstance(cy); // Armazena a instância do Cytoscape para manipulação posterior
                        cy.on('tap', 'node', (event) => {
                            const nodeId = event.target.id();
                            handleNodeClick(cy, nodeId);
                        });

                        cy.on('tap', 'edge', (event) => {
                            const edgeId = event.target.id();
                            handleEdgeClick(cy, edgeId); // Atualiza o estilo da aresta clicada
                        });
                    }}
                />
            </Box>
        </VStack>
    );
};

export default React.memo(GraphSimilarity);
