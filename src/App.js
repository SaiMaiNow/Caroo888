import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';

import Home from "./component/Home"
import Navbar from './component/Navbar';

function App() {
  return (
    <>
      <GlobalStyle />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
