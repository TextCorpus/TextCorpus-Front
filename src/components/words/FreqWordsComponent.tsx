import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";

interface WordData {
    word: string;
    count: number;
}

interface FreqWordsComponentProps {
    wordsData: WordData[]; // Recebendo os dados diretamente
}

const FreqWordsComponent: React.FC<FreqWordsComponentProps> = ({ wordsData }) => {
    const [chartWidth, setChartWidth] = useState<number>(0);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    // Sort words by count and slice the top 10 for the bar chart
    const top10Words = wordsData.slice(0, 10);

    // Resize chart on window resize
    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current) {
                setChartWidth(chartContainerRef.current.clientWidth);
            }
        };

        // Set initial width
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Draw the bar chart with D3
    useEffect(() => {
        if (top10Words.length > 0 && chartWidth > 0) {
            drawBarChart(top10Words, chartWidth);
        }
    }, [top10Words, chartWidth]);

    const drawBarChart = (data: WordData[], width: number) => {
        const margin = { top: 20, right: 30, bottom: 40, left: 90 };
        const height = 500 - margin.top - margin.bottom;

        // Remove any previous chart
        d3.select("#barChart").select("svg").remove();

        // Create the SVG container
        const svg = d3
            .select("#barChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create X scale (Count values)
        const x = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.count) || 0])
            .range([0, width - margin.left - margin.right]);

        // Create Y scale (Word labels)
        const y = d3
            .scaleBand()
            .domain(data.map((d) => d.word))
            .range([0, height])
            .padding(0.1);

        // Draw bars
        svg
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", (d) => y(d.word) || 0)
            .attr("width", (d) => x(d.count) || 0)
            .attr("height", y.bandwidth())
            .attr("fill", "#3182CE");

        // Add X axis (Count values)
        svg
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5));

        // Add Y axis (Word labels)
        svg.append("g").call(d3.axisLeft(y));
    };

    return (
        <Flex direction="row" justify="space-between" p={5}>
            {/* Bar Chart */}
            <Box id="barChart" ref={chartContainerRef} width="60%" height="500px">
                <Heading as="h3" size="lg" mb={5}>
                    As 10 palavras mais frequentes
                </Heading>
            </Box>

            {/* Word Frequency List */}
            <Box width="35%" maxHeight="500px" overflowY="auto">
                <Heading as="h3" size="lg" mb={5}>
                    Frequência das palavras
                </Heading>
                <SimpleGrid columns={3} spacing={5}>
                    {wordsData.map((wordData, index) => (
                        <Box key={index} border="1px solid #ccc" p={2} borderRadius="md">
                            <strong>{wordData.word}</strong>: {wordData.count}
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>
        </Flex>
    );
};

export default FreqWordsComponent;
