import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';

import Barcarat from "./component/games/Barcarat"

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/games/Barcarat" element={<Barcarat />} />
      </Routes>
    </>
  );
}

export default App;