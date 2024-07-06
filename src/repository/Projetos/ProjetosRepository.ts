import { Projetos } from "../../entity/Projetos/Projetos";
import ApiClient from "../../client/ApiClient";

const client = new ApiClient();

export class ProjetosRepository {
    public static async getProjetos(token: string): Promise<Projetos[]> {
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const projetosData = await client.DoRequest("GET", `/projetos/`, {}, headers);
            return projetosData.map((item: any) => new Projetos(item));
        } catch (error) {
            throw new Error("Erro ao buscar projetos na API");
        }
    }

    
    public static async getProjetosById(id: number, token: string): Promise<Projetos> {
        const headers = { Authorization: `Bearer ${token}` }
        try {
            const projetos = await client.DoRequest("GET", `/projetos/${id}`, {}, headers);
            return new Projetos(projetos);
        } catch (error) {
            throw new Error("Nenhuma filiação vinculada ao seu usuario");
        }
    }


    public static async deleteProjetos(id: number, token: string): Promise<void> {
        const headers = { Authorization: `Bearer ${token}` }
        try {
            
            await client.DoRequest("DELETE", `/projetos/${id}`, {}, headers);
        } catch (error) {
            throw new Error("Erro ao deletar filiaçao na API");
        }
    }


    public static async updateProjetos(projetos: Projetos, token: string): Promise<Projetos> {
        const headers = { Authorization: `Bearer ${token}` }
        try {
            const { userid,id_projeto, ...dataWithoutIdPerfil } = projetos;

            const newProjetos = await client.DoRequest("PATCH", `/projetos/${projetos.id_projeto}`, dataWithoutIdPerfil, headers);
            return new Projetos(newProjetos);
        } catch (error) {
            throw new Error("Erro ao atualizar filiaçao na API");
        }
    }

 


    public static async createProjetos(projetos: Projetos, token: string): Promise<Projetos> {
        const headers = { Authorization: `Bearer ${token}` }
        const { id_projeto, ...dataWithoutIdPerfil } = projetos;

        try {
            const newProjetos = await client.DoRequest("POST", "/projetos",  dataWithoutIdPerfil, headers);
            return new Projetos(newProjetos);
        } catch (error) {
            throw new Error("Erro ao criar filiaçao na API");
        }
    }


}
