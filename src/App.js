import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';

import Home from "./component/Home";
import Ballgame from './component/games/Ballgame';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Ballgame />} />
      </Routes>
    </>
  );
}

export default App;
