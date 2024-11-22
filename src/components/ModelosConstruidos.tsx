import React, { useEffect, useState } from 'react';
import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    VStack,
    Text,
    Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import DataTableResultModels from './dataTable/DataTableResultModels';
import GroupedBarChart from './GroupedBarChart';
import RadarChart from './RadarChart'; // Importando o componente RadarChart

// Definindo a interface do modelo
interface Modelo {
    id_modelo: number;
    id_projeto: number;
    titulo_modelo: string;
    titulo_projeto: string;
}

interface ModelosConstruidosProps {
    isOpen: boolean;
    onClose: () => void;
    id_projeto: number;
}

const ModelosConstruidos: React.FC<ModelosConstruidosProps> = ({ isOpen, onClose, id_projeto }) => {
    const [modelos, setModelos] = useState<Modelo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedModelo, setSelectedModelo] = useState<Modelo | null>(null);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, id_projeto]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get<Modelo[]>(`http://185.137.92.41:3001/process/unique-models/${id_projeto}`);
            setModelos(response.data);
        } catch (error) {
            console.error('Erro ao buscar os modelos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModeloClick = (modelo: Modelo) => {
        setSelectedModelo(modelo);
        setSelectedTab(0); // Redefine para a primeira aba quando um novo modelo é selecionado
    };

    const handleTabChange = (index: number) => {
        setSelectedTab(index);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modelos do Projeto</ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex">
                    {/* Lista de Modelos - 20% da tela */}
                    <Box w="20%" p={4} bg="gray.50" overflowY="auto">
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            <VStack spacing={4} align="stretch">
                                {modelos.map((modelo) => (
                                    <Box
                                        key={modelo.id_modelo}
                                        p={4}
                                        bg={selectedModelo?.id_modelo === modelo.id_modelo ? "teal.100" : "white"}
                                        boxShadow="sm"
                                        borderRadius="md"
                                        cursor="pointer"
                                        onClick={() => handleModeloClick(modelo)}
                                    >
                                        <Text fontWeight="bold">{modelo.titulo_modelo}</Text>
                                        <Text fontSize="sm">{modelo.titulo_projeto}</Text>
                                    </Box>
                                ))}
                            </VStack>
                        )}
                    </Box>

                    {/* Abas - 80% da tela */}
                    <Box w="80%" p={4}>
                        <Tabs variant="enclosed" index={selectedTab} onChange={handleTabChange}>
                            <TabList>
                                <Tab>Tabela dos Resultados</Tab>
                                <Tab isDisabled={!selectedModelo}>Gráficos de Barras</Tab>
                                <Tab isDisabled={!selectedModelo}>Gráfico de Radar</Tab>
                                <Tab isDisabled={!selectedModelo}>Tabela de Validação</Tab>   
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    {selectedModelo ? (
                                        <DataTableResultModels
                                            id_modelo={selectedModelo.id_modelo}
                                            id_projeto={id_projeto}
                                            validacao={false}
                                        />
                                    ) : (
                                        <Text>Selecione um modelo à esquerda para visualizar os resultados.</Text>
                                    )}
                                </TabPanel>
                                <TabPanel>
                                    {selectedModelo ? (
                                        <GroupedBarChart
                                            id_modelo={selectedModelo.id_modelo}
                                            id_projeto={id_projeto}
                                        />
                                    ) : (
                                        <Text>Selecione um modelo à esquerda para visualizar o gráfico.</Text>
                                    )}
                                </TabPanel>
                                <TabPanel>
                                    {selectedModelo ? (
                                        <RadarChart
                                            id_modelo={selectedModelo.id_modelo}
                                            id_projeto={id_projeto}
                                        />
                                    ) : (
                                        <Text>Selecione um modelo à esquerda para visualizar o gráfico de radar.</Text>
                                    )}
                                </TabPanel>
                                <TabPanel>
                                    {selectedModelo ? (
                                        <DataTableResultModels
                                            id_modelo={selectedModelo.id_modelo}
                                            id_projeto={id_projeto}
                                            validacao={true}
                                        />
                                    ) : (
                                        <Text>Selecione um modelo à esquerda para visualizar os resultados.</Text>
                                    )}
                                </TabPanel>

                            </TabPanels>
                        </Tabs>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ModelosConstruidos;
