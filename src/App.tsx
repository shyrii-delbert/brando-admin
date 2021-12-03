import React from 'react';
import './App.css';
import { useDarkMode } from './hooks/use-dark-mode';

const App = () => {
  useDarkMode();

  return (
    <div className="App">
    </div>
  );
}

export default App;
