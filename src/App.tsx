import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {PlayerProvider} from './context/Player';
import Home from './pages/Home';
import Player from './pages/Player';

function App() {
  return (
    <div className="App">
      <PlayerProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='player' element={<Player />} />
        </Routes>
      </PlayerProvider>
    </div>
  );
}

export default App;
