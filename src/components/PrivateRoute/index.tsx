import { Navigate } from "react-router-dom";
import { ReactNode } from 'react';
import {useUserStore}  from "../../stores/UserStore";

export default function Private({ children }: { children: ReactNode }){
    
    const isAuthenticated = useUserStore(state => state.isAuthenticated);

    if(!isAuthenticated){
        return <Navigate to="/"/>
    }

    
    return children
}