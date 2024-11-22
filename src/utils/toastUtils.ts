// src/utils/toastUtils.ts
import { useToast } from '@chakra-ui/react';

// Função de utilidade para aplicar configurações globais aos toasts
export const useCustomToast = () => {
  const toast = useToast();

  // Retorna uma função que aplica as configurações padrão do toast
  return (options: any) => {
    toast({
      position: 'top',  // Configuração global para a posição
      duration: 2000,   // Configuração global para a duração
      isClosable: true, // Configuração global para ser fechável
      ...options,       // Permite passar opções adicionais que sobrescrevem as globais
    });
  };
};
