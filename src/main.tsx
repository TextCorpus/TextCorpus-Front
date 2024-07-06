import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.scss';

import AppRoutes from './routes';
import Navbar from './components/Side/side';

ReactDOM.createRoot(document.getElementById('root')!).render(

  <BrowserRouter>
    <Navbar />

    <div>
      <ChakraProvider>
      <AppRoutes />
      <ToastContainer />
      </ChakraProvider>
    </div>

  </BrowserRouter>
)