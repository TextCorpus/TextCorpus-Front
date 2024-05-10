import create from 'zustand';
import { AuthRepository } from '../repository/auth/AuthRepossitory';
import UserStorage from '../util/UserStorage';


interface UserState {
    user: { token: string; userId: number } | null;
    isAuthenticated: boolean;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: async (email: string, senha: string) => {
        try {
            const { token, userId } = await AuthRepository.login(email, senha);
            set({ user: { token, userId }, isAuthenticated: true });
            UserStorage.setToken(token);
        } catch (error) {
            // Trate os erros aqui, por exemplo, mostrando uma mensagem de erro para o usuário
           // console.error('Erro ao fazer login:', error.message);
        }
    },
    logout: () => {
        set({ user: null, isAuthenticated: false });
    },
}));
