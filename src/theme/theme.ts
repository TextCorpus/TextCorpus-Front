// src/theme/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: '#2B6CB0',   // Cor principal
    secondary: '#EDF2F7', // Cor de fundo
    accent: '#68D391',    // Cor de destaque
    text: '#2D3748',      // Cor do texto
  },
  components: {
    Input: {
      baseStyle: {
        field: {
          border: '2px solid black', // Borda preta para o estado inativo
          _focus: {
            borderColor: 'black',    // Borda preta para o estado ativo (focus)
            boxShadow: 'none',       // Remove o brilho no foco
          },
        },
      },
    },
    Button: {
      baseStyle: {
        bg: 'primary',              // Cor de fundo do botão
        color: 'white',             // Cor do texto do botão
        _hover: {
          bg: 'accent',             // Cor ao passar o mouse (hover)
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'secondary',
        color: 'text',
      },
    },
  },
});

export default theme;
