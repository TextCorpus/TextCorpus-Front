import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  VStack,
} from '@chakra-ui/react';
import ProjectTree from '../components/project/ProjectTree';
import ProjectDetails from '../components/project/ProjectDetails';
import DocumentDetails from '../components/project/DocumentDetails';
import { ChevronDownIcon, AddIcon, DownloadIcon } from '@chakra-ui/icons';
import { Projeto, Documento } from '../types';
import FileUpload from '../components/project/FileUpload';
import fetchData from '../utils/fetchData';
import { useCustomToast } from '../utils/toastUtils';

// Função para buscar projetos
const fetchProjetos = async (toast: any, descritor: number): Promise<Projeto[]> => {
  return await fetchData(`http://185.137.92.41:3001/access/convidado/${descritor}`, 'get', toast);
};

interface ProjetosProps {
  descritor: number;
}

const Projetos: React.FC<ProjetosProps> = ({ descritor }) => {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjetoIds, setExpandedProjetoIds] = useState<number[]>([]);
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [selectedDocumento, setSelectedDocumento] = useState<Documento | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isNewDocument, setIsNewDocument] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const toast = useCustomToast();

  useEffect(() => {
    fetchProjetos(toast, descritor).then((data) => {
      setProjetos(data);
      setLoading(false);
    });
  }, [descritor]);

  const toggleProjetoExpand = (id_projeto: number) => {
    if (expandedProjetoIds.includes(id_projeto)) {
      setExpandedProjetoIds((prev) => prev.filter((projetoId) => projetoId !== id_projeto));
    } else {
      setExpandedProjetoIds((prev) => [...prev, id_projeto]);
    }
  };

  const handleProjetoClick = async (projeto: Projeto) => {
    const projetoDetalhado = await fetchData(`http://185.137.92.41:3001/projetos/${projeto.id_projeto}`, 'get', toast);
    if (projetoDetalhado) {
      const { criador, ...restanteProjeto } = projetoDetalhado; // Exclui os dados do criador
      setSelectedProjeto(restanteProjeto);
      setSelectedDocumento(null); // Limpa a seleção de documento ao selecionar um projeto
      setIsEditing(false);
    }
  };

  const handleDocumentoClick = async (documento: Documento) => {
    const documentoDetalhado = await fetchData(`http://185.137.92.41:3001/documento/${documento.id_documento}`, 'get', toast);
    if (documentoDetalhado) {
      const { graphData, ...restanteDocumento } = documentoDetalhado; // Exclui o campo graphData
      setSelectedDocumento(restanteDocumento);
      setIsEditing(false);
    }
  };

  const handleNewDocumentClick = () => {
    if (!selectedProjeto) {
      toast({
        title: 'Erro',
        description: 'Selecione um projeto antes de adicionar um documento.',
        status: 'error',
      });
      return;
    }
    setSelectedDocumento({
      id_documento: 0,
      titulo: '',
      resumo: '',
      anoPublicacao: 0,
      palavraChave: [],
      discente: "",
      orientador: "",
      projeto: selectedProjeto.id_projeto
    });
    setIsEditing(true);
    setIsNewDocument(true);
  };

  const handleSaveDocument = async () => {
    if (isNewDocument) {
      await fetchData('http://185.137.92.41:3001/documento', 'post', toast, selectedDocumento);
    } else {
      await fetchData(`http://185.137.92.41:3001/documento/${selectedDocumento?.id_documento}`, 'patch', toast, selectedDocumento);
    }
    setIsEditing(false);
    setIsNewDocument(false);
    const data = await fetchProjetos(toast, descritor);
    setProjetos(data);
  };

  const handleSaveProject = async () => {

    if (isNewProject) {
      await fetchData('http://185.137.92.41:3001/projetos', 'post', toast, selectedProjeto);
    } else {
      await fetchData(`http://185.137.92.41:3001/projetos/${selectedProjeto?.id_projeto}`, 'patch', toast, selectedProjeto);
    }
    setIsEditing(false);
    setIsNewProject(false);
    const data = await fetchProjetos(toast, descritor);
    setProjetos(data);

  };

  const handleNewProjectClick = () => {
    setSelectedProjeto({
      id_projeto: 0,
      titulo: '',
      ano_inicial: new Date().getFullYear(),
      ano_final: new Date().getFullYear(),
      descritor: false,
      documentos: []
    });
    setSelectedDocumento(null);
    setIsEditing(true);
    setIsNewProject(true);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  const handleFileUploadOpen = () => {
    setIsFileUploadOpen(true);
  };

  const handleFileUploadClose = () => {
    setIsFileUploadOpen(false);
  };

  return (
    <Grid templateColumns="30% 69%" height="100%" gap={4}>
      <GridItem
        border="1px solid"
        borderColor="gray.400"
        p={4}
        mb={8}
        borderRadius="md"
      >
        {/* Botão de ações fixo, fora da área de rolagem */}
        <Box position="sticky" top={0} zIndex={1} pb={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal">
              Ações
            </MenuButton>
            <MenuList>
              <MenuItem icon={<AddIcon />} onClick={handleNewProjectClick}>
                Incluir Projeto
              </MenuItem>
              <MenuItem icon={<AddIcon />} onClick={handleNewDocumentClick}>
                Incluir Documento
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<DownloadIcon />} onClick={handleFileUploadOpen}>
                Importar Dados do Excel
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>

        {/* Conteúdo com rolagem, exceto o botão de ações */}
        <VStack
          spacing={4}
          align="start"
          mt={4}
          overflowY="auto" // Scroll apenas quando necessário
          maxHeight="calc(70vh - 60px)" // Limita a altura para o scroll funcionar, descontando a altura do botão
        >
          {isFileUploadOpen && (
            <FileUpload isOpen={isFileUploadOpen} onClose={handleFileUploadClose} id_projeto={selectedProjeto?.id_projeto ?? 0} />
          )}

          <ProjectTree
            projetos={projetos}
            expandedProjetoIds={expandedProjetoIds}
            selectedProjeto={selectedProjeto}
            selectedDocumento={selectedDocumento}
            toggleProjetoExpand={toggleProjetoExpand}
            handleProjetoClick={handleProjetoClick}
            handleDocumentoClick={handleDocumentoClick}
          />
        </VStack>
      </GridItem>

      <GridItem
        border="1px solid"
        borderColor="gray.400"
        p={4}
        mb={8}
        borderRadius="md"
        overflowY="auto" // Scroll apenas quando necessário
        maxHeight="100%"
      >
        {selectedProjeto && !selectedDocumento && (
          <ProjectDetails
            selectedProjeto={selectedProjeto}
            isEditing={isEditing}
            isNew={!isNewProject}
            setSelectedProjeto={setSelectedProjeto}
            handleSaveClick={handleSaveProject}
            handleCancelClick={() => setIsEditing(false)}
            handleEditClick={() => setIsEditing(true)}
          />
        )}

        {selectedDocumento && (
          <DocumentDetails
            selectedDocumento={selectedDocumento}
            isEditing={isEditing}
            setSelectedDocumento={setSelectedDocumento}
            handleSaveClick={handleSaveDocument}
            handleCancelClick={() => { setIsEditing(false); setIsNewProject(false); }}
            handleEditClick={() => { setIsEditing(true); setIsNewProject(false); }}
            isDescritor={selectedProjeto?.descritor ?? false}
          />
        )}
        {!selectedProjeto && !selectedDocumento && (
          <Box>Selecione um projeto ou documento para ver os detalhes.</Box>
        )}
      </GridItem>
    </Grid>
  );
};

export default Projetos;
