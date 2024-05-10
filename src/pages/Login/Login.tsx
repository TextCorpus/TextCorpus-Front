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
  FormErrorMessage,
} from '@chakra-ui/react';
import colors from '../../theme/colors';
import { useNavigate } from 'react-router-dom';
import { AuthRepository } from '../../repository/auth/AuthRepossitory';
import { useUserStore } from '../../stores/UserStore';
import UserStorage from '../../util/UserStorage';
import { UserService } from '../../services/User/UserService';

const Login: React.FC = () => {
  const theme = extendTheme({ colors });
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);
  const [isSenhaError, setIsSenhaError] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useUserStore(); // Obter a função de login do hook useUserStore

  useEffect(() => {
    if (UserStorage.hasToken()) {
      navigate('/home');
    }
  }, []); 

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setIsEmailError(event.target.value === '');
  };

  const handleSenhaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(event.target.value);
    setIsSenhaError(event.target.value === '');
  };
  const handleLogin = async () => {
    try {
      await login(email, senha); // Chamar a função de login diretamente
      navigate('/home');
    } catch (error) {
      toast({
        position: 'top',
        title: 'Usuário e senha não conferem.',
        status: 'error',
        duration: 5000,
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
          <Stack flex={'1'} py={12} px={6} align={'center'} justify={'center'}>
            <Heading fontSize={'4xl'} color={colors.primary[600]}>
              Login
            </Heading>

            <FormControl isRequired isInvalid={isEmailError}>
              <FormLabel color={colors.primary[600]}>Email</FormLabel>
              <Input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={handleEmailChange}
              />
              {isEmailError && <FormErrorMessage>Email é necessário.</FormErrorMessage>}
            </FormControl>

            <FormControl isRequired isInvalid={isSenhaError}>
              <FormLabel color={colors.primary[600]}>Senha</FormLabel>
              <Input
                required
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={handleSenhaChange}
              />
              {isSenhaError && <FormErrorMessage>Senha é necessária.</FormErrorMessage>}
            </FormControl>

            <Button
              bg={colors.primary[500]}
              color={'white'}
              _hover={{
                bg: colors.primary[600],
              }}
              onClick={handleLogin}
              type="submit"
            >
              Logar
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
