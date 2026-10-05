// import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/nav";
import Home from "./pages/home";
import View from "./pages/view";
import Leaderboard from "./pages/leaderboard";
import SceneLb from "./pages/sceneLb";

function App() {

  return (
    <BrowserRouter>
    <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/view/:slug' element={<View />} />
        <Route path='/leaderboards' element={<Leaderboard />} />
        <Route path='/leaderboard/:slug' element={<SceneLb />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App