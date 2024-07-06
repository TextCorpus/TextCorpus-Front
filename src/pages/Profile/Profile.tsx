import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  IconButton,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
} from '@chakra-ui/react';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { User } from '../../entity/user/User';
import { Filiacao } from '../../entity/Filiacao/Filiacao';
import { UserService } from '../../services/User/UserService';
import { FiliacaoService } from '../../services/Filiacao/FiliacaoService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<User>({
    id_user: 0,
    nome: '',
    email: '',
    senha: '',
    filiacoes: [],
  });
  const [filiacoes, setFiliacoes] = useState<Filiacao[]>([]);
  const [filiacaoData, setFiliacaoData] = useState<Filiacao>({
    nome: '',
    endereco: '',
    cidade: '',
    bairro: '',
    uf: '',
    id_user: 0,
    id_perfil: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalUserData, setOriginalUserData] = useState<User>({
    id_user: 0,
    nome: '',
    email: '',
    senha: '',
    filiacoes: [],
  });

  useEffect(() => {
    loadUserData();
    
  }, []);

  useEffect(() => {
    // When entering edit mode, store the original user data
    if (isEditing) {
      setOriginalUserData(userData);
    }
  }, [isEditing, userData]);

  const loadUserData = async () => {
    try {
      const user = await UserService.getByID();
      setUserData(user);
      setFiliacoes(user.filiacoes);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data.');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      await UserService.update(userData);
      toast.success('User data saved successfully.');
      setIsEditing(false); // Exit editing mode after save
    } catch (error) {
      console.error('Error saving user data:', error);
      toast.error('Failed to save user data.');
    }
  };

  const handleCancelEdit = () => {
    // Restore original user data and exit editing mode
    setUserData(originalUserData);
    setIsEditing(false);
  };

  const handleEditFiliacao = (filiacao: Filiacao) => {
    console.log(filiacao);
    setFiliacaoData(filiacao);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleSaveFiliacao = async () => {
    try {
      // Remove id_perfil from filiacaoData if it exists
  
      if (isEditing) {
        await FiliacaoService.update(filiacaoData);
      } else {
        await FiliacaoService.create(filiacaoData);
        loadUserData(); // Reload filiacoes after creating new one
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving filiacao data:', error);
      toast.error('Failed to save filiacao data.');
    }
  };
  const handleCreateFiliacao = () => {
    setFiliacaoData({
      nome: '',
      endereco: '',
      cidade: '',
      bairro: '',
      uf: '',
      id_user: userData.id_user,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <Flex justify="center" align="center" h="100vh" bg="gray.100">
      <Box p="4" maxW="800px" w="100%" borderRadius="lg" boxShadow="md" bg="white">
        <Heading size="lg" textAlign="center" mb="4">
          Perfil
        </Heading>
        <Flex direction="column" align="center" mb="4">
          <FormControl id="nome" mt="4" w="100%">
            <FormLabel>Nome</FormLabel>
            <Input
              name="nome"
              value={userData.nome}
              onChange={handleInputChange}
              borderRadius="md"
              borderColor="blue.300"
              isReadOnly
            />
          </FormControl>
          <FormControl id="email" mt="4" w="100%">
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              borderRadius="md"
              borderColor="blue.300"
              isReadOnly
            />
          </FormControl>
          
          <Heading size="md" textAlign="center" mt="4">
           Afiliações
          </Heading>
          <Accordion mt="4" w="100%">
            {filiacoes.map((filiacao) => (
              <AccordionItem key={filiacao.id_user} border="none">
                <h2>
                  <AccordionButton _focus={{ boxShadow: 'none' }}>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold">Filiação: {filiacao.nome}</Text>
                    </Box>
                    <Flex justify="flex-end" align="center">
                      <IconButton
                        aria-label="Edit"
                        icon={<Icon as={FaEdit} />}
                        onClick={() => handleEditFiliacao(filiacao)}
                        colorScheme="blue"
                        variant="ghost"
                        _hover={{ color: 'blue.500' }}
                        mr="2"
                      />
                    </Flex>
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text fontWeight="bold">Endereço:</Text>
                  <Text>{filiacao.endereco}</Text>
                  <Text fontWeight="bold">Cidade:</Text>
                  <Text>{filiacao.cidade}</Text>
                  <Text fontWeight="bold">Bairro:</Text>
                  <Text>{filiacao.bairro}</Text>
                  <Text fontWeight="bold">UF:</Text>
                  <Text>{filiacao.uf}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            variant="outline"
            mt="4"
            onClick={handleCreateFiliacao}
          >
            Adicionar Filiação
          </Button>

          <Modal isOpen={isModalOpen} onClose={handleModalClose}>
            <ModalOverlay />
            <ModalContent borderRadius="md">
              <ModalHeader>
                {isEditing ? 'Editando Filiação' : 'Adicionando Nova Filiação'}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl id="nome">
                  <FormLabel>Nome</FormLabel>
                  <Input
                    name="nome"
                    value={filiacaoData.nome}
                    onChange={(e) =>
                      setFiliacaoData({ ...filiacaoData, nome: e.target.value })
                    }
                    borderRadius="md"
                    borderColor="blue.300"
                  />
                </FormControl>
                <FormControl id="endereco" mt="2">
                  <FormLabel>Endereço</FormLabel>
                  <Input
                    name="endereco"
                    value={filiacaoData.endereco}
                    onChange={(e) =>
                      setFiliacaoData({
                        ...filiacaoData,
                        endereco: e.target.value,
                      })
                    }
                    borderRadius="md"
                    borderColor="blue.300"
                  />
                </FormControl>
                <FormControl id="cidade" mt="2">
                  <FormLabel>Cidade</FormLabel>
                  <Input
                    name="cidade"
                    value={filiacaoData.cidade}
                    onChange={(e) =>
                      setFiliacaoData({
                        ...filiacaoData,
                        cidade: e.target.value,
                      })
                    }
                    borderRadius="md"
                    borderColor="blue.300"
                  />
                </FormControl>
                <FormControl id="bairro" mt="2">
                  <FormLabel>Bairro</FormLabel>
                  <Input
                    name="bairro"
                    value={filiacaoData.bairro}
                    onChange={(e) =>
                      setFiliacaoData({
                        ...filiacaoData,
                        bairro: e.target.value,
                      })
                    }
                    borderRadius="md"
                    borderColor="blue.300"
                  />
                </FormControl>
                <FormControl id="uf" mt="2">
                  <FormLabel>UF</FormLabel>
                  <Input
                    name="uf"
                    value={filiacaoData.uf}
                    onChange={(e) =>
                      setFiliacaoData({ ...filiacaoData, uf: e.target.value })
                    }
                    maxLength={2}
                    borderRadius="md"
                    borderColor="blue.300"
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={handleSaveFiliacao}
                  disabled={
                    !filiacaoData.nome ||
                    !filiacaoData.endereco ||
                    !filiacaoData.cidade ||
                    !filiacaoData.bairro ||
                    !filiacaoData.uf
                  }
                >
                  Salvar
                </Button>
                <Button variant="ghost" onClick={handleModalClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Profile;
