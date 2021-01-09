import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import MerchantSignup from './pages/Merchant Signup/merchantSignup';
import MerchantLogin from './pages/Merchant Login/merchantLogin';
import './App.css';

function App() {
  return (
      <Router>
        <Switch>
          <Route path="/signup" exact component={ MerchantSignup }/>
          <Route path="/" exact component={ MerchantLogin }/>
        </Switch>
      </Router>
  );
}

export default App;
