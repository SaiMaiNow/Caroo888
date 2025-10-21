import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';


import Home from "./component/Home"
import SlotGame from "./component/games/slot/App";

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/slot" element={<SlotGame />} />
      </Routes>
    </>
  );
}

export default App;