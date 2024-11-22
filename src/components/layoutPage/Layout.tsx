// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import MainMenu from '../MainMenu';
import { Box } from '@chakra-ui/react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      display="grid"
      gridTemplateRows="auto 1fr auto"
      gridTemplateColumns="200px 1fr"
      minHeight="100vh"
      gridTemplateAreas={`
        "header header"
        "menu content"
        "footer footer"
      `}
    >
      <Box gridArea="header">
        <Header />
      </Box>
      <Box
        gridArea="menu"
        bg="primary"
        color="white"
        p={4}
        height="100%"
        overflowY="auto"
      >
        <MainMenu />
      </Box>
      <Box
        gridArea="content"
        p={4}
        pl="30px" // Adiciona espaço para o menu lateral
        mt="72px" // Adiciona espaço para o header
        height="calc(100vh - 128px)"  // Descontando a altura do header e do footer
        overflowY="auto"  // Scroll apenas no conteúdo
        boxSizing="border-box"
      >
        {children}
      </Box>
      <Box gridArea="footer">
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;

