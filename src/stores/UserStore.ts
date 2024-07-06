import create from 'zustand';
import { UserService } from '../services/User/UserService';
import { User } from '../entity/user/User'; 
import { AuthRepository } from '../repository/auth/AuthRepossitory'; // Corrigi o nome do arquivo importado
import UserStorage from '../util/UserStorage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface UserState {
    user: User | null; // Alterado para um único usuário ou null
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null, // Inicialmente nenhum usuário
    isAuthenticated: false,
    login: async (email: string, password: string) => {
        try {
            const kcData = await AuthRepository.login(email, password); 
            
            set({ isAuthenticated: true });
            UserStorage.setToken(kcData.access_token); 
            // Atualizar o estado com o novo token KC
            toast.success('Login realizado com sucesso!', {
                autoClose: 3000, // Fechará automaticamente após 3 segundos
            });


            const userData = await UserService.getByID(); // Obtém os dados do usuário

                set({ user: new User(userData) }); // Define o único usuário no estado
                console.log ('Dados do usuário:', { user: userData });
          
            console.log('Dados do usuário:', { user: userData });
    
        } catch (error: any) {
            toast.error('Erro ao fazer login: ' + error.message, {
                autoClose: 3000,
            });
            console.error('Erro ao fazer login:', error.message);
        }
    },
    logout: () => {
        UserStorage.logout();
        toast.info('Logout realizado com sucesso!', {
            autoClose: 3000,
        });
        set({ user: null, isAuthenticated: false });
    },
}));