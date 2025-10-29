import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';

import Home from "./component/Home"
import Navbar from './component/Navbar';
import Test from "./component/Test"
import Ballgame from './component/games/Ballgame';  


function App() {
  return (
    <>
      <GlobalStyle />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/Ballgame" element={<Ballgame />} />
      </Routes>
    </>
  );
}

export default App;