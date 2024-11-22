import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import DataTable from '../components/dataTable/DataTable';
import paginaAfiliacao from '../screens/columnsModelos.json';

// Colunas para outra tabela (pode usar as mesmas ou alterar conforme a necessidade)
//const columnsOutraTabela: Column[] = paginaAfiliacao as Column[];

const CadastroModelo: React.FC = () => {
    return (
        <Flex direction="row" width="100%" gap={8}> {/* Adicionando o gap entre as tabelas */}
            {/* Tabela da esquerda, ocupando 75% */}
            <Box flex="3" border="1px solid" borderColor="gray.400" p={4} mb={8} borderRadius="md">
                <DataTable
                    columns={paginaAfiliacao.columns}
                    fetchEndpoint={paginaAfiliacao.fetchEndpoint}
                    createEndpoint={paginaAfiliacao.createEndpoint}
                    updateEndpoint={paginaAfiliacao.updateEndpoint}
                    deleteEndpoint={paginaAfiliacao.deleteEndpoint}
                    dynamicSelectEndpoint={"http://185.137.92.41:3001/projetos/list"}
                    dynamicSelectValueField={"id_projeto"}
                    dynamicSelectLabelField={"titulo"}
                    infoText="Documentos"
                />
            </Box>
        </Flex>
    );
};

export default CadastroModelo;
