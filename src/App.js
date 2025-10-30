import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';

import Barcarat from "./component/games/Barcarat"
import Home from "./component/Home"
import Navbar from './component/Navbar';
import Test from "./component/Test"

function App() {
  return (
    <>
      <GlobalStyle />
      <Navbar />
      <Routes>
        <Route path="/games/Barcarat" element={<Barcarat />} />
        <Route path="/" element={<Home />} />
        <Route path="/Test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;