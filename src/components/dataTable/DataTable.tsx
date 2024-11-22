import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    IconButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Text,
    Flex,
    Spacer,
    Radio,
    Select,
    Textarea,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useCustomToast } from '../../utils/toastUtils';
import { DataTableProps, RowData } from '../../types';
import fetchData from '../../utils/fetchData';

const DataTable: React.FC<DataTableProps> = ({
    columns,
    fetchEndpoint,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    infoText,
    dynamicSelectEndpoint,
    dynamicSelectValueField,
    dynamicSelectLabelField
}) => {
    const [rows, setRows] = useState<RowData[]>([]);
    const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
    const [formData, setFormData] = useState<RowData>({});
    const [loading, setLoading] = useState<boolean>(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
    const toast = useCustomToast();
    const navigate = useNavigate();

    const toastRef = useRef(toast);
    const navigateRef = useRef(navigate);

    useEffect(() => {
        toastRef.current = toast;
        navigateRef.current = navigate;
    }, [toast, navigate]);

    useEffect(() => {
        const fetchTableData = async () => {
            const data = await fetchData(fetchEndpoint, 'get', toastRef.current);
            if (Array.isArray(data)) {
                setRows(data);
            } else {
                setRows([]);
            }
            setLoading(false);
        };

        if (loading) {
            fetchTableData();
        }
    }, [fetchEndpoint, loading]);

    const handleRowClick = (row: RowData) => {
        setSelectedRow(row);
    };

    const handleEditClick = () => {
        if (!selectedRow) {
            toastRef.current({
                title: 'Atenção',
                description: 'Selecione um item antes de editar.',
                status: 'warning',
            });
            return;
        }

        const editableData = columns.reduce((acc, column) => {
            if (column.editable) {
                acc[column.key] = selectedRow[column.key];
            }
            return acc;
        }, {} as RowData);

        setFormData(editableData);
        onOpen();
    };

    const handleDeleteClick = () => {
        if (!selectedRow) {
            toastRef.current({
                title: 'Atenção',
                description: 'Selecione um item antes de excluir.',
                status: 'warning',
            });
            return;
        }

        onDeleteModalOpen();
    };

    const handleConfirmDelete = async () => {
        const keyColumn = columns.find(col => col.isKey);
        if (keyColumn && selectedRow) {
            const id = selectedRow[keyColumn.key];
            await fetchData(`${deleteEndpoint}/${id}`, 'delete', toastRef.current);
            setRows(rows.filter(row => row[keyColumn.key] !== id));
            setSelectedRow(null);
            onDeleteModalClose();
        }
    };

    const handleSave = async () => {
        const keyColumn = columns.find(col => col.isKey);
        if (selectedRow && keyColumn) {
            const id = selectedRow[keyColumn.key];
            const updatedData = await fetchData(`${updateEndpoint}/${id}`, 'patch', toastRef.current, formData);
            if (updatedData) {
                setRows(rows.map(row => (row[keyColumn.key] === id ? { ...row, ...formData } : row)));
                onClose();
            }
        }
    };   

    const handleCreate = async () => {
        try {
            const newRow = columns.reduce((acc, column) => {
                if (column.editable) {
                    acc[column.key] = formData[column.key];
                }
                return acc;
            }, {} as RowData);

            const createdRow = await fetchData(createEndpoint, 'post', toastRef.current, newRow);
            if (createdRow) {
                setRows((prevRows) => [...prevRows, createdRow]);
                onClose();
                setSelectedRow(null);
                setFormData({});
            }
        } catch (error) {
            toastRef.current({
                title: 'Erro',
                description: 'Ocorreu um erro ao adicionar o registro.',
                status: 'error',
            });
        }
    };

    const handleOpenCreateModal = () => {
        setSelectedRow(null);
        setFormData({});
        onOpen();
    };

    const [dynamicSelectOptions, setDynamicSelectOptions] = useState<{ [key: string]: { value: string; label: string }[] }>({});

    useEffect(() => {
        const handleDynamicSelect = async (columnKey: string) => {
            if (dynamicSelectEndpoint && dynamicSelectValueField && dynamicSelectLabelField) {
                const options = await fetchData(dynamicSelectEndpoint, 'get', toastRef.current);
                if (options) {
                    setDynamicSelectOptions((prevOptions) => ({
                        ...prevOptions,
                        [columnKey]: options.map((item: any) => ({
                            value: item[dynamicSelectValueField],
                            label: item[dynamicSelectLabelField],
                        })),
                    }));
                }
            }
        };

        columns.forEach((col) => {
            if (col.elementType === 'selectDinamic') {
                handleDynamicSelect(col.key);
            }
        });
    }, [columns, dynamicSelectEndpoint, dynamicSelectValueField, dynamicSelectLabelField]);

    // Encontrar a coluna chave
    const keyColumn = columns.find(col => col.isKey)!;

    return (
        <Box>
            <Flex mb={4} alignItems="center" justifyContent="center">
                <Box>
                    <IconButton
                        aria-label="Adicionar Novo"
                        icon={<AddIcon />}
                        colorScheme="green"
                        onClick={handleOpenCreateModal}
                        mr={2}
                    />
                    <IconButton
                        aria-label="Editar"
                        icon={<EditIcon />}
                        colorScheme="blue"
                        onClick={handleEditClick}
                        mr={2}
                    />
                    <IconButton
                        aria-label="Excluir"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={handleDeleteClick}
                        mr={2}
                    />
                </Box>
                {infoText && (
                    <Text fontSize="lg" fontWeight="bold" textAlign="center">
                        {infoText}
                    </Text>
                )}
                <Spacer />
            </Flex>

            {(() => {
                if (loading) {
                    return <Text textAlign="center" mt={4}>Carregando dados...</Text>;
                }

                if (rows.length === 0) {
                    return <Text textAlign="center" mt={4}>Não há registros disponíveis para exibir.</Text>;
                }

                return (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                {columns.map((col) => (
                                    <Th key={col.key}>{col.label}</Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {rows.map((row) => (
                                <Tr
                                    key={String(row[keyColumn.key])} // Garantir que o key seja do tipo string
                                    onClick={() => handleRowClick(row)}
                                    _hover={{ backgroundColor: 'gray.100', cursor: 'pointer' }}
                                    backgroundColor={selectedRow === row ? 'gray.200' : 'white'}
                                >
                                    {columns.map((col) => (
                                        <Td key={col.key}>
                                            {Array.isArray(row[col.key])
                                                ? (row[col.key] as any[]).join(', ') // Combina os valores do array
                                                : String(row[col.key] || '')} {/* Garantir que o valor seja string */}
                                        </Td>


                                    ))}

                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                );
            })()}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedRow ? 'Editar Registro' : 'Adicionar Novo Registro'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {columns.map((col) => {
                            if (col.editable) {
                                switch (col.elementType) {
                                    case 'textarea':
                                        return (
                                            <Textarea
                                                key={col.key}
                                                placeholder={col.label}
                                                value={String(formData[col.key] || '')} // Convertendo para string
                                                onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                                                mb={3}
                                            />
                                        );
                                    case 'select':
                                        return (
                                            <Select
                                                key={col.key}
                                                placeholder={`Selecione ${col.label}`}
                                                value={String(formData[col.key] || '')} // Convertendo para string
                                                onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                                                mb={3}
                                            >
                                                {col.options?.map((option) => (
                                                    <option key={option.value} value={String(option.value)}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        );
                                    case 'radiogroup':
                                        return (
                                            <Box key={col.key} mb={3}>
                                                <Text fontWeight="bold">{col.label}</Text>
                                                {col.options?.map((option) => (
                                                    <Radio
                                                        key={option.value}
                                                        value={String(option.value)} // Converter o valor para string
                                                        isChecked={String(formData[col.key]) === String(option.value)} // Converter para string
                                                        onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                                                    >
                                                        {option.label}
                                                    </Radio>
                                                ))}
                                            </Box>
                                        );
                                    case 'selectDinamic':
                                        return (
                                            <Select
                                                key={col.key}
                                                placeholder={`Selecione ${col.label}`}
                                                value={String(formData[col.key] || '')}
                                                onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                                                mb={3}
                                            >
                                                {dynamicSelectOptions[col.key]?.map((option) => (
                                                    <option key={option.value} value={String(option.value)}>
                                                        {option.label}
                                                    </option>
                                                )) || <option>Carregando...</option>}
                                            </Select>
                                        );
                                    default:
                                        return (
                                            <Input
                                                key={col.key}
                                                type={col.dataType === 'number' ? 'number' : 'text'}
                                                placeholder={col.label}
                                                value={String(formData[col.key] || '')} // Garantir que seja string
                                                onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                                                mb={3}
                                            />
                                        );
                                }
                            }
                            return null;
                        })}
                    </ModalBody>

                    <ModalFooter>
                        <IconButton
                            colorScheme="blue"
                            icon={<CheckIcon />}
                            aria-label={selectedRow ? 'Salvar' : 'Criar'}
                            onClick={selectedRow ? handleSave : handleCreate}
                            mr={3}
                        />
                        <IconButton
                            colorScheme="gray"
                            icon={<CloseIcon />}
                            aria-label="Cancelar"
                            onClick={onClose}
                        />
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmar Exclusão</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {columns.map((col) => (
                            <Box key={col.key}>
                                <Text fontWeight="bold">{col.label}:</Text>
                                <Text>{selectedRow ? String(selectedRow[col.key]) : ''}</Text>
                            </Box>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <IconButton
                            colorScheme="red"
                            icon={<DeleteIcon />}
                            aria-label="Confirmar Exclusão"
                            onClick={handleConfirmDelete}
                            mr={3}
                        />
                        <IconButton
                            colorScheme="gray"
                            icon={<CloseIcon />}
                            aria-label="Cancelar"
                            onClick={onDeleteModalClose}
                        />
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default DataTable;
