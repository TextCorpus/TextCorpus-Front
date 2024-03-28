import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Avatar,
  Flex,
  useToast,
  Heading,
  Spacer
} from '@chakra-ui/react';

interface UserData {
  name: string;
  address: string;
  city: string;
  district: string;
  state: string;
  affiliation: string;
}

const Profile: React.FC = () => {
  const toast = useToast();
  const [userData, setUserData] = useState<UserData>({
    name: 'John Doe',
    address: '123 Street',
    city: 'City',
    district: 'District',
    state: 'State',
    affiliation: 'Affiliation'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = () => {
    // Adicione aqui a lógica para salvar as alterações no perfil
    toast({
      title: 'Changes Saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Adicione aqui a lógica para alterar a foto de perfil
    const file = e.target.files?.[0];
    // Lógica para carregar e exibir a nova foto de perfil
    toast({
      title: 'Profile Picture Updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex minHeight="100vh" justifyContent="center" alignItems="center" bg="gray.50">
      <Box p="4" maxWidth="600px" bg="white" borderRadius="lg" boxShadow="xl">
        <VStack spacing="6" align="stretch">
          <Heading size="lg" textAlign="center">Perfil</Heading>
          <Flex flexDirection="column" alignItems="center">
            <Avatar size="xl" name={userData.name} src="caminho/para/foto" borderRadius="full" />
            <Button size="sm" colorScheme="blue" mt={3}>
              Mudar Foto
            </Button>
            <input type="file" onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
          </Flex>
          <FormControl id="name">
            <FormLabel>Nome</FormLabel>
            <Input name="name" value={userData.name} onChange={handleInputChange} borderRadius="md" borderColor="blue.300" />
          </FormControl>
          <FormControl id="address">
            <FormLabel>Endereço</FormLabel>
            <Input name="address" value={userData.address} onChange={handleInputChange} borderRadius="md" borderColor="blue.300" />
          </FormControl>
          <Flex>
            <FormControl id="city" flex="1" mr={{ base: 0, md: 4 }}>
              <FormLabel>Cidade</FormLabel>
              <Input name="city" value={userData.city} onChange={handleInputChange} borderRadius="md" borderColor="blue.300" />
            </FormControl>
            <FormControl id="district" flex="1" ml={{ base: 0, md: 4 }} mt={{ base: 4, md: 0 }}>
              <FormLabel>Bairro</FormLabel>
              <Input name="district" value={userData.district} onChange={handleInputChange} borderRadius="md" borderColor="blue.300" />
            </FormControl>
          </Flex>
          <Flex>
            <FormControl id="state" flex="1" mr={{ base: 0, md: 4 }}>
              <FormLabel>UF</FormLabel>
              <Input name="state" value={userData.state} onChange={handleInputChange} borderRadius="md" borderColor="blue.300" />
            </FormControl>
            <FormControl id="affiliation" flex="1" ml={{ base: 0, md: 4 }} mt={{ base: 4, md: 0 }}>
              <FormLabel>Filiação</FormLabel>
              <Input name="affiliation" value={userData.affiliation} onChange={handleInputChange} borderRadius="md" borderColor="blue.300" />
            </FormControl>
          </Flex>
          <Button colorScheme="blue" onClick={handleSaveChanges} alignSelf="center">Salvar</Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Profile;
