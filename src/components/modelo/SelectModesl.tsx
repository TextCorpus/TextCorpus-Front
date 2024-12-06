import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Box,
    VStack,
    Text,
    Spinner,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import fetchData from '../../utils/fetchData';
import { useCustomToast } from '../../utils/toastUtils';
import config from '../../config';

interface Modelo {
    id_modelo: number;
    titulo: string;
}

interface SelectModelsProps {
    isOpen: boolean;
    onClose: () => void;
    id_projeto: number; 
}

const SelectModels: React.FC<SelectModelsProps> = ({ isOpen, onClose, id_projeto }) => {
    const [modelos, setModelos] = useState<Modelo[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useCustomToast();

    useEffect(() => {
        const fetchModelos = async () => {
            const data = await fetchData(
                `${config.apiUrl}/modelos/por-convidado/1`,
                'get',
                toast
            );
            if (data) {
                setModelos(data); // Atualiza os modelos apenas se os dados forem retornados
            }
            setLoading(false); // Define o carregamento como concluído
        };

        fetchModelos();
    }, []);

    if (loading) {
        return <Spinner size="xl" />;
    }

    if (modelos.length === 0) {
        return (
            <Alert status="info">
                <AlertIcon />
                Nenhum modelo encontrado.
            </Alert>
        );
    }

    const handleModeloClick = async (id_modelo: number) => {
        await fetchData( `${config.apiUrl}/process/comparedocumentsprojet/${id_projeto}/${id_modelo}`, 'get', toast );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Selecione um Modelo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="start">
                        {modelos.map((modelo) => (
                            <Box
                                key={modelo.id_modelo}
                                p={4}
                                borderWidth="1px"
                                borderRadius="md"
                                boxShadow="sm"
                                width="100%"
                                cursor="pointer" // Adicionado para indicar que é clicável
                                onClick={() => handleModeloClick(modelo.id_modelo)} // Adicionado o clique
                            >
                                <Text fontSize="lg" fontWeight="bold">
                                    {modelo.titulo || 'Modelo sem título'}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SelectModels;
