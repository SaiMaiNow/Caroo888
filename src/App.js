import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import GlobalStyle from './GlobalStyle';

import Barcarat from "./component/games/Barcarat"
import Home from "./component/Home"
import Ballgame from './component/games/Ballgame';  

import Auth from "./component/Auth"
import NotFound from "./component/NotFound"

const BANNERS = [
  "/images/1.png",
  "/images/2.png",
  "/images/3.png",
  "/images/4.png",
];

const GAMES = [
  {
    id: 'SLOT',
    title: "สล็อตออนไลน์",
    icon: "/images/slot.jpeg",
    path: "/games/slot",
    component: <NotFound />,
    images: [
      "/images/banner/1.png",
      "/images/banner/2.png",
      "/images/banner/9.png",
    ]
  },
  {
    id: 'BACCARAT',
    title: "บาคาร่าออนไลน์",
    icon: "/images/card.jpeg",
    path: "/games/baccarat",
    component: <Barcarat />,
    images: [
      "/images/banner/3.png",
      "/images/banner/4.png",
      "/images/banner/5.png",
    ]
  },
  {
    id: 'BALLGAME',
    title: "พนันฟุตบอล",
    icon: "/images/pngegg.png",
    path: "/games/ballgame",
    component: <Ballgame />,
    images: [
      "/images/banner/6.png",
      "/images/banner/7.png",
      "/images/banner/8.png",
    ]
  },
];

const SEC_GAMES = ['SLOT', 'BACCARAT', 'BALLGAME'];

function App() {
  const [banners,] = useState(BANNERS);
  const [games,] = useState(GAMES);
  const [secGames,] = useState(games.filter((game) => SEC_GAMES.includes(game.id)));
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home banners={banners} secGames={secGames} />} />
        <Route path="/auth/:type" element={<Auth />} />
        <Route path="*" element={<NotFound />} />

        {games.map((game) => (
          <Route key={game.path} path={game.path} element={game.component} />
        ))}
      </Routes>
    </>
  );
}

export default App;