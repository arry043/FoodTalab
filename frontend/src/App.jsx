import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ReactRouterProvidor } from 'react-router'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

function App() {

  return (
    <ReactRouterProvidor>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </ReactRouterProvidor>
  )
}

export default App
