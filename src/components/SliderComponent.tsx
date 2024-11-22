import React from 'react';
import { Box, Text, VStack, Grid, GridItem, Heading, useMediaQuery } from '@chakra-ui/react';

const topics = [
  {
    title: "Analisador de ODS em Resumos Acadêmicos",
    content: "Descubra o alinhamento de suas pesquisas com os ODS da ONU.",
  },
  {
    title: "Sobre o Núcleo de Pesquisa Impacto na Sociedade/ODS",
    content: `Missão: Promover a pesquisa e a aplicação dos ODS, buscando soluções para os desafios da sociedade.\n
              Equipe: Composto por 18 membros, o núcleo reúne especialistas de diferentes áreas do conhecimento.\n
              Projetos: Desenvolve projetos inovadores, utilizando a IA para analisar o impacto de pesquisas nos ODS.\n
              Resultados: Compartilha seus resultados com a comunidade acadêmica e com a sociedade em geral.`,
  },
  {
    title: "Funcionalidades do Aplicativo",
    content: `Análise Automática: Identifica os ODS relacionados aos resumos acadêmicos com precisão e rapidez.\n
              1. Upload de arquivos\n
              2. Análise de texto\n
              3. Geração de relatórios\n
              Visualização Interativa: Apresenta os resultados de forma clara e intuitiva, com gráficos e tabelas.\n
              Integração com Plataformas: Facilita a pesquisa e o acesso aos dados sobre os ODS, conectando-se com plataformas relevantes.`,
  },
  {
    title: "Análise de Resumos Acadêmicos e Identificação de ODS",
    content: `Upload do Resumo: O usuário insere o resumo acadêmico no sistema.\n
              Processamento de Linguagem Natural: O sistema utiliza técnicas de PLN para analisar o texto.\n
              Comparação com a Base de Dados dos ODS: O sistema compara as informações extraídas com uma base de dados dos ODS.\n
              Geração do Relatório: O sistema gera um relatório completo, identificando os ODS relacionados ao resumo.`,
  },
  {
    title: "Contato e Informações Adicionais",
    content: `Para saber mais sobre o aplicativo, o núcleo de pesquisa ou as oportunidades de colaboração, entre em contato com a equipe através do email: impacto.ods@contato.com ou acesse o website: www.impacto.ods.com.br.`,
  },
];

const SliderComponent = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <VStack w="full" h="100vh" p={4} justify="center" align="center" spacing={4}>
      <Heading color="gray.700" mb={8} size="2xl" textAlign="center" fontWeight="medium">
        Bem-vindo ao Sistema de Análise de ODS
      </Heading>
      <Grid
        templateColumns={isMobile ? "repeat(1, 1fr)" : "repeat(3, 1fr)"}
        gap={4}
        w="full"
        px={4}
      >
        {topics.map((topic, index) => (
          <GridItem key={index}>
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="lg"
              h="100%"
              transition="all 0.3s"
              _hover={{ transform: "scale(1.03)" }}
            >
              <Heading as="h3" size="md" color="gray.800" mb={4}>
                {topic.title}
              </Heading>
              <Text color="gray.600" whiteSpace="pre-wrap">
                {topic.content}
              </Text>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </VStack>
  );
};

export default SliderComponent;
