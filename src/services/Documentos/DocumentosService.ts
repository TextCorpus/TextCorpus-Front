import { DocumentosRepository } from './../../repository/Documentos/DocumentosRepository';
import { Documentos } from "../../entity/Documentos/Documentos";
import UserStorage from "../../util/UserStorage";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class DocumentosService {
    public static async get(): Promise<Documentos[]> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            const documentosData = await DocumentosRepository.getDocumentos(token);
            return documentosData.map(data => new Documentos(data));
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async getByID(id: number): Promise<Documentos> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }
    
        try {
            const documentosData = await DocumentosRepository.getDocumentosById(id, token);
            return new Documentos(documentosData);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async create(documento: Documentos): Promise<Documentos> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            const newDocumentosData = await DocumentosRepository.createDocumentos(documento, token);
            toast.success('Documento criado com sucesso!');
            return new Documentos(newDocumentosData);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async update(id: number, updatedData: Partial<Documentos>): Promise<Documentos> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            const updatedDocumentosData = await DocumentosRepository.updateDocumentos(id, updatedData, token);
            toast.success('Documento atualizado com sucesso!');
            return new Documentos(updatedDocumentosData);
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
            await DocumentosRepository.deleteDocumentos(id, token);
            toast.success('Documento deletado com sucesso!');
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
