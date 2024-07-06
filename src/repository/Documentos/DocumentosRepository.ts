import { Documentos } from "../../entity/Documentos/Documentos";
import ApiClient from "../../client/ApiClient";

const client = new ApiClient();

export class DocumentosRepository {
    public static async getDocumentos(token: string): Promise<Documentos[]> {
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const documentosData = await client.DoRequest("GET", `/documentos/`, {}, headers);
            return documentosData.map((item: any) => new Documentos(item));
        } catch (error) {
            throw new Error("Erro ao buscar documentos na API");
        }
    }

    
    public static async getDocumentosById(id: number, token: string): Promise<Documentos> {
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const documentosData = await client.DoRequest("GET", `/projetos/${id}`, {}, headers);
            console.log("passou aqui")
            console.log(documentosData)
            return documentosData;
        } catch (error) {
            console.log(error)
            throw new Error("Nenhuma documentos vinculada ao seu projeto");
        }
    }



    public static async deleteDocumentos(id: number, token: string): Promise<void> {
        const headers = { Authorization: `Bearer ${token}` }
        try {
            
            await client.DoRequest("DELETE", `/documentos/${id}`, {}, headers);
        } catch (error) {
            throw new Error("Erro ao deletar documentos na API");
        }
    }


    public static async updateDocumentos(id: number, updatedData: Partial<Documentos>, token: string): Promise<Documentos> {
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const updatedDocumentos = await client.DoRequest("PATCH", `/documentos/${id}`, updatedData, headers);
            return new Documentos(updatedDocumentos);
        } catch (error) {
            throw new Error("Erro ao atualizar documento na API");
        }
    }


    public static async createDocumentos(documentos: Documentos, token: string): Promise<Documentos> {
        const headers = { Authorization: `Bearer ${token}` }

        try {
            const newDocumentos = await client.DoRequest("POST", "/documentos",  documentos, headers);
            return new Documentos(newDocumentos);
        } catch (error) {
            throw new Error("Erro ao criar documentos na API");
        }
    }


}
