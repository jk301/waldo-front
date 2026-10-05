// import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/nav";
import Home from "./pages/home";
import View from "./pages/view";
import Leaderboard from "./pages/leaderboard";
import SceneLb from "./pages/sceneLb";
import About from "./pages/about";

function App() {

  return (
    <BrowserRouter>
    <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/view/:slug' element={<View />} />
        <Route path='/leaderboards' element={<Leaderboard />} />
        <Route path='/leaderboard/:slug' element={<SceneLb />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App