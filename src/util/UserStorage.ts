const storageKey = "@user";
const userIdKey = "@user_id"; // Chave para armazenar o ID do usuário

interface DecodedToken {
    sub: number;
    username: string;
    iat: number;
    exp: number;
}

class UserStorage {
    static hasToken = (): boolean => {
        const token = localStorage.getItem(storageKey);
        return !!token;
    };

    static getToken = (): string => {
        const token = localStorage.getItem(storageKey);
        return token || "";
    };

    static getUserId = (): number | null => {
        const decodedToken = UserStorage.getDecodedToken();
        return decodedToken ? decodedToken.sub : null;
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

    static decodeToken = (token: string): DecodedToken | null => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    };

    static getDecodedToken = (): DecodedToken | null => {
        const token = UserStorage.getToken();
        if (!token) {
            return null;
        }
        return UserStorage.decodeToken(token);
    };
}

export default UserStorage;