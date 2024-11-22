import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Heading,
  Image,
  Link,
  VStack,
  Divider,
  Container,
  ListIcon,
  ListItem,
  List,
  IconButton,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { CheckCircleIcon, ExternalLinkIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const InstituicoesParticipantes: React.FC = () => {
  // Array de URLs das imagens
  const images = [
    '/images/unifesp.png',
    '/images/usp.png',
    '/images/iel.png',
    '/images/ufpe.png',
    '/images/ufmg.png',
    '/images/furb.png',
    '/images/ifpb.png',
    '/images/ifsc.png',
    '/images/ufmt.png',
    '/images/ufam.png',
    '/images/uni_santa_ursula.png',
    '/images/univassouras.png',
    '/images/unesp.png',
    '/images/saojudas.png',
    '/images/unisul.png',
    '/images/isae.png',
    '/images/uefs.png',
    '/images/unisuam.png',
    '/images/unemat.png',
    '/images/unievangelica.png',
  ];

  // Estado para controlar o índice da imagem atual
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Número de imagens a serem exibidas de cada vez
  const imagesPerPage = 5;

  // Função para avançar para a próxima imagem
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex + 1 >= images.length ? 0 : prevIndex + 1
    );
  };

  // Função para retroceder para a imagem anterior
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Roda automaticamente para a próxima imagem a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);
  }, []);

  // Determina as imagens a serem exibidas no conjunto atual
  const currentImages = images.slice(
    currentImageIndex,
    currentImageIndex + imagesPerPage
  );

  // Se o conjunto de imagens não preencher completamente, completa com as primeiras imagens
  if (currentImages.length < imagesPerPage) {
    currentImages.push(...images.slice(0, imagesPerPage - currentImages.length));
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="start">
        <Heading as="h1" size="xl" textAlign="center" w="100%">
          Sistema ImpactoSociedade
        </Heading>

        <Text fontSize="lg">
          O <strong>ImpactoSociedade</strong> é uma iniciativa do Núcleo de
          Pesquisa Impacto da Pós-Graduação na Sociedade (<strong>NuPIS</strong>) que tem como
          objetivo analisar o impacto ecossocioeconômico dos Programas de
          Pós-Graduação, mediado pelos Objetivos de Desenvolvimento Sustentável
          da Agenda 2030 da ONU (ODS), em nível nacional.
        </Text>

        <Divider />

        <Text fontSize="lg">
          O <strong>NuPIS</strong> é um núcleo de pesquisa interdisciplinar e
          interinstitucional com representatividade de Instituições de Ensino
          Superior das cinco regiões geográficas nacionais. Teve início em 2020
          como um Spin-off acadêmico que surgiu a partir do Instituto de Estudos
          Avançados da Universidade de São Paulo (IEA/USP) e tem como
          coordenação a Universidade Federal de São Paulo (UNIFESP). Mais
          informações em{' '}
          <Link href="#" color="blue.500" isExternal>
            página do NuPIS <ExternalLinkIcon mx="2px" />
          </Link>
          .
        </Text>

        <Text fontSize="lg">
          Destaca-se como principal projeto do <strong>NuPIS</strong>, o projeto
          de pesquisa <em>“Impacto e Relevância dos Programas de Pós-Graduação
            da Área de Ciências Ambientais para Alcance dos Objetivos de
            Desenvolvimento Sustentável da Organização das Nações Unidas (ONU)”</em>{' '}
          que tem como objetivo analisar e discutir sobre a contribuição da
          Pós-graduação (PPG) brasileira na área de avaliação CiAmb da CAPES à
          sociedade no processo de incorporação dos Objetivos de Desenvolvimento
          Sustentável (ODS).
        </Text>

        <Text fontSize="lg">
          Este projeto tem o apoio de fomento da Fundação de Amparo à Pesquisa
          do Estado de São Paulo - FAPESP, por meio do programa Auxílio Regular.
          O ImpactoSociedade é uma das contribuições deste projeto.
        </Text>

        <Heading as="h2" size="lg">
          Funcionalidades do ImpactoSociedade
        </Heading>

        <Box>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Análise automática da aderência dos produtos dos Programas de
              Pós-Graduação aos ODS em termos de incidência e intensidade.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Capacidade de analisar um grande volume de dados.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Geração de relatórios na forma de tabela, gráficos e grafos.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Visualização interativa: apresenta os resultados de forma clara e
              intuitiva.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Possibilidade de integração com outras plataformas.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Possibilidade de importação de dados de planilhas pré-existentes.
            </ListItem>
          </List>
        </Box>

        <SimpleGrid columns={[1, 1, 2]} spacing={6} w="100%" border="15px solid" borderColor="white" bg="white">
          {/* Coluna do Texto */}
          <VStack align="start">
            <Heading as="h2" size="lg">
              Coordenção
            </Heading>
            <HStack spacing={4}>
              <Image
                src="/images/nupis.png"
                alt="Descrição da primeira imagem"
                borderRadius="md"
                maxWidth="60%"
                height="auto"
                mr={6} // Margem à direita para afastar das imagens ao lado
              />
            </HStack>
          </VStack>

          {/* Coluna das Imagens */}
          <Box display="flex" alignItems="center">
            <VStack align="start">
              <Heading as="h2" size="lg">
                Apoio
              </Heading>
              <HStack spacing={4}>
                <Image
                  src="/images/fapesp.png"
                  alt="Descrição da segunda imagem"
                  borderRadius="md"
                  width="70%" // Define a largura para 10% do tamanho original
                  height="auto" // Mantém a proporção original da imagem
                />
                <Image
                  src="/images/capes.png"
                  alt="Descrição da terceira imagem"
                  borderRadius="md"
                  maxWidth="30%" // Ajuste o tamanho conforme necessário
                  height="auto"
                />
              </HStack>
            </VStack>
          </Box>
        </SimpleGrid>

        <Divider />

        <Heading as="h2" size="lg">
          Contato para Informações Adicionais
        </Heading>

        <Text fontSize="lg">
          Para saber mais sobre o ImpactoSociedade e o NuPIS, entre em
          contato com a equipe por meio do email: <Link href="mailto:contatonupis@gmail.com" color="blue.500">contatonupis@gmail.com</Link>
        </Text>

        <Heading as="h2" size="lg">
          Instituições Participantes
        </Heading>

        <SimpleGrid columns={[2, 3, 4]} spacing={6} w="100%" border="15px solid" borderColor="white"  bg="white">
          {images.map((src, index) => (
            <Box key={index} borderRadius="md" overflow="hidden" bg="transparent">
              <Image src={src} alt={`Instituição ${index + 1}`}
                maxWidth="80%" // Ajuste o tamanho conforme necessário
                height="auto" />
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default InstituicoesParticipantes;
