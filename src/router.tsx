import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import PasswordRecovery from './pages/PasswordRecovery/PasswordRecovery';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/esqueci-minha-senha" element={<PasswordRecovery />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
