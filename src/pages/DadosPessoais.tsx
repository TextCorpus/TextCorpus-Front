import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Spinner,
  Flex,
  Button,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import DataTable from '../components/dataTable/DataTable'; // Certifique-se de que o DataTable está corretamente importado
import { User } from '../types';
import { useCustomToast } from '../utils/toastUtils';
import paginaAfiliacao from '../screens/columnsAfiliacao.json';

const DadosPessoais: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // O estado inicial é "não editando"
  const [emailError, setEmailError] = useState<string | null>(null); // Novo estado para o erro de validação do email
  const inputBorderColor = useColorModeValue('gray.400', 'gray.600');

  const token = localStorage.getItem('token');
  const toast = useCustomToast();  // Usando o useToast para exibir notificações
  const toastRef = useRef(toast);  // Memoizando o toast para evitar recriação

  const axiosInstance = useMemo(() => {
    return axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [token]);

  // Função para buscar dados do usuário
  useEffect(() => {
    if (isEditing) return; // Desabilita o useEffect se o usuário estiver editando
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('http://185.137.92.41:3001/users');
        if (response.status === 200) {
          setUser(response.data);
        } else {
          window.location.href = '/login';
        }
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          window.location.href = '/login';
        } else {
          console.error('Erro ao buscar dados do usuário:', err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [axiosInstance, isEditing]); // Condiciona a execução ao estado `isEditing`

  // Função para validar o email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expressão regular para validação de email
    return emailRegex.test(email);
  };

  // Função para lidar com as mudanças nos inputs
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      // Valida o email sempre que ele for alterado
      if (!validateEmail(value)) {
        setEmailError('Email inválido');
      } else {
        setEmailError(null);
      }
    }
    setUser((prevUser) => ({
      ...prevUser!,
      [name]: value,
    }));
    setIsEditing(true); // Ativa a edição ao mudar nome ou email
  };

  // Função para salvar as alterações
  const handleSave = async () => {
    if (emailError) {
      toastRef.current({
        title: 'Erro',
        description: 'Corrija os erros antes de salvar.',
        status: 'error',
      });
      return;
    }
    try {
      const response = await axiosInstance.patch('http://185.137.92.41:3001/users', {
        nome: user?.nome,
        email: user?.email,
      });
      if (response.status === 200) {
        setIsEditing(false); // Reseta o estado de edição
        toastRef.current({
          title: 'Sucesso',
          description: 'Dados salvos com sucesso!',
          status: 'success',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      toastRef.current({
        title: 'Erro',
        description: 'Erro ao salvar os dados!',
        status: 'error',
      });
    }
  };

  // Função para cancelar as alterações
  const handleCancel = () => {
    setIsEditing(false); // Cancela a edição e desabilita os botões
    // Recarrega os dados do usuário ao cancelar
    const fetchUserData = async () => {
      const response = await axiosInstance.get('http://185.137.92.41:3001/users');
      setUser(response.data);
    };
    fetchUserData();
  };
  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={4} bg="secondary" color="text">
      <Heading mb={4} color="primary">Dados Pessoais</Heading>
      <Box border="1px solid" borderColor="gray.400" p={4} mb={8} borderRadius="md">
        <Flex mb={4} gap={4}>
          <FormControl>
            <FormLabel>Nome</FormLabel>
            <Input
              type="text"
              name="nome"
              value={user?.nome ?? ''}
              onChange={handleUserChange}
              border={`1px solid ${inputBorderColor}`}
            />
          </FormControl>
          <FormControl w="30%" isInvalid={!!emailError}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={user?.email ?? ''}
              onChange={handleUserChange}
              border={`1px solid ${inputBorderColor}`}
            />
            {emailError && (
              <Text color="red.500" fontSize="sm">
                {emailError}
              </Text>
            )}
          </FormControl>
        </Flex>

        {isEditing && ( // Exibe os botões somente se estiver editando
          <Flex mt={4} gap={4}>
            <Button colorScheme="blue" onClick={handleSave} isDisabled={!!emailError}>
              Salvar
            </Button>
            <Button colorScheme="red" onClick={handleCancel}>
              Cancelar
            </Button>
          </Flex>
        )}
      </Box>

      {!isEditing && (
        <Box border="1px solid" borderColor="gray.400" p={4} borderRadius="md">
          {/* Aqui está a lista de afiliações */}
          <DataTable
            columns={paginaAfiliacao.columns}  // O JSON contendo as colunas é carregado de `paginaAfiliacao`
            fetchEndpoint={paginaAfiliacao.fetchEndpoint}  // Endpoint de fetch definido no JSON
            createEndpoint={paginaAfiliacao.createEndpoint}  // Endpoint de criação definido no JSON
            updateEndpoint={paginaAfiliacao.updateEndpoint}  // Endpoint de atualização definido no JSON
            deleteEndpoint={paginaAfiliacao.deleteEndpoint}  // Endpoint de exclusão definido no JSON
            infoText="Lista de afiliações"  // Texto informativo passado como string
          />

        </Box>
      )}
    </Box>
  );
};

export default DadosPessoais;
