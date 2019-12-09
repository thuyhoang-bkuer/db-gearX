import React from 'react';

import './App.css';
import Paperbase from './components/Paperbase';
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Paperbase />
    </Router>
  );
}

export default App;
