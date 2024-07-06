import { FiliacaoRepository } from './../../repository/Filiacao/FiliacaoRepository';
import { Filiacao } from "../../entity/Filiacao/Filiacao";
import UserStorage from "../../util/UserStorage";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class FiliacaoService {
    public static async get(): Promise<Filiacao | null> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            const filiacaoData = await FiliacaoRepository.getFiliacao(token);
            if (!filiacaoData) {
                return null; // Retorna null se não houver filiação encontrada
            }
            return new Filiacao(filiacaoData);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async getByID(): Promise<Filiacao | null> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        const filiacaoId = UserStorage.getUserId();
        if (!filiacaoId) {
            const message = 'ID do usuário não encontrado no token.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            const filiacaoData = await FiliacaoRepository.getFiliacaoById(filiacaoId, token);
            if (!filiacaoData) {
                return null; // Retorna null se não houver filiação encontrada
            }
            return new Filiacao(filiacaoData);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async create(filiacao: Filiacao): Promise<void> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        const userId = UserStorage.getUserId();
        if (!userId) {
            const message = 'ID do usuário não encontrado no token.';
            toast.error(message);
            throw new Error(message);
        }

        filiacao.id_user = userId;

        try {
            await FiliacaoRepository.createFiliacao(filiacao, token);
            toast.success('Filiacao criada com sucesso!');
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async update(filiacao: Filiacao): Promise<Filiacao> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        console.log(filiacao);
        try {
            const updatedFiliacaoData = await FiliacaoRepository.updateFiliacao(filiacao, token);
            toast.success('Filiação atualizada com sucesso!');
            return new Filiacao(updatedFiliacaoData);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async delete(): Promise<void> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        const userId = UserStorage.getUserId();
        if (!userId) {
            const message = 'ID do usuário não encontrado no token.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            await FiliacaoRepository.deleteFiliacao(userId, token);
            toast.success('Usuário deletado com sucesso!');
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private static handleError(error: any): never {
        if (error.response) {
            let message = 'Ocorreu um erro desconhecido.';
            switch (error.response.status) {
                case 400:
                    message = error.response.data.message || 'Erro de validação.';
                    break;
                case 401:
                    message = error.response.data.message || 'Não autorizado.';
                    break;
                case 404:
                    message = error.response.data.message || 'Recurso não encontrado.';
                    break;
                case 500:
                    message = error.response.data.message || 'Erro no servidor.';
                    break;
                default:
                    message = error.response.data.message || 'Ocorreu um erro desconhecido.';
                    break;
            }
            toast.error(message);
            throw new Error(message);
        } else {
            const message = error.message || 'Ocorreu um erro desconhecido.';
            toast.error(message);
            throw new Error(message);
        }
    }
}
