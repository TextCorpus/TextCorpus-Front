// src/pages/Login.tsx
import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Heading, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log(" emial ", email, " senha ", senha)

    try {
      const response = await axios.post('http://185.137.92.41:3001/auth/login', {
        email,
        senha,
      });

      const access_token = response.data.access_token;
      
      localStorage.setItem('token', access_token);

      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top", // Centralizado no topo
      });

      navigate('/');
    } catch (error) {
      console.error(error);

      toast({
        title: "Erro no login",
        description: "Email ou senha inválidos. Tente novamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top", // Centralizado no topo
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={8}
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="secondary"
      color="text"
    >
      <Heading mb={6} textAlign="center" color="primary">Login</Heading>
      <form onSubmit={handleLogin}>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
            border="1px solid black"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Senha</FormLabel>
          <Input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            required
            border="1px solid black"
          />
        </FormControl>

        <Button
          type="submit"
          isLoading={loading}
          bg="primary"
          color="white"
          _hover={{ bg: 'accent' }}
        >
          Entrar
        </Button>
      </form>
    </Box>
  );
};

export default Login;
