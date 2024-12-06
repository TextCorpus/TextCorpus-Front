// src/utils/axios.ts
import axios from 'axios';
import config from '../config';

// Criar uma instância do axios
const api = axios.create({
  baseURL: `${config.apiUrl}/`, // Base URL da sua API
  headers: { 'Content-Type': 'application/json' },
});

// Adicionar um interceptor para anexar o token a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Pegar o token do localStorage
    // console.log('Interceptor de requisição acionado. URL:', config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adicionar o Bearer token
    }
    return config;
  },
  (error) => {
    console.error('Erro ao configurar requisição:', error);
    // Garante que a rejeição seja sempre uma instância de Error
    return Promise.reject(
      error instanceof Error ? error : new Error('Erro desconhecido no interceptor de requisição')
    );
  }
);

export default api;
