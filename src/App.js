import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';

import Home from "./component/Home"
import Navbar from './component/Navbar';
import Test from "./component/Test"
import Admin from "./component/Admin"
import UserDetailPage from './component/UserDetailPage';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/admin/user/:id" element={<UserDetailPage />} />
      </Routes>
    </>
  );
}

export default App;
