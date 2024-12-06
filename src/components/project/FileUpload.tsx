import React, { useState } from 'react';
import {
    Button, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, Select
} from "@chakra-ui/react";
import * as XLSX from 'xlsx';
import axios from 'axios';
import config from '../../config';
const Papa = require('papaparse');

interface FileUploadProps {
    isOpen: boolean;
    onClose: () => void;
    id_projeto: number;
}

interface RowData {
    [key: string]: any;
}

interface Data {
    projeto: number;
    anoPublicacao: string;
    titulo: string;
    discente: string;
    orientador: string;
    resumo: string;
    palavraChave: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({ isOpen, onClose, id_projeto }) => {
    const [file, setFile] = useState<File | null>(null);
    const [columns, setColumns] = useState<string[]>([]);
    const [rows, setRows] = useState<any[][]>([]);
    const [mapping, setMapping] = useState({
        anoPublicacao: -1,
        titulo: -1,
        discente: -1,
        orientador: -1,
        resumo: -1,
        palavraChave: -1
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const getToken = () => localStorage.getItem('token');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        const isCsv = file.name.endsWith('.csv');

        reader.onload = (event) => {
            const data = event.target?.result;
            if (isCsv && typeof data === 'string') {
                const parsed = Papa.parse(data, { header: false });
                const rows = parsed.data;
                if (rows && rows.length > 0) {
                    setColumns(rows[0]);
                    setRows(rows.slice(1));
                } else {
                    setColumns([]);
                    setRows([]);
                }
            } else {
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                if (jsonData && jsonData.length > 1) {
                    setColumns(jsonData[0]);
                    setRows(jsonData.slice(1));
                } else {
                    setColumns([]);
                    setRows([]);
                }
            }
        };

        if (isCsv) {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    };

    const handleMappingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMapping((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
    };

    const handleSubmit = async () => {
        if (!file || rows.length === 0) {
            alert('Nenhum dado válido para enviar.');
            return;
        }

        const token = getToken();
        if (!token) {
            alert('Token de autenticação não encontrado. Faça login novamente.');
            return;
        }

        setIsProcessing(true);

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const data = buildData(row);

            if (!isDataValid(data)) {
                console.log('Dados inválidos, ignorando linha:', data);
                continue;
            }

            await sendData(data, token, i, rows.length);
        }

        setIsProcessing(false);
        onClose();
    };

    // Função para construir o objeto 'data' para uma linha específica
    const buildData = (row: RowData): Data => ({
        projeto: id_projeto,
        anoPublicacao: mapping.anoPublicacao !== -1 ? row[mapping.anoPublicacao]?.toString().trim() || '' : '',
        titulo: mapping.titulo !== -1 ? row[mapping.titulo]?.toString().trim() || '' : '',
        discente: mapping.discente !== -1 ? row[mapping.discente]?.toString().trim() || '' : '',
        orientador: mapping.orientador !== -1 ? row[mapping.orientador]?.toString().trim() || '' : '',
        resumo: mapping.resumo !== -1 ? row[mapping.resumo]?.toString().trim() || '' : '',
        palavraChave: mapping.palavraChave !== -1
            ? row[mapping.palavraChave]?.toString().split(',').map((word: string) => word.trim()) || []
            : []
    });

    // Função para verificar se o objeto 'data' é válido
    const isDataValid = (data: Data): boolean =>
        Boolean(data.anoPublicacao && data.titulo && data.resumo);

    // Função para enviar 'data' para o servidor e atualizar o progresso
    const sendData = async (data: Data, token: string, currentIndex: number, totalRows: number): Promise<void> => {
        try {
            await axios.post(`${config.apiUrl}/documento`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProgress(((currentIndex + 1) / totalRows) * 100);
        } catch (error) {
            console.error('Erro ao enviar dados para a linha:', data, error);
        }
    };
    // atributos que estão no banco de dados 
    const fields = [
        { name: "titulo", label: "Título" },
        { name: "anoPublicacao", label: "Ano de Publicação" },
        { name: "discente", label: "Discente" },
        { name: "orientador", label: "Orientador" },
        { name: "resumo", label: "Resumo" },
        { name: "palavraChave", label: "Palavras-chave" }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isProcessing}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Carregar Arquivo</ModalHeader>
                <ModalCloseButton isDisabled={isProcessing} />
                <ModalBody>
                    <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} disabled={isProcessing} aria-label="Selecione o arquivo" />
                    {columns.length > 0 && (
                        <>
                            {fields.map((field) => (
                                <FormControl key={field.name}>
                                    <FormLabel>{field.label}</FormLabel>
                                    <Select name={field.name} onChange={handleMappingChange}>
                                        {columns.map((col) => (
                                            <option key={col} value={col}>{col}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                            ))}
                        </>
                    )}
                    {isProcessing && (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <p>Processando... {progress.toFixed(0)}%</p>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit} disabled={isProcessing}>
                        Confirmar
                    </Button>
                    <Button variant="ghost" onClick={onClose} disabled={isProcessing}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FileUpload;
