// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import Home from './pages/Home';
import DadosPessoais from './pages/DadosPessoais';
import Layout from './components/layoutPage/Layout';
import Projetos from './pages/Projetos';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Login';
//import CadastroModelo from './pages/CadastroModelo';
import CadastroModelos from './pages/CadastroModelos';
import Dashboard from './pages/processos';
import GraphComponent from './components/GraphV2/GraphComponent';

const columnsAfiliacao = [
  { key: 'id_filiacao', label: 'ID', editable: false, isKey: true },
  { key: 'nome', label: 'Instituição', editable: true, isKey: false },
  { key: 'cidade', label: 'Cidade', editable: true, isKey: false },
  { key: 'bairro', label: 'Bairro', editable: true, isKey: false },
  { key: 'uf', label: 'UF', editable: true, isKey: false },
];

const apiUrl = "http://185.137.92.41:3001/documento/graph/2";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByb2Yuam9zZWNhcm1pbm9AdWxpZmUuY29tLmJyIiwic3ViIjoxLCJpYXQiOjE3MzI0MzMxMDksImV4cCI6MTczMjQzNjcwOX0.vAQxja5bHcGMKKBAJJhB2yYMb7qtdlinulBUwV0Of9c";

const Grafico = () => {
  useEffect(() => {
    window.location.href = "C:/Projetos_ODS/javascript/grafo/grafoTexto/testegrafico1.html";
  }, []);

  return null; // Retorna null porque não há nada para renderizar
};

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dados-pessoais" element={
              <PrivateRoute>
                <DadosPessoais />
              </PrivateRoute>
            } />
            { }
            <Route path="/descritores" element={
              <PrivateRoute>
                <Projetos descritor={1} />
              </PrivateRoute>
            }
            />
            <Route path="/projetos" element={
              <PrivateRoute>
                <Projetos descritor={0} />
              </PrivateRoute>
            }
            />
            <Route path="/treinamento" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
            />
            <Route path="/relatorios" element={
              // <PrivateRoute>
              //   <Grafico />
              // </PrivateRoute>
              <ChakraProvider>
                <GraphComponent apiUrl={apiUrl} token={token} />
              </ChakraProvider>
            }
            />
            {/* Adicione outras rotas conforme necessário */}
          </Routes>

        </Layout>
      </Router>
    </ChakraProvider>
  );
};

export default App;
