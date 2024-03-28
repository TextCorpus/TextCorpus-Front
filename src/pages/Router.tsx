import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi'; // Importe o ícone desejado aqui


import Login from './../pages/Login/Login';
import PasswordRecovery from './PasswordRecovery/PasswordRecovery';
import Home from './Home/Home';
import Profile from './Profile/Profile';

import Sidebar from '../components/sidebar';

const Router = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Funções para abrir e fechar o Sidebar
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Verifica se o Sidebar deve ser renderizado com base na localização atual
  const shouldRenderSidebar = !['/login', '/esqueci-minha-senha', '/'].includes(location.pathname);

  return (
    <>
      {/* Renderiza o Sidebar se necessário */}
      {shouldRenderSidebar && (
        <Sidebar isOpen={isSidebarOpen} toggleMenu={isSidebarOpen ? closeSidebar : openSidebar} openMenu={openSidebar} closeMenu={closeSidebar} />
      )}

      {/* Botão para abrir o Sidebar */}
      {!isSidebarOpen && shouldRenderSidebar && (
        <button
          onClick={openSidebar}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 999,
          }}
        >
          <FiMenu size={24} color="#333333" /> {/* Ícone do botão */}
        </button>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-minha-senha" element={<PasswordRecovery />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Profile />} />
      </Routes>
    </>
  );
};

export default Router;
