import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud, { Word as CloudWord } from 'd3-cloud'; // Renomeia o tipo `Word` como `CloudWord`
import { Box } from '@chakra-ui/react';

interface WordCloudComponentProps {
  words: CloudWord[]; 
}

const WordCloudComponent: React.FC<WordCloudComponentProps> = ({ words }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 500;
    const height = 500;
    console.log("palavras recebidas ", words);

    // Função para limpar o SVG antes de redesenhar
    d3.select(svgRef.current).selectAll("*").remove();

    // Define um esquema de cores
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Usando um esquema de cores ordinal

    // Cria o layout da nuvem de palavras
    const layout = cloud<CloudWord>()
      .size([width, height])
      .words(words)
      .padding(5)
      .rotate(0) // Fixar a rotação em 0 graus
      .font('Arial') // Fixar a fonte para Arial
      .fontSize((d) => Math.max(10, d.size * 2)) // Definir um tamanho escalável baseado em um fator
      .on('end', draw);

    layout.start();

    // Função para desenhar as palavras no SVG
    function draw(words: CloudWord[]) {
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
        
      console.log('Desenhando palavras:', words);
      
      svg
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', (d) => `${d.size}px`)
        .style('font-family', 'Arial') // Fixar a família de fontes
        .style('fill', (d, i) => colorScale(i.toString())) // Usar um esquema de cores dinâmico
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
        .text((d) => d.text);
    }
  }, [words]);

  return (
    <Box width="600px" height="600px" bg="gray.100" p={4}>
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default WordCloudComponent;
