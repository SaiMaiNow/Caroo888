import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';

import Barcarat from "./component/games/Barcarat"
import Home from "./component/Home"
import Ballgame from './component/games/Ballgame';  

import Admin from "./component/Admin"
import UserDetailPage from './component/UserDetailPage';
import Auth from "./component/Auth"
import NotFound from "./component/NotFound"
import UserInfo from './component/UserInfo';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserInfo />} />
        <Route path="/games/ballgame" element={<Ballgame />} />
        <Route path="/games/baccarat" element={<Barcarat />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/user/:id" element={<UserDetailPage />} />
        <Route path="/auth/:type" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;