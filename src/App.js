import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';

import Home from "./component/Home"
import Test from "./component/Test"
import Ballgame from './component/games/Ballgame';  

import Admin from "./component/Admin"
import UserDetailPage from './component/UserDetailPage';
import Auth from "./component/Auth"
import NotFound from "./component/NotFound"

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Ballgame" element={<Ballgame />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/admin/user/:id" element={<UserDetailPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/auth/:type" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;