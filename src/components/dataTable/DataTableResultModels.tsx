import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  useToast,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import ValidaDocumentoModal from '../modelo/ValidaDocumentoModal';

interface DataTableResultModelsProps {
  id_modelo: number;
  id_projeto: number;
  validacao: boolean;
}

interface FormattedResult {
  [key: string]: any;
}

interface ODS {
  probability: number;
  validado: string;
}

interface Row {
  id_documento: number;
  titulo: string;
  publicado: number;
  [key: string]: ODS | number | string; // Para permitir chaves dinâmicas
}

interface JsonData {
  statusCode: number;
  message: string;
  data: [string[], ...Row[]]; // Cabeçalho como array de strings, seguido por linhas
}

const DataTableResultModels: React.FC<DataTableResultModelsProps> = ({ id_modelo, id_projeto, validacao }) => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<FormattedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Estado para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState<number | null>(null);
  const [selectedProjeto, setSelectedProjeto] = useState<number | null>(null);

  useEffect(() => {
    if (id_modelo && id_projeto) {
      const fetchData = async () => {
        try {
          const caminho = `http://185.137.92.41:3001/process/formattedresults/${id_modelo}/${id_projeto}/${validacao ? '0' : '1'}`;
          const response = await axios.get(caminho);
          const responseData = response.data.data;

          const [headerRow, ...dataRows] = responseData;
          setHeaders(headerRow as string[]);
          setRows(dataRows as FormattedResult[]);
        } catch (error) {
          toast({
            title: 'Erro ao buscar dados',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id_modelo, id_projeto, toast, validacao]);

  const exportToExcel = () => {
    // Combinar os cabeçalhos com os dados
    const formattedData = rows.map((row) => {
      const flatRow: Record<string, any> = {
        id_documento: row.id_documento,
        titulo: row.titulo,
        publicado: row.publicado,
      };

      // Percorrer colunas de ODS e extrair probability
      headers.slice(3).forEach((ods) => {
        flatRow[ods] = (row[ods] as ODS)?.probability || 0; // Padrão: 0 caso não haja probability
      });

      return flatRow;
    });

    // Gerar worksheet e workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Exportar para arquivo
    XLSX.writeFile(workbook, 'tabela_dados.xlsx');
  };

  const handleRowDoubleClick = (projetoId: number, documentoId: number) => {
    setSelectedProjeto(projetoId);
    setSelectedDocumento(documentoId); // Armazena o ID do documento selecionado
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProjeto(null);
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (headers.length === 0 || rows.length === 0) {
    return <Box textAlign="center" mt={4}>Nenhum dado encontrado.</Box>;
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };

  return (
    <Box width="100%" height="100%" overflow="hidden">
      <ButtonGroup size="sm" isAttached variant="outline" colorScheme="blue">
        <Button onClick={exportToExcel} colorScheme="blue" mb={4}>Exportar para Excel</Button>
      </ButtonGroup>
      <TableContainer maxHeight="calc(100vh - 200px)" overflowX="auto" overflowY="auto">
        <Table variant="striped" size="sm">
          <Thead position="sticky" top="0" zIndex="2" bg="green.800">
            <Tr>
              {headers.map((header, index) => {
                const isSticky = index === 0 || index === 1;
                return (
                  <Th
                    key={header}
                    color="white"
                    py={2}
                    position={isSticky ? 'sticky' : 'static'}
                    left={isSticky ? '0' : undefined}
                    zIndex={isSticky ? 2 : undefined}
                    bg="green.800"
                  >
                    {header}
                  </Th>
                );
              })}
            </Tr>
          </Thead>

          <Tbody>
            {rows.map((row, rowIndex) => {
              const rowBg = rowIndex % 2 === 0 ? 'green.100' : 'gray.50';

              return (
                <Tr
                  key={`row-${rowIndex}`}
                  bg={rowBg}
                  onDoubleClick={() => handleRowDoubleClick(row.id_projeto, row.id_documento)} // Adiciona o evento de clique duplo
                  cursor="pointer"
                >
                  {headers.map((header, colIndex) => {
                    const isSticky = colIndex === 0 || colIndex === 1;
                    const value = row[header];
                    const textAlign = typeof value === 'number' ? 'right' : 'left';

                    let content;
                    if (header === "id_documento" || header === "publicado") {
                      content = typeof value === "number" && !isNaN(value) ? Math.round(value) : value;
                    } else if (typeof value === "object" && value !== null) {
                      content = (
                        <>
                          <div style={{ textAlign: 'right' }}>{value.probability?.toFixed(2)}</div>
                          {validacao && <div>{value.validado}</div>}
                        </>
                      );
                    } else if (typeof value === "number" && !isNaN(value)) {
                      content = value.toFixed(2);
                    } else {
                      content = value || "0";
                    }

                    return (
                      <Td
                        key={`row-${rowIndex}-col-${header}`}
                        position={isSticky ? 'sticky' : 'static'}
                        left={isSticky ? '0' : undefined}
                        zIndex={isSticky ? 1 : undefined}
                        bg={isSticky ? rowBg : undefined}
                        textAlign={textAlign}
                      >
                        {header === "titulo" ? (
                          <Box as="span" title={String(value)}>
                            {truncateText(String(value), 40)}
                          </Box>
                        ) : (
                          content
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal */}
      {isModalOpen && (
        <ValidaDocumentoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          idProjeto={id_projeto}
          idModelo={id_modelo}
          idDocumento={selectedDocumento}
        />
      )}
    </Box>
  );
};

export default DataTableResultModels;
