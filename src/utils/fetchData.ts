import api from "./axios";

const fetchData = async (
  url: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  toast: any,
  data?: any
) => {
  try {
    // Fazer a requisição usando a instância `api`
    const response = await api({
      url,
      method,
      ...(data ? { data } : {}), // Inclui os dados no corpo da requisição, se houver
    });

    if (response.status >= 200 && response.status < 300) {
      // Mensagens de sucesso para POST, PUT, PATCH e DELETE
      if (method === 'post') {
        toast({
          title: 'Criado com sucesso',
          description: 'Os dados foram criados corretamente.',
          status: 'success',
        });
      } else if (method === 'put') {
        toast({
          title: 'Substituído com sucesso',
          description: 'Os dados foram substituídos corretamente.',
          status: 'success',
        });
      } else if (method === 'patch') {
        toast({
          title: 'Atualizado com sucesso',
          description: 'Os dados foram atualizados corretamente.',
          status: 'success',
        });
      } else if (method === 'delete') {
        toast({
          title: 'Excluído com sucesso',
          description: 'Os dados foram excluídos corretamente.',
          status: 'success',
        });
      }
      return response.data;
    } else {
      window.location.href = '/login';
      return null;
    }
  } catch (err: any) {
    // Tratamento de erros
    if (err.response && err.response.status === 401) {
      toast({
        title: 'Sessão expirada',
        description: 'Por favor, faça login novamente.',
        status: 'error',
      });
      window.location.href = '/login';
    } else {
      console.error(`Erro ao fazer requisição para: ${url}`, err);
      toast({
        title: 'Erro na operação',
        description: 'Ocorreu um erro durante a operação. Tente novamente.',
        status: 'error',
      });
    }
    return null;
  }
};

export default fetchData;
