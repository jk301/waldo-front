// import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/nav";
import Home from "./pages/home";
import View from "./pages/view";

function App() {

  return (
    <BrowserRouter>
    <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/view/:slug' element={<View />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App