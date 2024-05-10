import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react";

import './styles/global.scss';

import AppRoutes from './routes';
import Navbar from './components/Side/side';

ReactDOM.createRoot(document.getElementById('root')!).render(

  <BrowserRouter>
    <Navbar />

    <div>
      <ChakraProvider>

      <AppRoutes />

      </ChakraProvider>
    </div>

  </BrowserRouter>
)