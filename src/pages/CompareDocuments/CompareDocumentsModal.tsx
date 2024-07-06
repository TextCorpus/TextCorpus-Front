import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalFooter, 
    ModalBody, 
    ModalCloseButton, 
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td, 
    Button,
} from '@chakra-ui/react';

interface DocumentData {
    [key: string]: {
        [key: string]: number;
    };
}

interface CompareDocumentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    compareData: any; // Você pode tipar melhor isso conforme necessário
}

const CompareDocumentsModal: React.FC<CompareDocumentsModalProps> = ({ isOpen, onClose, compareData }) => {
    const [data, setData] = useState<DocumentData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://185.137.92.41:3001/documentos/comparedocuments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(compareData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        if (isOpen) {
            fetchData();
        } else {
            // Limpar os dados quando o modal é fechado
            setData(null);
        }
    }, [isOpen, compareData]);

    const generateTable = (data: DocumentData) => {
        const allDocIds = Array.from(new Set(Object.values(data).flatMap(Object.keys))).sort((a, b) => Number(a) - Number(b));

        return (
            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>comparaId / docId</Th>
                        {allDocIds.map(docId => (
                            <Th key={docId}>{docId}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.entries(data).map(([comparaId, docData]) => (
                        <Tr key={comparaId}>
                            <Td>{comparaId}</Td>
                            {allDocIds.map(docId => (
     <Td key={docId}>
     {docData[docId] !== undefined 
         ? docData[docId].toFixed(2) // Ajusta para duas casas decimais
         : '0'}
 </Td>                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={() => { onClose(); setData(null); }} size="full">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Visualização de Tabela</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box overflowX="auto">
                        {data ? generateTable(data) : 'Loading...'}
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CompareDocumentsModal;
