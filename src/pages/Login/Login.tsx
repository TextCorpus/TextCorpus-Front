import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react';
import colors from '../../theme/colors';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";



const theme = extendTheme({ colors });

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate(); // Hook para redirecionamento

  const { login, isAuthenticated, isLoading } = useAuth();


  useEffect(() => { isAuthenticated && navigate('/') }, [])


  const handleLogin = () => {
    // Simulação de lógica de autenticação
    if (email === 'usuario@example.com' && password === 'senha123') {
      toast({
        title: 'Login bem-sucedido',
        description: 'Você foi autenticado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/home'); // Redireciona para a página Home após o login bem-sucedido
    } else {
      toast({
        title: 'Erro de login',
        description: 'Credenciais inválidas. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue(colors.primary[50], colors.primary[800])}
      >
        <Flex
          direction={['column', 'row']}
          rounded={'xl'}
          bg={useColorModeValue('white', colors.secondary[800])}
          boxShadow={'xl'}
          p={8}
          maxW={'800px'}
        >
          <Box flex={'1'} p={8} display={['none', 'block']}>
            {/* Aqui vai a imagem */}
            <img src="https://via.placeholder.com/400" alt="Imagem de Login" />
          </Box>
          <Stack
            flex={'1'}
            py={12}
            px={6}
            align={'center'}
            justify={'center'}
          >
            <Heading fontSize={'4xl'} color={colors.primary[600]}>
              Login
            </Heading>
            <FormControl id="email" isRequired>
              <FormLabel color={colors.primary[600]}>Email</FormLabel>
              <Input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel color={colors.primary[600]}>Senha</FormLabel>
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              bg={colors.primary[500]}
              color={'white'}
              _hover={{
                bg: colors.primary[600],
              }}
              onClick={handleLogin}
              disabled={isLoading}
              type='submit'
            >
              {isLoading ? 'Carregando...' : 'Entrar'}
            </Button>
            <Text align={'center'} mt={2}>
              Esqueceu sua senha?{' '}
              <Link color={colors.primary[600]} href={'/esqueci-minha-senha'}>
                Recuperar senha
              </Link>
            </Text>
          </Stack>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Login;
