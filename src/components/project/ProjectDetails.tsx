import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  HStack,
  Flex,
  Tooltip,
  IconButton
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Projeto } from '../../types'; // Importe a interface Projeto
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import ModelosModal from '../modelo/ModelosList';
import ModelosConstruidos from '../ModelosConstruidos';

interface ProjectDetailsProps {
  selectedProjeto: Projeto;
  isEditing: boolean;
  isNew: boolean;
  setSelectedProjeto: React.Dispatch<React.SetStateAction<Projeto | null>>;
  handleSaveClick: () => void;
  handleCancelClick: () => void;
  handleEditClick: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  selectedProjeto,
  isEditing,
  isNew,
  setSelectedProjeto,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGrafiOpen, setIsGrafiOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleGrafiOpen = () => setIsGrafiOpen(true);
  const handleGrafiClose = () => setIsGrafiOpen(false);

  return (
    <>
      <FormControl mb={4}>
        <FormLabel>Título</FormLabel>
        <Input
          type="text"
          value={selectedProjeto.titulo}
          onChange={(e) => setSelectedProjeto({ ...selectedProjeto, titulo: e.target.value })}
          isDisabled={!isEditing}
          border="1px solid black"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Ano Inicial</FormLabel>
        <Input
          type="number"
          value={selectedProjeto.ano_inicial.toString()}
          onChange={(e) => setSelectedProjeto({ ...selectedProjeto, ano_inicial: +e.target.value })}
          isDisabled={!isEditing}
          border="1px solid black"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Ano Final</FormLabel>
        <Input
          type="number"
          value={selectedProjeto.ano_final.toString()}
          onChange={(e) => setSelectedProjeto({ ...selectedProjeto, ano_final: +e.target.value })}
          isDisabled={!isEditing}
          border="1px solid black"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Descritor</FormLabel>
        <RadioGroup
          onChange={(value) => setSelectedProjeto({ ...selectedProjeto, descritor: value === 'Sim' })}
          value={selectedProjeto.descritor ? 'Sim' : 'Não'}
          isDisabled={!isEditing || isNew}
        >
          <HStack spacing={4}>
            <Radio value="Sim">Sim</Radio>
            <Radio value="Não">Não</Radio>
          </HStack>
        </RadioGroup>
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
              <IconButton icon={<EditIcon />} colorScheme="teal" onClick={handleEditClick} mr={2} aria-label="Editar" />
            </Tooltip>

            {selectedProjeto.descritor && (<Tooltip label="Aprendizagem">
              <FontAwesomeIcon
                icon={faMicrochip}
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
                onClick={handleModalOpen} // Abre o modal ao clicar
                aria-label="Aprendizagem"
              />
            </Tooltip>)}

            <Tooltip label="Relatórios">
              <FontAwesomeIcon
                icon={faChartPie}
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
                onClick={handleGrafiOpen} // Abre o modal de relatórios ao clicar
                aria-label="Relatórios"
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

      {/* Modal de Aprendizagem */}
      {selectedProjeto && (
        <ModelosModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          id_projeto={selectedProjeto.id_projeto}
        />
      )}

      {selectedProjeto && (
        <ModelosConstruidos
          isOpen={isGrafiOpen}
          onClose={handleGrafiClose}
          id_projeto={selectedProjeto.id_projeto}
        />
      )}

    </>
  );
};

export default ProjectDetails;
