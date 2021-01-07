import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LandingPage from './pages/Landing Page/landingPage';
import MerchantSignup from './pages/Merchant Signup/merchantSignup';
import MerchantLogin from './pages/Merchant Login/merchantLogin';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ LandingPage }/>
        <Route path="/admin-signup" exact component={ MerchantSignup }/>
        <Route path="/admin-login" exact component={ MerchantLogin }/>
      </Switch>
    </Router>
  );
}

export default App;
