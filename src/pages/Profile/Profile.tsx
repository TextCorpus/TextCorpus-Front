import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

interface UserData {
  name: string;
  email: string;
  address: string;
  city: string;
  district: string;
  state: string;
}

const Profile: React.FC = () => {
  const toast = useToast();
  const [userData, setUserData] = useState<UserData>({
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Street',
    city: 'City',
    district: 'District',
    state: 'State',
  });

  const [selectedItem, setSelectedItem] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItemData, setNewItemData] = useState<UserData>({
    name: '',
    email: '',
    address: '',
    city: '',
    district: '',
    state: '',
  });
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar se está editando
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false); // Estado para controlar se o alerta de exclusão está aberto
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = () => {
    toast({
      title: 'Changes Saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    toast({
      title: 'Profile Picture Updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const items: UserData[] = [
    { name: 'Item 1', email: 'email@example.com', address: 'Address 1', city: 'City 1', district: 'District 1', state: 'State 1' },
    { name: 'Item 2', email: 'email@example.com', address: 'Address 2', city: 'City 2', district: 'District 2', state: 'State 2' },
  ];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEditItem = (item: UserData) => {
    setSelectedItem(item);
    setNewItemData(item);
    setIsEditing(true); // Define que está editando
    setIsModalOpen(true);
  };

  const handleDeleteItem = (item: UserData) => {
    setSelectedItem(item);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Implementar lógica para excluir o item
    setIsDeleteAlertOpen(false);
    toast({
      title: 'Item excluído com sucesso',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAddNewItem = () => {
    // Implementar lógica para adicionar novo item
    const newItem: UserData = { ...newItemData };
    items.push(newItem); // Adicionando novo item à lista de items
    setNewItemData({
      name: '',
      email: '',
      address: '',
      city: '',
      district: '',
      state: '',
    }); // Limpa os dados do novo item
    setIsModalOpen(false);
    toast({
      title: 'Novo item adicionado',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleModalClose = () => {
    setIsEditing(false); // Resetar o estado de edição quando o modal é fechado
    setIsModalOpen(false);
  };

  return (
    
    <Flex justify="center">
      <Box p="4" maxW="800px" w="100%" borderRadius="lg">
        <VStack spacing="6" align="stretch" p="6">
          <Heading size="lg" textAlign="center">
            {'Afiliação'}
          </Heading>
          <Flex direction="column" align="center">
            <Avatar size="xl" name={userData.name} src="caminho/para/foto" borderRadius="full" />
            <Button size="sm" colorScheme="blue" mt="3">
              Mudar Foto
            </Button>
            <input type="file" onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
          </Flex>
          <FormControl id="name">
            <FormLabel>Nome</FormLabel>
            <Input name="name" value={userData.name} onChange={handleInputChange} borderRadius="md" borderColor="blue.300" />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input name="email" value={userData.email} onChange={handleInputChange} borderRadius="md" borderColor="blue.300" isReadOnly />
          </FormControl>
          <Button colorScheme="blue" onClick={handleSaveChanges} alignSelf="center" width="200px" mb="2">
            Salvar
          </Button>
          <Modal isOpen={isModalOpen} onClose={handleModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{isEditing ? 'Editando Item' : 'Criando Novo Item'}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl id="name">
                  <FormLabel>Filiação</FormLabel>
                  <Input name="name" value={newItemData.name} onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })} borderRadius="md" borderColor="blue.300" />
                </FormControl>
               
                <FormControl id="address">
                  <FormLabel>Endereço</FormLabel>
                  <Input name="address" value={newItemData.address} onChange={(e) => setNewItemData({ ...newItemData, address: e.target.value })} borderRadius="md" borderColor="blue.300" />
                </FormControl>
                <FormControl id="city">
                  <FormLabel>Cidade</FormLabel>
                  <Input name="city" value={newItemData.city} onChange={(e) => setNewItemData({ ...newItemData, city: e.target.value })} borderRadius="md" borderColor="blue.300" />
                </FormControl>
                <FormControl id="district">
                  <FormLabel>Bairro</FormLabel>
                  <Input name="district" value={newItemData.district} onChange={(e) => setNewItemData({ ...newItemData, district: e.target.value })} borderRadius="md" borderColor="blue.300" />
                </FormControl>
                <FormControl id="state">
                  <FormLabel>UF</FormLabel>
                  <Input name="state" value={newItemData.state} onChange={(e) => setNewItemData({ ...newItemData, state: e.target.value })} borderRadius="md" borderColor="blue.300" />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={isEditing ? handleSaveChanges : handleAddNewItem} leftIcon={<FaPlus />}>
                  {isEditing ? 'Salvar Alterações' : 'Adicionar Novo'}
                </Button>
                <Button colorScheme="blue" ml={2} onClick={handleModalClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <FormControl id="search">
            <FormLabel>Buscar Filiação</FormLabel>
            <Flex align="center">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="md"
                borderColor="blue.300"
                placeholder="Digite para buscar..."
              />
              <Button
                colorScheme="blue"
                ml={2}
                onClick={() => {
                  setIsEditing(false); // Define que não está editando
                  setNewItemData({
                    name: '',
                    email: '',
                    address: '',
                    city: '',
                    district: '',
                    state: '',
                  }); // Limpa os dados do novo item
                  setIsModalOpen(true);
                }}
                leftIcon={<FaPlus />}
              >
                Adicionar
              </Button>
            </Flex>
          </FormControl>
          <VStack spacing="4" align="stretch">
            {currentItems.map((item, index) => (
              <Accordion key={index} allowToggle>
                <AccordionItem border="none">
                  <h2>
                    <AccordionButton _focus={{ boxShadow: 'none' }}>
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="bold">Filiação: {item.name}</Text>
                      </Box>
                      <Flex justify="flex-end" align="center">
                        <IconButton
                          aria-label="Editar"
                          icon={<Icon as={FaEdit} />}
                          onClick={() => handleEditItem(item)}
                          colorScheme="blue"
                          variant="ghost"
                          _hover={{ color: 'blue.500' }}
                        />
                        <IconButton
                          aria-label="Excluir"
                          icon={<Icon as={FaTrash} />}
                          onClick={() => handleDeleteItem(item)}
                          colorScheme="red"
                          variant="ghost"
                          _hover={{ color: 'red.500' }}
                          ml={2} // Adicionado marginLeft
                        />
                      </Flex>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="">Endereço: {item.address}</Text>
                    </Flex>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="">Cidade: {item.city}</Text>
                    </Flex>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="">Bairro: {item.district}</Text>
                    </Flex>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="">UF: {item.state}</Text>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            ))}
          </VStack>
          <Flex justify="center" mt={4}>
            {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
              <Button
                key={index}
                variant={index + 1 === currentPage ? "solid" : "outline"}
                mx={1}
                onClick={() => paginate(index + 1)}
                colorScheme="blue"
                bg="blue.400"
                color="white"
                _hover={{ bg: 'blue.500' }}
              >
                {index + 1}
              </Button>
            ))}
          </Flex>
          <AlertDialog
            isOpen={isDeleteAlertOpen}
            leastDestructiveRef={cancelRef}
            onClose={() => setIsDeleteAlertOpen(false)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Excluir Item
                </AlertDialogHeader>
                <AlertDialogBody>
                  Tem certeza que deseja excluir este item?
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                    Cancelar
                  </Button>
                  <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                    Excluir
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Profile;
