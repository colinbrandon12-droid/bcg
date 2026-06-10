import { useState, useEffect } from 'react';
import Lobby from './components/Lobby';
import Game from './components/Game';

export default function App() {
  const [gameId, setGameId] = useState(null);

  // Check URL for ?game=xxx on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('game');
    if (id) setGameId(id);
  }, []);

  function joinGame(id) {
    setGameId(id);
    window.history.pushState({}, '', '/?game=' + id);
  }

  function goBack() {
    setGameId(null);
    window.history.pushState({}, '', '/');
  }

  if (gameId) {
    return <Game gameId={gameId} onBack={goBack} />;
  }
  return <Lobby onJoinGame={joinGame} />;
}
