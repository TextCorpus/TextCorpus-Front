import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Login from './../pages/Login/Login'

import PasswordRecovery from './PasswordRecovery/PasswordRecovery'
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login/>} />
    
      <Route path="/esqueci-minha-senha" element={<PasswordRecovery/>} />

    </Routes>
  )
}

export default Router
