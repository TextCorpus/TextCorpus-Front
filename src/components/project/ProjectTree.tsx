import React from 'react';
import { Box, UnorderedList, ListItem, Flex, Collapse, Text, Icon } from '@chakra-ui/react';
import { FiFolder, FiFileText } from 'react-icons/fi';
import { Projeto, Documento } from '../../types'; // Importe as interfaces Projeto e Documento

interface ProjectTreeProps {
  projetos: Projeto[];
  expandedProjetoIds: number[];
  selectedProjeto: Projeto | null;
  selectedDocumento: Documento | null;
  toggleProjetoExpand: (id_projeto: number) => void;
  handleProjetoClick: (projeto: Projeto) => void;
  handleDocumentoClick: (documento: Documento) => void;
}

const ProjectTree: React.FC<ProjectTreeProps> = ({
  projetos,
  expandedProjetoIds,
  selectedProjeto,
  selectedDocumento,
  toggleProjetoExpand,
  handleProjetoClick,
  handleDocumentoClick,
}) => {
  return (
    <Box h="calc(100vh - 180px)" overflowY="auto">
      <UnorderedList styleType="none">
        {projetos.map((projeto) => (
          <ListItem key={projeto.id_projeto}>
            <Flex
              align="center"
              bg={selectedProjeto?.id_projeto === projeto.id_projeto ? 'teal.100' : 'transparent'}
              p={2}
              borderRadius="md"
            >
              <Icon as={FiFolder} boxSize={4} mr={2} color="teal.500" />
              {/* O clique no texto controla o colapso e a seleção do projeto */}
              <Text
                fontWeight="bold"
                cursor="pointer"
                onClick={() => {
                  handleProjetoClick(projeto);
                  toggleProjetoExpand(projeto.id_projeto); // Adiciona o toggle ao clicar no título
                }}
              >
                {projeto.titulo}
              </Text>
            </Flex>
            <Collapse in={expandedProjetoIds.includes(projeto.id_projeto)} animateOpacity>
              <UnorderedList ml={6} styleType="none">
                {projeto.documentos
                  .filter((documento) => documento.id_documento !== null) // Filtra documentos com id_documento não nulo
                  .map((documento) => (
                    <ListItem
                      key={documento.id_documento}
                      cursor="pointer"
                      onClick={() => handleDocumentoClick(documento)}
                      bg={selectedDocumento?.id_documento === documento.id_documento ? 'blue.100' : 'transparent'}
                      p={2}
                      borderRadius="md"
                    >
                      <Flex align="center">
                        <Icon as={FiFileText} boxSize={4} mr={2} color="gray.500" />
                        <Text isTruncated maxW="200px"> {/* Define a largura máxima e aplica truncamento */}
                          {documento.titulo}
                        </Text>
                      </Flex>
                    </ListItem>
                  ))}
              </UnorderedList>
            </Collapse>

          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default ProjectTree;
