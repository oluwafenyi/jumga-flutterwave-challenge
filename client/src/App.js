import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LandingPage from './pages/Landing Page/landingPage';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={ LandingPage }/>
      </Switch>
    </Router>
  );
}

export default App;
