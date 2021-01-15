import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MerchantSignup from './pages/Merchant Signup/merchantSignup';
import MerchantLogin from './pages/Merchant Login/merchantLogin';
import MerchantDashboard from "./pages/Merchant Dashboard/merchantDashboard";
import ScrollToTop from './components/ScrollToTop/scrollToTop';
import { jumgaState } from "./store/store";
import './App.css';

function App() {
  return (
      <Router>
        <ScrollToTop/>
        <Switch>
            <Route path="/" exact component={ MerchantDashboard }/>
            <Route path="/signup" exact component={ MerchantSignup }/>
            <Route path="/login" exact component={ MerchantLogin }/>
        </Switch>
      </Router>
  );
}

export default App;
