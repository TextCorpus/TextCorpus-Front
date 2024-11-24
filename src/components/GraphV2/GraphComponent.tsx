import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import * as d3 from "d3";
import { Simulate } from "react-dom/test-utils";

interface GraphProps {
    apiUrl: string;
    token: string;
}

const GraphComponent: React.FC<GraphProps> = ({ apiUrl, token }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [nodes, setNodes] = useState<any[]>([]);
    const [links, setLinks] = useState<any[]>([]);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [layout, setLayout] = useState<string>("normal");

    useEffect(() => {
        fetchAndDrawGraph();
        drawGraph();
    }, [layout]);

    const fetchAndDrawGraph = async () => {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("junior")

            if (!response.ok) {
                throw new Error(`Erro ao buscar os dados: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.graphData || !data.graphData.nodes || !data.graphData.edges) {
                throw new Error("Formato inválido do JSON retornado.");
            }

            const graphData = data.graphData;
            console.log("dados ", graphData)
            setNodes(
                Object.keys(graphData.nodes).map((id) => ({
                    id,
                    ...graphData.nodes[id],
                }))
            );
            setLinks(graphData.edges.map((d: any) => ({ ...d })));

            // initializeGraph();
            // applyNormalLayout();
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    const drawGraph = () => {
        initializeGraph();
        if (layout === "normal") {
            applyNormalLayout();
        } else if (layout === "mundop") {
            applySmallWorldLayout();
        } else if (layout === "hierar") {
            applyHierarchicalLayout();
        } else if (layout === "gradeg") {
            applyGridLayout();
        } else if (layout === "circul") {
            applyCircularLayout();
        } else if (layout === "cluste") {
            applyClusteredForceLayout();
        } else if (layout === "espira") {
            applySpiralLayout();
        } else if (layout === "arvore") {
            applyRadialTreeLayout();
        } else if (layout === "concen") {
            applyConcentricCirclesLayout();
        } else if (layout === "aleato") {
            applyRandomLayout();
        } else if (layout === "estrel") {
            applyStarLayout();
        } else if (layout === "fluxor") {
            applyFlowLayout();
        }
    }

    const initializeGraph = () => {
        if (!svgRef.current) {
            console.error("O elemento SVG não está disponível.");
            return;
        }

        console.log("passou pela criação");

        const svg = d3
            .select<SVGSVGElement, unknown>(svgRef.current) // Seleção do elemento SVG
            .attr("width", window.innerWidth)
            .attr("height", window.innerHeight)
            .call(
                d3.zoom<SVGSVGElement, unknown>() // Configuração do ZoomBehavior
                    .on("zoom", (event) => {
                        if (g) {
                            g.attr("transform", event.transform); // Pan e zoom no gráfico
                        }
                    })
            );

        // Verifica se o grupo `<g>` já existe no SVG
        let g: d3.Selection<SVGGElement, unknown, null, undefined> = svg.select<SVGGElement>("g");

        if (g.empty()) {
            console.log("Criando o grupo `<g>` pela primeira vez");
            g = svg.append<SVGGElement>("g"); // Especifica que está criando um elemento `<g>`
        } else {
            console.log("Limpando o grupo `<g>` existente");
            g.selectAll("*").remove(); // Remove todos os elementos do grupo
        }

        const tooltip = d3.select(tooltipRef.current);

        // Escalas para cores e largura das arestas
        const extent = d3.extent(links, (d: any) => d.similarity || 1) as [number | undefined, number | undefined];
        const domain = [extent[0] ?? 0, extent[1] ?? 1];
        const colorScale = d3.scaleLinear<string>().domain(domain).range(["red", "blue"]);

        const widthScale = d3
            .scaleLinear()
            .domain([extent[0] ?? 0, extent[1] ?? 1])
            .range([1, 4]);

        // Define marcadores para setas
        svg.append("defs")
            .append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 10) // Ajuste para posicionar a seta
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5") // Desenha a forma da seta
            .attr("fill", "black");

        // Adiciona links (arestas) ao grupo `<g>`
        g.append("g")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke", (d: any) => colorScale(d.similarity || 1))
            .attr("stroke-width", (d: any) => widthScale(d.similarity || 1))
            .attr("stroke-width", (d: any) => widthScale(d.similarity || 1))
            .attr("marker-end", "url(#arrow)");

        // Adiciona nós (vértices) ao grupo `<g>`
        g.append("g")
            .selectAll<SVGCircleElement, any>("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 5)
            .attr("fill", "currentColor")
            .call(
                d3.drag<SVGCircleElement, any>()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
            )
            .on("mouseover", (event: any, d: any) => {
                tooltip
                    .style("visibility", "visible")
                    .style("top", `${event.pageY + 10}px`)
                    .style("left", `${event.pageX + 10}px`)
                    .html(
                        `<strong>Vértice:</strong> ${d.id}<br><strong>Propriedades:</strong><br>${JSON.stringify(
                            d,
                            null,
                            2
                        )}`
                    );
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });

        // Rótulos (labels)
        g.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .attr("font-size", 9)
            .text((d: any) => d.id);
    };

    const updatePositions = () => {
        const svg = d3.select(svgRef.current);

        svg.selectAll("line")
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

        svg.selectAll("circle")
            .attr("cx", (d: any) => d.x)
            .attr("cy", (d: any) => d.y);

        svg.selectAll("text")
            .attr("x", (d: any) => d.x)
            .attr("y", (d: any) => d.y);
    };
    
    function dragstarted(event: any, d: any) {
        if (!event.active) d3.forceSimulation(nodes).alphaTarget(0.3).restart();
        d.fx = d.x; // Fixa a posição inicial
        d.fy = d.y;
    }

    function dragged(event: any, d: any) {
        d.fx = event.x; // Atualiza a posição fixa
        d.fy = event.y;
    }

    function dragended(event: any, d: any) {
        if (!event.active) d3.forceSimulation(nodes).alphaTarget(0);
        d.fx = null; // Libera a posição fixa
        d.fy = null;
    }

    // Funções de Layout 
    const applyNormalLayout = () => {
        //.force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
        d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id((d: any) => d.id))
            .force("charge", d3.forceManyBody().strength(-50))
            .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
            .on("tick", updatePositions);
    };

    const applySmallWorldLayout = () => {
        d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance(30))
            .force("charge", d3.forceManyBody().strength(-50))
            .force("collision", d3.forceCollide().radius(10))
            .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
            .on("tick", updatePositions);
    };

    const applyHierarchicalLayout = () => {
        // Tipo para os dados de cada nó
        interface NodeData {
            id: string;
            children?: NodeData[];
            [key: string]: any; // Para incluir propriedades adicionais
        }

        // Estrutura dos nós ajustada para incluir 'children'
        const structuredNodes: NodeData[] = nodes.map((node) => ({
            ...node,
            children: node.children || [],
        }));

        // Cria a hierarquia com o tipo correto
        const hierarchy = d3.hierarchy<NodeData>({ id: "root", children: structuredNodes });

        // Define a árvore
        const tree = d3.tree<NodeData>().size([window.innerWidth, window.innerHeight]);
        const treeData = tree(hierarchy);

        // Atualiza posições
        nodes.forEach((node, i) => {
            const descendant = treeData.descendants()[i];
            node.x = descendant?.x || 0;
            node.y = descendant?.y || 0;
        });

        updatePositions();
    };

    const applyGridLayout = () => {
        const gridSize = Math.ceil(Math.sqrt(nodes.length));
        const nodeSize = Math.min(window.innerWidth / gridSize, window.innerHeight / gridSize);

        nodes.forEach((node, i) => {
            node.x = (i % gridSize) * nodeSize + nodeSize / 2;
            node.y = Math.floor(i / gridSize) * nodeSize + nodeSize / 2;
        });

        updatePositions();
    };

    const applyCircularLayout = () => {
        const radius = Math.min(window.innerWidth, window.innerHeight) / 2 - 20;

        nodes.forEach((node, i) => {
            const angle = (i / nodes.length) * 2 * Math.PI;
            node.x = window.innerWidth / 2 + radius * Math.cos(angle);
            node.y = window.innerHeight / 2 + radius * Math.sin(angle);
        });

        updatePositions();
    };

    const applyClusteredForceLayout = () => {
        d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance(30))
            .force("charge", d3.forceManyBody().strength((d: any) => -50 * (d.group || 1)))
            .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
            .force("collision", d3.forceCollide().radius(15).strength(0.7))
            .on("tick", updatePositions);
    };

    const applySpiralLayout = () => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const spacing = 15;

        nodes.forEach((node, i) => {
            const angle = i * 0.5;
            const radius = spacing * angle;
            node.x = centerX + radius * Math.cos(angle);
            node.y = centerY + radius * Math.sin(angle);
        });

        updatePositions();
    };

    // const applyRadialTreeLayout = () => {
    //     // Tipo para os dados de cada nó
    //     interface NodeData {
    //         id: string;
    //         children?: NodeData[];
    //         [key: string]: any; // Para incluir propriedades adicionais
    //     }

    //     // Estrutura dos nós ajustada para incluir 'children'
    //     const structuredNodes: NodeData[] = nodes.map((node) => ({
    //         ...node,
    //         children: node.children || [],
    //     }));

    //     // Cria a hierarquia com o tipo correto
    //     const root = d3.hierarchy<NodeData>({ id: "root", children: structuredNodes });

    //     // Define o cluster radial
    //     const cluster = d3
    //         .cluster<NodeData>()
    //         .size([2 * Math.PI, Math.min(window.innerWidth, window.innerHeight) / 2 - 50]);
    //     cluster(root);

    //     // Atualiza posições
    //     nodes.forEach((node, i) => {
    //         const descendant = root.descendants()[i];
    //         const angle = descendant?.x || 0;
    //         const radius = descendant?.y || 0;
    //         node.x = window.innerWidth / 2 + radius * Math.cos(angle);
    //         node.y = window.innerHeight / 2 + radius * Math.sin(angle);
    //     });

    //     updatePositions();
    // };

    function applyRadialTreeLayout() {
        // Define o tipo dos dados da hierarquia
        interface NodeData {
            children?: NodeData[];
            id?: string; // Adicione outras propriedades relevantes, se necessário
        }
    
        // Configura o layout de cluster com tamanho radial
        const cluster = d3.cluster<NodeData>().size([2 * Math.PI, Math.min(window.innerWidth, window.innerHeight) / 2 - 50]);
    
        // Cria a hierarquia com base nos nós
        const root = d3.hierarchy<NodeData>({ children: nodes });
    
        // Aplica o layout do cluster na hierarquia
        cluster(root);
    
        // Converte coordenadas polares para cartesianas e atualiza os nós
        nodes.forEach((node, i) => {
            const descendant = root.descendants()[i];
            if (descendant) {
                const angle = descendant.x || 0; // Ângulo em radianos
                const radius = descendant.y || 0; // Distância radial
                node.x = window.innerWidth / 2 + radius * Math.cos(angle); // Converte para x cartesiano
                node.y = window.innerHeight / 2 + radius * Math.sin(angle); // Converte para y cartesiano
            }
        });
    
        // Atualiza as posições visuais do gráfico
        updatePositions();
    }
    

    const applyConcentricCirclesLayout = () => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const maxRadius = Math.min(window.innerWidth, window.innerHeight) / 2 - 20;

        nodes.forEach((node, i) => {
            const group = node.group || 1;
            const angle = (i / nodes.length) * 2 * Math.PI;
            const radius = (group / d3.max(nodes, (d: any) => d.group || 1)) * maxRadius;

            node.x = centerX + radius * Math.cos(angle);
            node.y = centerY + radius * Math.sin(angle);
        });

        updatePositions();
    };

    const applyRandomLayout = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        nodes.forEach((node) => {
            node.x = Math.random() * width;
            node.y = Math.random() * height;
        });

        updatePositions();
    };

    const applyStarLayout = () => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = Math.min(window.innerWidth, window.innerHeight) / 3;

        nodes.forEach((node, i) => {
            if (i === 0) {
                node.x = centerX;
                node.y = centerY;
            } else {
                const angle = (i / (nodes.length - 1)) * 2 * Math.PI;
                node.x = centerX + radius * Math.cos(angle);
                node.y = centerY + radius * Math.sin(angle);
            }
        });

        updatePositions();
    };

    const applyFlowLayout = () => {
        const layerHeight = window.innerHeight / (d3.max(nodes, (d: any) => d.level || 1) + 1);
        const layerWidth = window.innerWidth;

        nodes.forEach((node) => {
            const level = node.level || 0;
            node.y = layerHeight * level + layerHeight / 2;
            node.x = Math.random() * layerWidth;
        });

        updatePositions();
    };

    return (
        <Box position="relative" w="100vw" h="100vh">
            <Menu>
                <MenuButton as={Button}>☰ Menu</MenuButton>
                <MenuList>
                    <MenuItem onClick={() => setLayout("normal")}>Normal</MenuItem>
                    <MenuItem onClick={() => setLayout("mundop")}>Pequeno Mundo</MenuItem>
                    <MenuItem onClick={() => setLayout("hierar")}>Hierárquico</MenuItem>
                    <MenuItem onClick={() => setLayout("gradeg")}>Grade</MenuItem>
                    <MenuItem onClick={() => setLayout("circul")}>Circular</MenuItem>
                    <MenuItem onClick={() => setLayout("cluste")}>Clustered Force</MenuItem>
                    <MenuItem onClick={() => setLayout("espira")}>Espiral</MenuItem>
                    <MenuItem onClick={() => setLayout("arvore")}>Árvore Radial</MenuItem>
                    <MenuItem onClick={() => setLayout("concen")}>Círculos Concêntricos</MenuItem>
                    <MenuItem onClick={() => setLayout("aleato")}>Aleatório</MenuItem>
                    <MenuItem onClick={() => setLayout("estrel")}>Estrela</MenuItem>
                    <MenuItem onClick={() => setLayout("fluxor")}>Fluxo</MenuItem>
                </MenuList>
            </Menu>
            <Box as="svg" ref={svgRef} w="100%" h="100%" />
            <Box
                ref={tooltipRef}
                position="absolute"
                bg="white"
                p={2}
                border="1px solid #ccc"
                borderRadius="md"
                fontSize="sm"
                visibility="hidden"
                zIndex="tooltip"
            />
        </Box>
    );
};

export default GraphComponent;
