import { Navigate } from "react-router-dom";
import { ReactNode } from 'react';
import UserStorage from "../../util/UserStorage";

export default function Private({ children }: { children: ReactNode }){
    
    const isAuthenticated = UserStorage.getToken();

    if(!isAuthenticated){
        return <Navigate to="/"/>
    }

    
    return children
}