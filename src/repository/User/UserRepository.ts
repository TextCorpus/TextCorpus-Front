import { User } from "../../entity/user/User";
import ApiClient from "../../client/ApiClient";

const client = new ApiClient();


export class UserRepository {



    public static async getUser(): Promise<User> {
        try {
            const user = await client.DoRequest("GET", "/user");
            return new User(user);
        } catch (error) {
            throw new Error("Erro ao buscar usuário na API");
        }
    }

    
    public static async getUserById(id: number, token: string): Promise<User> {
        const headers = { Authorization: `Bearer ${token}` }
        try {
            const user = await client.DoRequest("GET", `/user/${id}`, {}, headers);
            return new User(user);
        } catch (error) {
            throw new Error("Erro ao buscar usuário na API");
        }
    }


    public static async deleteUser(id: number, token: string): Promise<void> {
        const headers = { Authorization: `Bearer ${token}` }
        try {
            await client.DoRequest("DELETE", `/user/${id}`, {}, headers);
        } catch (error) {
            throw new Error("Erro ao deletar usuário na API");
        }
    }


    public static async updateUser(user: User, token: string): Promise<User> {
        const headers = { Authorization: `Bearer ${token}` }
        try {
            const newUser = await client.DoRequest("PUT", `/user/${user.id_user}`, user, headers);
            return new User(newUser);
        } catch (error) {
            throw new Error("Erro ao atualizar usuário na API");
        }
    }


    public static async createUser(user: User): Promise<User> {

        try {
            const newUser = await client.DoRequest("POST", "/user", user);
            return new User(newUser);
        } catch (error) {
            throw new Error("Erro ao criar usuário na API");
        }
    }


}
