import ApiClient from "../../client/ApiClient";

const apiClient = new ApiClient()

export class AuthRepository {
  public static async login(email: string, senha: string): Promise<{ access_token: string;}> {
    try {
      const data = { email, senha };
      const res = await apiClient.DoRequest('POST', '/auth/login', data);
      
      return { access_token: res.access_token }; // Retorne também o userId
      
    } catch (error: any) {
      console.error('error', error);
      console.error('status', error?.response?.status);
      
      if (error?.response?.status === 401) {
        throw new Error('Usuário e senha não conferem.');
      }
      
      if (error?.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      throw new Error('Erro inesperado.');
    }
  }
}