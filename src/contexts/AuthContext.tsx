import { createContext, useEffect, useState, ReactNode } from "react";
import UserStorage from "../util/UserStorage";

type AuthData = {
    isAuthenticated: boolean;
    authenticate: () => void;
    logout: () => void;
};

type ChildrenProps = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthData>({
    isAuthenticated: false,
    authenticate: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }: ChildrenProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const tokenExists = UserStorage.hasToken();
        setIsAuthenticated(tokenExists);
    }, []);

    const authenticate = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, authenticate, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
