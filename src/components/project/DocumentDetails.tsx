import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Flex,
  Tooltip,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  Grid,
  GridItem,
  useToast
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Documento } from '../../types'; // Importe a interface Documento
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiagramProject } from '@fortawesome/free-solid-svg-icons';
import GraphModal from '../Graph/GraphModal';
import SobreDocumento from '../SobreDocumento';

interface DocumentDetailsProps {
  selectedDocumento: Documento;
  isEditing: boolean;
  setSelectedDocumento: React.Dispatch<React.SetStateAction<Documento | null>>;
  handleSaveClick: () => void;
  handleCancelClick: () => void;
  handleEditClick: () => void;
  isDescritor: boolean;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  selectedDocumento,
  isEditing,
  setSelectedDocumento,
  handleSaveClick, 
  handleCancelClick,
  handleEditClick,
  isDescritor,
}) => {
  const [palavrasChave, setPalavrasChave] = useState<string[]>(selectedDocumento.palavraChave || []);
  const [novaPalavraChave, setNovaPalavraChave] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para o modal
  const toast = useToast();

  useEffect(() => {
    setPalavrasChave(selectedDocumento.palavraChave || []);
  }, [selectedDocumento]);

  useEffect(() => {
    setSelectedDocumento((prevDocumento) => {
      if (!prevDocumento) {
        return null; 
      }
      return {
        ...prevDocumento,
        palavraChave: palavrasChave,
      };
    });
  }, [palavrasChave]);

  const handleAddPalavraChave = () => {
    if (novaPalavraChave.trim() !== '') {
      setPalavrasChave([...palavrasChave, novaPalavraChave.trim()]);
      setNovaPalavraChave('');
    } else {
      toast({
        title: 'Erro',
        description: 'A palavra-chave não pode estar vazia.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemovePalavraChave = (index: number) => {
    setPalavrasChave(palavrasChave.filter((_, i) => i !== index));
  };

  const handleOpenGraphModal = () => {
    setIsModalOpen(true); // Abre o modal
  };

  const handleCloseGraphModal = () => {
    setIsModalOpen(false); // Fecha o modal
  };

  return (
    <>
      <Grid templateColumns="70% 30%" gap={4}>
        <GridItem>
          <FormControl mb={4}>
            <FormLabel>Título</FormLabel>
            <Input
              type="text"
              value={selectedDocumento.titulo}
              onChange={(e) => setSelectedDocumento({ ...selectedDocumento, titulo: e.target.value })}
              isDisabled={!isEditing}
              border="1px solid black"
            />
          </FormControl>

          {!isDescritor && (
            <>
              <FormControl mb={4}>
                <FormLabel>Discente</FormLabel>
                <Input
                  type="text"
                  value={selectedDocumento.discente}
                  onChange={(e) => setSelectedDocumento({ ...selectedDocumento, discente: e.target.value })}
                  isDisabled={!isEditing}
                  border="1px solid black"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Orientador</FormLabel>
                <Input
                  type="text"
                  value={selectedDocumento.orientador}
                  onChange={(e) => setSelectedDocumento({ ...selectedDocumento, orientador: e.target.value })}
                  isDisabled={!isEditing}
                  border="1px solid black"
                />
              </FormControl>
            </>
          )}

          <FormControl mb={4}>
            <FormLabel>Resumo</FormLabel>
            <Textarea
              value={selectedDocumento.resumo}
              onChange={(e) => setSelectedDocumento({ ...selectedDocumento, resumo: e.target.value })}
              isDisabled={!isEditing}
              border="1px solid black"
              resize="vertical"
              rows={10}
            />
          </FormControl>

          <Flex mt={4}>
            {isEditing ? (
              <>
                <Tooltip label="Salvar">
                  <IconButton icon={<CheckIcon />} colorScheme="teal" onClick={handleSaveClick} mr={2} aria-label="Salvar" />
                </Tooltip>
                <Tooltip label="Cancelar">
                  <IconButton icon={<CloseIcon />} onClick={handleCancelClick} aria-label="Cancelar" />
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip label="Editar">
                  <IconButton
                    icon={<EditIcon boxSize={6} />} 
                    colorScheme="teal"
                    onClick={handleEditClick}
                    mr={2}
                    aria-label="Editar"
                  />
                </Tooltip>
                <Tooltip label="Ver grafo do texto">
                  <FontAwesomeIcon
                    icon={faDiagramProject}
                    style={{
                      fontSize: '24px',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      backgroundColor: 'teal',
                      borderRadius: '5px',
                      padding: '5px',
                      marginRight: '8px',
                      color: 'white',
                    }}
                    onClick={handleOpenGraphModal} // Abre o modal ao clicar
                    aria-label="Ver o grafo"
                  />
                </Tooltip>
                <Tooltip label="Excluir">
                  <IconButton
                    icon={<DeleteIcon boxSize={6} />} 
                    colorScheme="red"
                    aria-label="Excluir"
                    mr={2}
                  />
                </Tooltip>
              </>
            )}
          </Flex>
        </GridItem>

        <GridItem>
          <FormControl mb={4}>
            <FormLabel>Palavras-chave</FormLabel>
            <Input
              placeholder="Digite uma palavra-chave e pressione Enter"
              value={novaPalavraChave}
              onChange={(e) => setNovaPalavraChave(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isEditing) {
                  e.preventDefault();
                  handleAddPalavraChave();
                }
              }}
              isReadOnly={!isEditing}
              border="1px solid black"
            />
            <Flex mt={2} wrap="wrap">
              {palavrasChave.map((palavra, index) => (
                <Tag key={index} borderRadius="full" variant="solid" colorScheme="teal" mr={2} mb={2}>
                  <TagLabel>{palavra}</TagLabel>
                  {isEditing && (
                    <TagCloseButton onClick={() => handleRemovePalavraChave(index)} />
                  )}
                </Tag>
              ))}
            </Flex>
          </FormControl>
        </GridItem>
      </Grid>

      {/* Renderiza o GraphModal */}
      <SobreDocumento
        id_documento={selectedDocumento.id_documento}
        titulo={selectedDocumento.titulo}
        isOpen={isModalOpen}
        onClose={handleCloseGraphModal}
      />
    </>
  );
};

export default DocumentDetails;
