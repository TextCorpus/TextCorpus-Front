import React, { useState } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import colors from '../../theme/colors'; // Importando as cores padrão

const PasswordRecovery: React.FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const toast = useToast();

  const handleSendEmail = () => {
    // Simulação de envio de e-mail com o código de recuperação
    if (email) {
      // Simulação de envio de e-mail bem-sucedido
      toast({
        title: 'E-mail de recuperação enviado',
        description: `Um e-mail de recuperação foi enviado para ${email}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setStep(2);
    } else {
      // Exibir mensagem de erro se nenhum e-mail for fornecido
      toast({
        title: 'Erro ao enviar e-mail',
        description: 'Por favor, forneça um endereço de e-mail válido.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVerifyCode = () => {
    // Simulação de verificação do código de recuperação
    if (code === '123456') {
      setStep(3);
    } else {
      // Exibir mensagem de erro se o código estiver incorreto
      toast({
        title: 'Código inválido',
        description: 'O código inserido é inválido. Por favor, tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleResetPassword = () => {
    // Simulação de redefinição de senha
    // Verifica se a senha e a confirmação da senha são iguais
    if (password === confirmPassword) {
      toast({
        title: 'Senha redefinida',
        description: 'Sua senha foi redefinida com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Reiniciar os campos e voltar para a primeira etapa
      setEmail('');
      setCode('');
      setPassword('');
      setConfirmPassword('');
      setStep(1);
    } else {
      // Exibir mensagem de erro se as senhas não coincidirem
      toast({
        title: 'Senhas não coincidem',
        description: 'A senha e a confirmação da senha não são iguais. Por favor, tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FormControl id="email" isRequired>
            <FormLabel>E-mail</FormLabel>
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button mt={4} colorScheme="teal" bgColor={colors.primary[500]} color="white" onClick={handleSendEmail}>
              Enviar e-mail de recuperação
            </Button>
          </FormControl>
        );
      case 2:
        return (
          <FormControl id="code" isRequired>
            <FormLabel>Código de Recuperação</FormLabel>
            <Input
              type="text"
              placeholder="Digite o código enviado por e-mail"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button mt={4} colorScheme="teal" bgColor={colors.primary[500]} color="white" onClick={handleVerifyCode}>
              Verificar Código
            </Button>
          </FormControl>
        );
      case 3:
        return (
          <FormControl id="password" isRequired>
            <FormLabel>Nova Senha</FormLabel>
            <Input
              type="password"
              placeholder="Digite sua nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormLabel mt={4}>Confirmar Nova Senha</FormLabel>
            <Input
              type="password"
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button mt={4} colorScheme="teal" bgColor={colors.primary[500]} color="white" onClick={handleResetPassword}>
              Redefinir Senha
            </Button>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={colors.primary[50]}
    >
      <Stack spacing={8} mx={'auto'} maxW={'md'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color={colors.primary[700]}>Recuperação de Senha</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={'white'}
          boxShadow={'lg'}
          p={8}
        >
          {renderStep()}
        </Box>
        <Text align={'center'}>
          Lembrou da senha?{' '}
          <Link color={colors.primary[500]} href={'/'}>
            Faça Login
          </Link>
        </Text>
      </Stack>
    </Flex>
  );
};

export default PasswordRecovery;
