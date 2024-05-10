import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useUserStore } from './stores/UserStore';
import  PrivateRoute from './components/PrivateRoute/index';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import PasswordRecovery from './pages/PasswordRecovery/PasswordRecovery';
import Profile from './pages/Profile/Profile';
import Projects from './pages/Projects/Projects';
import ProjectList from './pages/ProjectsList/ProjectsList';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/Side/side';
import {NotFound} from './pages/NotFound'; // Importe NotFound corretamente

const Pages =() =><Routes></Routes>





const AppRoutes = () =>{

    return (
        <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/password-recovery" element={<PasswordRecovery/>}/>

        <Route path="/home" element={<PrivateRoute><Home/></PrivateRoute>}/>
        <Route path="/perfil" element={<PrivateRoute><Profile/></PrivateRoute>}/>
        <Route path="/projetos" element={<PrivateRoute><Projects/></PrivateRoute>}/>
        <Route path="/lista-projetos/:id" element={<PrivateRoute><ProjectList/></PrivateRoute>}/>
        <Route path="/dashboard/:id" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>

        <Route path="*" element={<NotFound/>}/>



        </Routes>
    )
}
export default AppRoutes;
