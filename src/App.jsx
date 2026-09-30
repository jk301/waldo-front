// import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import View from "./pages/view";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/view' element={<View />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App