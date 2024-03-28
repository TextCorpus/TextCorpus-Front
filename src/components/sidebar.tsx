import React, { useState } from 'react';
import { Box, VStack, Text, Icon, IconButton, Avatar, Flex } from '@chakra-ui/react';
import { FiMenu, FiX, FiHome, FiUser, FiClipboard, FiFileText, FiTag, FiCalendar, FiUsers, FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleMenu, openMenu, closeMenu }) => {
  const [buttonHovered, setButtonHovered] = useState<string | null>(null);

  return (
    <Box
      pos="fixed"
      left={isOpen ? '0' : '-300px'}
      top="0"
      w="300px"
      h="100%"
      bg="gray.800"
      color="white"
      p="4"
      boxShadow="2xl"
      zIndex="1000"
      transition="left 0.3s ease"
      rounded="md"
    >
      <Flex justify="space-between" alignItems="center" mb="4">
        <Avatar size="md" name="User" src="caminho/para/foto" />
        <IconButton
          aria-label="Close Menu"
          onClick={toggleMenu}
          icon={<FiX />}
          variant="ghost"
          colorScheme="whiteAlpha"
          size="md"
        />
      </Flex>

      <VStack spacing="4" align="stretch">
        <Text fontSize="lg" fontWeight="bold">Menu</Text>
        <MenuItem
          icon={<FiHome />}
          text="Home"
          to="/home"
          id="home"
          buttonHovered={buttonHovered}
          setButtonHovered={setButtonHovered}
        />
        <MenuItem
          icon={<FiUser />}
          text="Perfil"
          to="/perfil"
          id="perfil"
          buttonHovered={buttonHovered}
          setButtonHovered={setButtonHovered}
        />
        <MenuItem
          icon={<FiClipboard />}
          text="Projetos"
          to="/projetos"
          id="projetos"
          buttonHovered={buttonHovered}
          setButtonHovered={setButtonHovered}
        />
        <MenuItem
          icon={<FiFileText />}
          text="Documentos do Projeto"
          to="/documentos"
          id="documentos"
          buttonHovered={buttonHovered}
          setButtonHovered={setButtonHovered}
        />
        <MenuItem
          icon={<FiTag />}
          text="Descritores"
          to="/descritores"
          id="descritores"
          buttonHovered={buttonHovered}
          setButtonHovered={setButtonHovered}
        />
        <MenuItem
          icon={<FiBookOpen />}
          text="ppgs-text-corpus"
          to="/ppgs"
          id="ppgs"
          buttonHovered={buttonHovered}
          setButtonHovered={setButtonHovered}
        />
        <MenuItem
          icon={<FiCalendar />}
          text="Calendário"
          to="/calendario"
          id="calendario"
          buttonHovered={buttonHovered}
          setButtonHovered={setButtonHovered}
        />
        <MenuItem
          icon={<FiUsers />}
          text="Grupo de Pesquisa"
          to="/grupoPesquisa"
          id="grupoPesquisa"
          buttonHovered={buttonHovered}
          setButtonHovered={setButtonHovered}
        />
        <MenuItem
          icon={<FiBookOpen />}
          text="Publicações"
          to="/publicacoes"
          id="publicacoes"
          buttonHovered={buttonHovered}
          setButtonHovered={setButtonHovered}
        />
      </VStack>
    </Box>
  );
};

interface MenuItemProps {
  icon: JSX.Element;
  text: string;
  to: string;
  id: string;
  buttonHovered: string | null;
  setButtonHovered: React.Dispatch<React.SetStateAction<string | null>>;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, to, id, buttonHovered, setButtonHovered }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <Box
      as="button"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      bg={buttonHovered === id ? 'blue.500' : 'transparent'}
      rounded="md"
      px="3"
      py="2"
      transition="background 0.3s ease"
      onMouseEnter={() => setButtonHovered(id)}
      onMouseLeave={() => setButtonHovered(null)}
    >
      {icon}
      <Text fontSize="md" marginLeft="2">{text}</Text>
    </Box>
  </Link>
);

export default Sidebar;
