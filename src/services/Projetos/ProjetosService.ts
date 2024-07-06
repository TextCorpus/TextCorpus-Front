import { ProjetosRepository } from './../../repository/Projetos/ProjetosRepository';
import { Projetos } from "../../entity/Projetos/Projetos";
import UserStorage from "../../util/UserStorage";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class ProjetosService {
    public static async get(): Promise<Projetos[]> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            const projetosData = await ProjetosRepository.getProjetos(token);
            return projetosData.map((item: any) => new Projetos(item));
        } catch (error: any) {
            this.handleError(error);
        }
    }
    public static async getById(id: number): Promise<Projetos> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            const projetosData = await ProjetosRepository.getProjetosById(id, token);
            return new Projetos(projetosData);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async update(projetos: Projetos): Promise<Projetos> {
        console.log(projetos)
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            const updatedProjetosData = await ProjetosRepository.updateProjetos(projetos, token);
            toast.success('Projeto atualizado com sucesso!');
            return new Projetos(updatedProjetosData);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async delete(id: number): Promise<void> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            await ProjetosRepository.deleteProjetos(id, token);
            toast.success('Projeto deletado com sucesso!');
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async create(projetos: Projetos): Promise<Projetos> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            console.log(projetos)
            const createdProjetosData = await ProjetosRepository.createProjetos(projetos, token);
            toast.success('Projeto criado com sucesso!');
            return new Projetos(createdProjetosData);
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