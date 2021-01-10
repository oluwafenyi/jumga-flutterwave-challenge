import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LandingPage from './pages/Landing Page/landingPage';
import MerchantSignup from './pages/Merchant Signup/merchantSignup';
import MerchantLogin from './pages/Merchant Login/merchantLogin';
import UserLogin from './pages/User Login/userLogin';
import UserSignup from './pages/User Signup/userSignup';
import ViewProducts from './pages/View Products/viewProducts';
import ProductPreview from './pages/Product Preview/productPreview';
import Stores from './pages/Stores/stores';
import Store from './pages/Store/store';
import MerchantDashboard from './pages/Merchant Dashboard/merchantDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ LandingPage }/>
        <Route path="/admin-signup" exact component={ MerchantSignup }/>
        <Route path="/admin-login" exact component={ MerchantLogin }/>
        <Route path="/login" exact component={ UserLogin }/>
        <Route path="/signup" exact component={ UserSignup }/>
        <Route path="/products" exact component={ ViewProducts }/>
        <Route path="/preview" exact component={ ProductPreview }/>
        <Route path="/stores" exact component={ Stores }/>
        <Route path="/store" exact component={ Store }/>
        <Route path="/dashboard" exact component={ MerchantDashboard }/>
      </Switch>
    </Router>
  );
}

export default App;
