import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const Home = () => {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.800')} py="20">
      <Container maxW="3xl" textAlign="center">
        <Heading as="h1" size="xl" mb="6">
          SISTEMA DE PROCESSAMENTO DE TEXTO PARA ANÁLISE E APRENDIZADO
        </Heading>
        <Text fontSize="lg" mb="8">
          <strong>INTRODUÇÃO:</strong> Bem-vindo ao nosso sistema de processamento de texto avançado, projetado para facilitar a análise de documentos e promover o aprendizado contínuo. Utilizando técnicas de processamento de linguagem natural, nosso sistema é capaz de identificar padrões, semelhanças e insights valiosos em documentos textuais.
        </Text>
        <Heading as="h2" size="lg" mb="4">
          COMO FUNCIONA:
        </Heading>
        <Text mb="8">
          <strong>UPLOAD DO DOCUMENTO BASE:</strong> Comece enviando um documento que servirá como a base para a análise. Este documento pode ser um guia, manual ou uma referência central para o domínio específico. <br />
          <strong>BUSCA DE SEMELHANÇAS:</strong> Nosso sistema compara o documento base com uma base de dados de outros documentos, identificando similaridades e padrões relevantes. <br />
          <strong>VALIDAÇÃO POR ESPECIALISTAS:</strong> As descobertas são submetidas a especialistas que validam e incorporam informações importantes ao documento base, enriquecendo-o com conhecimento especializado. <br />
          <strong>ATUALIZAÇÃO DINÂMICA:</strong> O documento base é continuamente atualizado à medida que novos documentos são adicionados, garantindo que o conhecimento evolua com as últimas informações.
        </Text>
        <Heading as="h2" size="lg" mb="4">
          BENEFÍCIOS:
        </Heading>
        <Text mb="8">
          <strong>APRENDIZADO CONTÍNUO:</strong> Nosso sistema permite a criação de uma base de conhecimento dinâmica, impulsionada pela colaboração de especialistas e pela análise constante de novos documentos. <br />
          <strong>EFICIÊNCIA NA TOMADA DE DECISÕES:</strong> Facilita a identificação rápida de informações relevantes, agilizando processos de tomada de decisões e pesquisa. <br />
          <strong>COLABORAÇÃO ESPECIALIZADA:</strong> Promove a colaboração entre especialistas, criando um ambiente onde o conhecimento é compartilhado e refinado.
        </Text>
        <Button colorScheme="blue" size="lg" mb="8">
          EXPERIMENTE AGORA
        </Button>
        <Heading as="h2" size="lg" mb="4">
          SOBRE NÓS:
        </Heading>
        <Text mb="8">
          Somos apaixonados por impulsionar a inovação por meio da análise avançada de texto. Saiba mais sobre nossa equipe e a tecnologia que impulsiona nosso sistema.
        </Text>
        <Heading as="h2" size="lg" mb="4">
          CONTATE-NOS:
        </Heading>
        <Text>
          Dúvidas ou sugestões? Entre em contato conosco para obter suporte personalizado. <br />
          <Link color="blue.500" href="#">
            contato@seusistema.com
          </Link>
        </Text>
      </Container>
    </Box>
  );
};

export default Home;
