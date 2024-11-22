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

const columnsAfiliacao = [
  { key: 'id_filiacao', label: 'ID', editable: false, isKey: true },
  { key: 'nome', label: 'Instituição', editable: true, isKey: false },
  { key: 'cidade', label: 'Cidade', editable: true, isKey: false },
  { key: 'bairro', label: 'Bairro', editable: true, isKey: false },
  { key: 'uf', label: 'UF', editable: true, isKey: false },
];

// // Endpoints da API para o DataTable
// const endpointsAfiliacao = {
//   fetch: 'http://185.137.92.41:3001/afiliacao/userAllAfiliacoes',  // Endpoint para buscar os dados
//   create: 'http://185.137.92.41:3001/afiliacao', // Endpoint para criar um novo registro
//   update: 'http://185.137.92.41:3001/afiliacao', // Endpoint para atualizar um registro existente
//   delete: 'http://185.137.92.41:3001/afiliacao'  // Endpoint para excluir um registro
// };

// const RedirectToExternal = () => {
//   useEffect(() => {
//     window.location.href = "http://text-corpus.com/compara/20";
//   }, []);

//   return null; // Retorna null porque não há nada para renderizar
// };

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
                <Projetos descritor={1}/>
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
              <PrivateRoute>
                <Grafico />
              </PrivateRoute>
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
