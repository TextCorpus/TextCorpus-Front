import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { VStack, HStack, Icon, Text, Image } from '@chakra-ui/react';
import {
  AtSignIcon,
  InfoOutlineIcon,
  CalendarIcon,
  SettingsIcon,
  QuestionIcon,
  StarIcon,
  EditIcon,
  AttachmentIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
} from '@chakra-ui/icons';
import { FiBook } from 'react-icons/fi';

const MainMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <VStack spacing={4} align="start" mt="64px" w="100%" pl={4}>
      {!isLoggedIn && (
        <RouterLink to="/login">
          <HStack
            spacing={2}
            color={isActive('/login') ? 'black' : 'white'}
            _hover={{ color: 'black' }}
          >
            <Icon as={ArrowForwardIcon} />
            <Text fontWeight={isActive('/login') ? 'bold' : 'normal'}>Login</Text>
          </HStack>
        </RouterLink>
      )}

      {isLoggedIn && (
        <HStack
          spacing={2}
          color="white"
          _hover={{ color: 'black' }}
          onClick={handleLogout}
          cursor="pointer"
        >
          <Icon as={ArrowBackIcon} />
          <Text fontWeight="normal">Logout</Text>
        </HStack>
      )}

      <RouterLink to="/">
        <HStack
          spacing={2}
          color={isActive('/') ? 'black' : 'white'}
          _hover={{ color: 'black' }}
        >
          <Icon as={AtSignIcon} />
          <Text fontWeight={isActive('/') ? 'bold' : 'normal'}>Home</Text>
        </HStack>
      </RouterLink>
      <RouterLink to="/dados-pessoais">
        <HStack
          spacing={2}
          color={isActive('/dados-pessoais') ? 'black' : 'white'}
          _hover={{ color: 'black' }}
        >
          <Icon as={InfoOutlineIcon} />
          <Text fontWeight={isActive('/dados-pessoais') ? 'bold' : 'normal'}>
            Dados Pessoais
          </Text>
        </HStack>
      </RouterLink>
      
      <RouterLink to="/descritores">
        <HStack
          spacing={2}
          color={isActive('/descritores') ? 'black' : 'white'}
          _hover={{ color: 'black' }}
        >
          <Icon as={FiBook} />
          <Text fontWeight={isActive('/descritores') ? 'bold' : 'normal'}>Descritores</Text>
        </HStack>
      </RouterLink>

      <RouterLink to="/projetos">
        <HStack
          spacing={2}
          color={isActive('/projetos') ? 'black' : 'white'}
          _hover={{ color: 'black' }}
        >
          <Icon as={CalendarIcon} />
          <Text fontWeight={isActive('/projetos') ? 'bold' : 'normal'}>Projetos</Text>
        </HStack>
      </RouterLink>

      <RouterLink to="/treinamento">
        <HStack
          spacing={2}
          color={isActive('/treinamento') ? 'black' : 'white'}
          _hover={{ color: 'black' }}
        >
          <Icon as={EditIcon} />
          <Text fontWeight={isActive('/treinamento') ? 'bold' : 'normal'}>
            Configurações
          </Text>
        </HStack>
      </RouterLink>

      <RouterLink to="/relatorios">
        <HStack
          spacing={2}
          color={isActive('/relatorios') ? 'black' : 'white'}
          _hover={{ color: 'black' }}
        >
          <Icon as={StarIcon} />
          <Text fontWeight={isActive('/relatorios') ? 'bold' : 'normal'}>Monitor</Text>
        </HStack>
      </RouterLink>

      {/* Imagem adicionada após a opção "Gráfico" */}
      <Image
        src="/images/nupis_transparent.png"
        alt="Descrição da imagem"
        boxSize="200px" 
        objectFit="contain"
        mt={2} 
      />

    </VStack>
  );
};

export default MainMenu;
