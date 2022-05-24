import React from 'react';
import {Game} from './components/common';
import {PlayerProvider} from './context/Player';

function App() {
  return (
    <div className="App">
      <PlayerProvider>
        <Game />
      </PlayerProvider>
    </div>
  );
}

export default App;
