import React, { useEffect, useState, useRef } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import * as d3 from 'd3';
import axios from 'axios';
import config from '../config';

interface RadarChartProps {
  id_modelo: number;
  id_projeto: number;
}

interface Document {
  id_documento: number;
  titulo: string;
  publicado: number;
  probability: number; // Adicione esta propriedade
  [key: string]: number | string;
}

const RadarChart: React.FC<RadarChartProps> = ({ id_modelo, id_projeto }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/process/formattedresults/${id_modelo}/${id_projeto}/0`
        );
        const data = response.data.data.slice(1); // Ignorar o cabeçalho
        setDocuments(data as Document[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [id_modelo, id_projeto]);

  useEffect(() => {
    if (!loading && chartRef.current) {
      renderChart();
    }
  }, [loading, documents]);

  const renderChart = () => {
    if (!chartRef.current) return;

    // Limpar qualquer conteúdo anterior antes de renderizar o novo gráfico
    d3.select(chartRef.current).selectAll('*').remove();

    const ods = [
      'ODS 01', 'ODS 02', 'ODS 03', 'ODS 04', 'ODS 05',
      'ODS 06', 'ODS 07', 'ODS 08', 'ODS 09', 'ODS 10',
      'ODS 11', 'ODS 12', 'ODS 13', 'ODS 14', 'ODS 15',
      'ODS 16', 'ODS 17'
    ];

    const anos = Array.from(new Set(documents.map(doc => doc.publicado)));

    // Dados processados para renderização
    const data = anos.map(ano => {
      const values = ods.map(odsKey => {
        // Soma apenas os valores de `probability` dos documentos do ano atual
        return d3.sum(
          documents.filter(doc => doc.publicado === ano),
          doc => {
            const odsData = doc[odsKey] as unknown as { probability: number }; // Acessa o objeto do ODS
            return odsData?.probability || 0; // Retorna apenas `probability`, ignora outras propriedades
          }
        );
      });
    
      return {
        r: values, // Valores radiais para o gráfico
        theta: ods, // Labels do gráfico
        name: `Ano ${ano}` // Nome do conjunto de dados
      };
    });
    

    // Configurar as dimensões do gráfico
    const width = 800; // Aumentado para dar mais espaço
    const height = 800; // Aumentado para dar mais espaço

    // Configurar a escala radial e de ângulo
    const maxValue = d3.max(data.flatMap(d => d.r)) || 0;
    const radiusScale = d3.scaleLinear().domain([0, maxValue]).range([0, Math.min(width, height) / 2 - 50]);

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const chartGroup = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Função para criar os polígonos
    const line = d3.lineRadial<[number, number]>()
      .radius(d => radiusScale(d[1]))
      .angle((d, i) => (i * 2 * Math.PI) / ods.length);

    // Desenhar os polígonos
    data.forEach((d, index) => {
      const points = d.r.map((value, i) => [i * (2 * Math.PI) / ods.length, value] as [number, number]);
      chartGroup.append('path')
        .datum(points)
        .attr('d', line)
        .attr('fill', `rgba(${index * 40}, 100, 200, 0.5)`)
        .attr('stroke', `rgba(${index * 40}, 100, 200, 1)`)
        .attr('stroke-width', 2);
    });

    // Adicionar os eixos e rótulos
    ods.forEach((odsKey, i) => {
      const angle = (i * 2 * Math.PI) / ods.length;
      const x = Math.cos(angle) * radiusScale(maxValue + maxValue * 0.1); // Ajuste para dar mais espaço aos rótulos
      const y = Math.sin(angle) * radiusScale(maxValue + maxValue * 0.1); // Ajuste para dar mais espaço aos rótulos

      chartGroup.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', '0.35em')
        .attr('text-anchor', x > 0 ? 'start' : 'end')
        .text(odsKey)
        .style('font-size', '12px'); // Ajuste de tamanho da fonte para melhor legibilidade
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box ref={chartRef} display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      {!documents.length && <Text>Sem dados para exibir o gráfico.</Text>}
    </Box>
  );
};

export default RadarChart;
