import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';

import Home from "./component/Home"
import Barcarat from "./component/games/Barcarat"

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/barcarat" element={<Barcarat />} />
      </Routes>
    </>
  );
}

export default App;
