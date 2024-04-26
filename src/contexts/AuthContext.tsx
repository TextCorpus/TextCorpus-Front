import { createContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from 'jwt-decode';

import { authApi } from "../services/authApi";

type ChildrenProps = {
    children: ReactNode;
};

type AuthData = {
    user: any;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
    isPasswordError: boolean;
};

export const AuthContext = createContext<AuthData>({
    user: null,
    login: async () => { },
    logout: () => { },
    isLoading: false,
    isAuthenticated: false,
    isPasswordError: false
});

export const AuthProvider = ({ children }: ChildrenProps) => {
    const [user, setUser] = useState<{} | null>(getUser);
    const [token, setToken] = useState<string | null>(getToken);
    const [isPasswordError, setIsPasswordError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        authApi.defaults.headers.Authorization = null;

        const user: any = getUser();
        const currentTime = Date.now() / 1000;

        if (user?.expiresIn < currentTime)
            return logout();

        setTokenAxiosDefault();
        setToken(getToken());
        setUser(user);

    }, [token]);

    function getToken() {
        return localStorage.getItem("token");
    }

    function getUser() {
        const storedToken = getToken();
        if (!storedToken) return null;

        const { user }: any = jwtDecode(storedToken);
        delete user.password;
        return user;
    }

    function setTokenAxiosDefault() {
        const storedToken = getToken();
        if (!storedToken) return null;

        authApi.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }

    const login = async (username: string, password: string) => {
        setIsLoading(true)
        try {
            const { data } = await authApi.post('/login', { username, password });
            localStorage.setItem('token', data.token);
            setToken(data.token);
            authApi.defaults.headers.Authorization = `Bearer ${data.token}`;
            window.location.href = '/';
        } catch (error) {
            setIsPasswordError(true);
            setTimeout(() => setIsPasswordError(false), 10000)
        } finally {
            setIsLoading(false)
        }
    };

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token');
        authApi.defaults.headers.Authorization = null;
    }

    return (
        <AuthContext.Provider value={{ login, logout, user, isAuthenticated: !!token, isLoading, isPasswordError }}>
            {children}
        </AuthContext.Provider>
    );
}