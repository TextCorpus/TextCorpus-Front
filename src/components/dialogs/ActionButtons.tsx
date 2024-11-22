import React from 'react';
import { Button, HStack } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';

type ActionButtonsProps = {
  isEditing: boolean;
  isNewItem: boolean;
  selectedItem: string | number | null;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isEditing,
  isNewItem,
  selectedItem,
  onAdd,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
}) => {
  return (
    <HStack spacing={4} mb={4}>
      {/* Botão de adicionar novo item */}
      {!isEditing && !isNewItem && (
        <Button colorScheme="green" onClick={onAdd} leftIcon={<AddIcon />}>
          Adicionar
        </Button>
      )}

      {/* Botões de edição, exclusão, confirmação e cancelamento */}
      {selectedItem !== null && !isEditing && !isNewItem && (
        <>
          <Button colorScheme="blue" onClick={onEdit} leftIcon={<EditIcon />}>
            Editar
          </Button>
          <Button colorScheme="red" onClick={onDelete} leftIcon={<DeleteIcon />}>
            Excluir
          </Button>
        </>
      )}

      {/* Botões de confirmar e cancelar edição/adição */}
      {(isEditing || isNewItem) && (
        <>
          <Button onClick={onConfirm} leftIcon={<CheckIcon />}>
            Confirmar
          </Button>
          <Button  onClick={onCancel} leftIcon={<CloseIcon />}>
            Cancelar
          </Button>
        </>
      )}
    </HStack>
  );
};

export default ActionButtons;
