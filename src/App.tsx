import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./pages/router";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}

export default App;
