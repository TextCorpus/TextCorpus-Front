import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./pages/Router";
import "./App.scss";
import { ChakraProvider } from "@chakra-ui/react";

// App principal

export default function App() {
  return (    
    <BrowserRouter>
      <div className="App">
        <ChakraProvider>
          <Router />
        </ChakraProvider>
      </div>
    </BrowserRouter>
  );
}
