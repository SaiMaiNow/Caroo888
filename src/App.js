import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';

import Barcarat from "./component/games/Barcarat"
import Home from "./component/Home"
import Navbar from './component/Navbar';
import Test from "./component/Test"
import Auth from "./component/Auth"
import NotFound from "./component/NotFound"

function App() {
  return (
    <>
      <GlobalStyle />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/games/Barcarat" element={<Barcarat />} />
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/auth/:type" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;