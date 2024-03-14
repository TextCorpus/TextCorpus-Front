import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Login from './Login/Login';
import PasswordRecovery from './PasswordRecovery/PasswordRecovery';

const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/esqueci-minha-senha" element={<PasswordRecovery />} />
      </Routes>
  );
}

export default AppRouter;
