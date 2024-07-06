import { Filiacao } from "../../entity/Filiacao/Filiacao";
import ApiClient from "../../client/ApiClient";

const client = new ApiClient();


export class FiliacaoRepository {


    public static async getFiliacao( token: string): Promise<Filiacao> {
        
        const headers = { Authorization: `Bearer ${token}` }
        try {
            const filiacao = await client.DoRequest("GET", `/filiacao/`, {}, headers);
            return new Filiacao(filiacao);
        } catch (error) {
            throw new Error("Erro ao buscar filiaçao na API");
        }
    }

    
    public static async getFiliacaoById(id: number, token: string): Promise<Filiacao> {
        const headers = { Authorization: `Bearer ${token}` }
        try {
            const filiacao = await client.DoRequest("GET", `/filiacao/${id}`, {}, headers);
            return new Filiacao(filiacao);
        } catch (error) {
            throw new Error("Nenhuma filiação vinculada ao seu usuario");
        }
    }


    public static async deleteFiliacao(id: number, token: string): Promise<void> {
        const headers = { Authorization: `Bearer ${token}` }
        try {
            await client.DoRequest("DELETE", `/filiacao/${id}`, {}, headers);
        } catch (error) {
            throw new Error("Erro ao deletar filiaçao na API");
        }
    }


    public static async updateFiliacao(filiacao: Filiacao, token: string): Promise<Filiacao> {
        const headers = { Authorization: `Bearer ${token}` }
        try {
            const { id_perfil, ...dataWithoutIdPerfil } = filiacao;

            const newFiliacao = await client.DoRequest("PUT", `/filiacao/${filiacao.id_perfil}`, dataWithoutIdPerfil, headers);
            return new Filiacao(newFiliacao);
        } catch (error) {
            throw new Error("Erro ao atualizar filiaçao na API");
        }
    }

 


    public static async createFiliacao(filiacao: Filiacao, token: string): Promise<Filiacao> {
        const headers = { Authorization: `Bearer ${token}` }
        const { id_perfil, ...dataWithoutIdPerfil } = filiacao;


        try {
            const newFiliacao = await client.DoRequest("POST", "/filiacao",  dataWithoutIdPerfil, headers);
            return new Filiacao(newFiliacao);
        } catch (error) {
            throw new Error("Erro ao criar filiaçao na API");
        }
    }


}
