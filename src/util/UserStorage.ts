import { User } from '.././entity/user/User';

const storageKey = "@user";
const userIdKey = "@user_id"; // Chave para armazenar o ID do usuário

class UserStorage { 
    static hasToken = (): boolean => { 
        const token = localStorage.getItem(storageKey);
        return !!token;
    };

    static getToken = (): string => {
        const token = localStorage.getItem(storageKey);
        return token || "";
    };

    static getUserId = (): string => {
        const userId = localStorage.getItem(userIdKey);
        return userId || "";
    };

    static setToken = (userToken: string) => {
        localStorage.setItem(storageKey, userToken);
    };

    static setUserId = (userId: string) => {
        localStorage.setItem(userIdKey, userId);
    };

    static logout = () => {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(userIdKey); // Remover também o ID do usuário ao fazer logout
    };    
}

export default UserStorage;
