import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, ButtonGroup, Spinner } from '@chakra-ui/react';
import * as d3 from 'd3';
import axios from 'axios';

interface GroupedBarChartProps {
    id_modelo: number;
    id_projeto: number;
}

interface Document {
    id_documento: number;
    titulo: string;
    publicado: number;
    probability: number;
    [key: string]: number | string;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ id_modelo, id_projeto }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeYears, setActiveYears] = useState<string[]>([]);
    const [activeGoals, setActiveGoals] = useState<string[]>([]); // Inicialize como vazio
    const [chartType, setChartType] = useState<'ods' | 'year'>('ods'); // Tipo de gráfico atual
    const [isCounting, setIsCounting] = useState(true); // gráfico por contagem

    const chartElementRef = useRef<SVGSVGElement | null>(null);

    // Efeito para buscar os dados
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(
                    `http://185.137.92.41:3001/process/formattedresults/${id_modelo}/${id_projeto}/0`
                );
                const data = response.data.data.slice(1); // Ignorar o cabeçalho
                setDocuments(data as Document[]);

                // Gera os anos únicos como strings, mas não define `activeYears` inicialmente
                const years: string[] = Array.from(
                    new Set(data.map((doc: Document) => String(doc.publicado)))
                );

                // Gera os ODS únicos com base nas chaves do primeiro documento, mas mantém `activeGoals` vazio inicialmente
                const odsKeys: string[] =
                    data.length > 0
                        ? Object.keys(data[0]).filter(key => key.startsWith('ODS'))
                        : [];

                setActiveYears(years);
                setActiveGoals(odsKeys);

                // Opcional: forneça informações ao usuário sobre os anos e ODS disponíveis (não ativos)
                console.log('Anos disponíveis:', years);
                console.log('ODS disponíveis:', odsKeys);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [id_modelo, id_projeto]);


    // Efeito para renderizar o gráfico após os dados serem carregados
    useEffect(() => {
        if (!loading && chartElementRef.current) {
            if (chartType === 'ods') {
                renderChartOds();
            } else {
                renderChartAno();
            }
        }
    }, [loading, documents, isExpanded, activeYears, activeGoals, chartType, isCounting]);

    const renderChartOds = () => {
        if (!chartElementRef.current) return;

        const svgCanvas = d3.select(chartElementRef.current);
        svgCanvas.selectAll('*').remove();

        const sustainableDevelopmentGoals = activeGoals;
        const publicationYears = Array.from(new Set(documents.map(doc => String(doc.publicado))));

        const chartData = publicationYears.flatMap(publicationYear =>
            sustainableDevelopmentGoals //.filter(goal => activeGoals.includes(goal)) // Exclui ODS inativos
            .map(goal => {
                const documentsByYear = documents.filter(doc => String(doc.publicado) === publicationYear);
                let goalValue = 0;
                if (isCounting) {
                    goalValue = documentsByYear.filter(doc => {
                        const goalData = doc[goal] as unknown as { probability: number };
                        return goalData?.probability > 0; // Verifica se existe e é maior que zero
                    }).length;
                } else {
                    goalValue = d3.sum(documentsByYear, doc => {
                        const goalData = doc[goal] as unknown as { probability: number };
                        return goalData?.probability || 0;
                    });
                }
                return {
                    goal,
                    year: String(publicationYear),
                    value: goalValue, // activeYears.includes(String(publicationYear)) && activeGoals.includes(goal) ? goalValue : 0,
                };
            })
        );

        const chartMargins = { top: 20, right: 150, bottom: 80, left: 100 };
        const chartWidth = (isExpanded ? 1200 : 900) - chartMargins.left - chartMargins.right;
        const chartHeight = (isExpanded ? 800 : 600) - chartMargins.top - chartMargins.bottom;

        const xAxisScaleGoals = d3.scaleBand()
            .domain(sustainableDevelopmentGoals)
            .rangeRound([0, chartWidth])
            .paddingInner(0.1);

        const xAxisScaleYears = d3.scaleBand()
            .domain(publicationYears)
            .rangeRound([0, xAxisScaleGoals.bandwidth()])
            .padding(0.05);

        const yAxisScale = d3.scaleLinear()
            .domain([0, d3.max(chartData, dataPoint => dataPoint.value) || 0])
            .nice()
            .rangeRound([chartHeight, 0]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(publicationYears);

        const chartGroup = svgCanvas.append('g')
            .attr('transform', `translate(${chartMargins.left}, ${chartMargins.top})`);

        chartGroup.selectAll('g')
            .data(sustainableDevelopmentGoals)
            .join('g')
            .attr('transform', goal => `translate(${xAxisScaleGoals(goal) ?? 0},0)`)
            .selectAll('rect')
            .data(goal => publicationYears.map(publicationYear => {
                const value = chartData.find(item => item.goal === goal && item.year === publicationYear)?.value || 0;
                return { year: publicationYear , value, goal };
            }))
            .join('rect')
            .attr('x', dataPoint => xAxisScaleYears(dataPoint.year) ?? 0)
            .attr('y', dataPoint => yAxisScale(dataPoint.value))
            .attr('width', xAxisScaleYears.bandwidth())
            .attr('height', dataPoint => yAxisScale(0) - yAxisScale(dataPoint.value))
            .attr('fill', dataPoint => colorScale(dataPoint.year))
            .style('opacity', dataPoint =>
                activeYears.includes(dataPoint.year) && activeGoals.includes(dataPoint.goal) ? 1 : 0.3
            );

        const xAxis = d3.axisBottom(xAxisScaleGoals).tickSizeOuter(0);
        const yAxis = d3.axisLeft(yAxisScale).ticks(10);

        chartGroup.append('g')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(xAxis);

        chartGroup.append('g')
            .call(yAxis);

        chartGroup.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('x', -chartHeight / 2)
            .attr('y', -chartMargins.left / 2)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .text( isCounting ? 'Contagem' :'Intensidade');

        const legendGroup = svgCanvas.append('g')
            .attr('transform', `translate(${chartMargins.left + chartWidth + 30}, ${chartMargins.top})`);

        legendGroup.selectAll('rect')
            .data(publicationYears)
            .join('rect')
            .attr('x', 0)
            .attr('y', (year, index) => index * 20)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', year => colorScale(year))
            .style('cursor', 'pointer')
            .style('opacity', years => (activeYears.includes(years) ? 1 : 0.3))
            .on('click', (event, year) => toggleYearVisibility(String(year)));

        legendGroup.selectAll('text')
            .data(publicationYears)
            .join('text')
            .attr('x', 20)
            .attr('y', (year, index) => index * 20 + 12)
            .text(year => year)
            .attr('fill', '#000')
            .attr('font-size', '12px')
            .style('cursor', 'pointer')
            .style('opacity', years => (activeYears.includes(years) ? 1 : 0.3))
            .on('click', (event, year) => toggleYearVisibility(String(year)));
    };

    const renderChartAno = () => {
        if (!chartElementRef.current) return;

        const svgCanvas = d3.select(chartElementRef.current);
        svgCanvas.selectAll('*').remove();

        const sustainableDevelopmentGoals = activeGoals; // Agora usa os ODS ativos dinamicamente
        const publicationYears = Array.from(new Set(documents.map(doc => String(doc.publicado))));

        const chartData = publicationYears.flatMap(publicationYear =>
            sustainableDevelopmentGoals.map(goal => {
                const documentsByYear = documents.filter(doc => String(doc.publicado) === publicationYear);
                let goalValue = 0;
                if (isCounting) {
                    goalValue = documentsByYear.filter(doc => {
                        const goalData = doc[goal] as unknown as { probability: number };
                        return goalData?.probability > 0; // Verifica se existe e é maior que zero
                    }).length;
                } else {
                    goalValue = d3.sum(documentsByYear, doc => {
                        const goalData = doc[goal] as unknown as { probability: number };
                        return goalData?.probability || 0;
                    });
                }
                return {
                    goal,
                    year: String(publicationYear),
                    value: goalValue, //activeYears.includes(String(publicationYear)) && activeGoals.includes(goal) ? goalValue : 0,
                };
            })
        );

        const chartMargins = { top: 20, right: 150, bottom: 80, left: 100 };
        const chartWidth = (isExpanded ? 1200 : 900) - chartMargins.left - chartMargins.right;
        const chartHeight = (isExpanded ? 800 : 600) - chartMargins.top - chartMargins.bottom;

        const xAxisScaleYears = d3.scaleBand()
            .domain(publicationYears)
            .rangeRound([0, chartWidth])
            .paddingInner(0.1);

        const xAxisScaleGoals = d3.scaleBand()
            .domain(sustainableDevelopmentGoals)
            .rangeRound([0, xAxisScaleYears.bandwidth()])
            .padding(0.05);

        const yAxisScale = d3.scaleLinear()
            .domain([0, d3.max(chartData, dataPoint => dataPoint.value) || 0])
            .nice()
            .rangeRound([chartHeight, 0]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(sustainableDevelopmentGoals);

        const chartGroup = svgCanvas.append('g')
            .attr('transform', `translate(${chartMargins.left}, ${chartMargins.top})`);

        chartGroup.selectAll('g')
            .data(publicationYears)
            .join('g')
            .attr('transform', year => `translate(${xAxisScaleYears(year) ?? 0},0)`)
            .selectAll('rect')
            .data(year => sustainableDevelopmentGoals.map(goal => {
                const value = chartData.find(item => item.goal === goal && item.year === year)?.value || 0;
                return { year, value, goal };
            }))
            .join('rect')
            .attr('x', dataPoint => xAxisScaleGoals(dataPoint.goal) ?? 0)
            .attr('y', dataPoint => yAxisScale(dataPoint.value))
            .attr('width', xAxisScaleGoals.bandwidth())
            .attr('height', dataPoint => yAxisScale(0) - yAxisScale(dataPoint.value))
            .attr('fill', dataPoint => colorScale(dataPoint.goal))
            .style('opacity', dataPoint =>
                activeYears.includes(dataPoint.year) && activeGoals.includes(dataPoint.goal) ? 1 : 0.3
            );

        const xAxis = d3.axisBottom(xAxisScaleYears).tickSizeOuter(0);
        const yAxis = d3.axisLeft(yAxisScale).ticks(10);

        chartGroup.append('g')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(xAxis);

        chartGroup.append('g')
            .call(yAxis);

        chartGroup.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('x', -chartHeight / 2)
            .attr('y', -chartMargins.left / 2)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .text(isCounting ? 'Contagem' :'Intensidade' );

        const legendGroup = svgCanvas.append('g')
            .attr('transform', `translate(${chartMargins.left + chartWidth + 30}, ${chartMargins.top})`);

        legendGroup.selectAll('rect')
            .data(sustainableDevelopmentGoals)
            .join('rect')
            .attr('x', 0)
            .attr('y', (goal, index) => index * 20)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', goal => colorScale(goal))
            .style('cursor', 'pointer')
            .style('opacity', goal => (activeGoals.includes(goal) ? 1 : 0.3))
            .on('click', (event, goal) => toggleGoalVisibility(goal));

        legendGroup.selectAll('text')
            .data(sustainableDevelopmentGoals)
            .join('text')
            .attr('x', 20)
            .attr('y', (goal, index) => index * 20 + 12)
            .text(goal => goal)
            .attr('fill', '#000')
            .attr('font-size', '12px')
            .style('cursor', 'pointer')
            .style('opacity', goal => (activeGoals.includes(goal) ? 1 : 0.3))
            .on('click', (event, goal) => toggleGoalVisibility(goal));
    };

    const toggleYearVisibility = (year: string) => {
        setActiveYears(prev =>
            prev.includes(year)
                ? prev.filter(y => y !== year)
                : [...prev, year]
        );
    };

    const toggleGoalVisibility = (goal: string) => {
        setActiveGoals(prev =>
            prev.includes(goal)
                ? prev.filter(g => g !== goal)
                : [...prev, goal]
        );
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleTipoGrafico = () => {
        setIsCounting(!isCounting);
    };

    const handleDownload = () => {
        if (!chartElementRef.current) return;

        const svgElement = chartElementRef.current;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();

        canvas.width = svgElement.clientWidth;
        canvas.height = svgElement.clientHeight;

        img.onload = () => {
            context?.drawImage(img, 0, 0);
            const link = document.createElement('a');
            link.download = 'chart.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="left">
                <ButtonGroup size="sm" isAttached variant="outline" colorScheme="blue">
                    <Button onClick={toggleTipoGrafico } isActive={isCounting}>
                        Gráfico de Contagem
                    </Button>
                    <Button onClick={toggleTipoGrafico }isActive={!isCounting}>
                        Gráfico de Intensidade
                    </Button>
                    <Button onClick={() => setChartType('ods')} isActive={chartType === 'ods'}>
                        Gráfico por ODS
                    </Button>
                    <Button onClick={() => setChartType('year')} isActive={chartType === 'year'}>
                        Gráfico por Ano
                    </Button>
                    <Button onClick={handleDownload}>
                        Baixar Gráfico
                    </Button>
                    <Button onClick={toggleExpand}>
                        {isExpanded ? 'Reduzir' : 'Ampliar'}
                    </Button>
                </ButtonGroup>
            </Box>
            <Box width="80%" height="90%">
                <svg
                    ref={chartElementRef}
                    viewBox={`0 0 ${isExpanded ? 1200 : 900} ${isExpanded ? 1200 : 900}`}
                    style={{ width: '100%', height: '100%' }}
                />
            </Box>
        </Box>
    );
};

export default GroupedBarChart;

