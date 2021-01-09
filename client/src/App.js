import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LandingPage from './pages/Landing Page/landingPage';
import UserLogin from './pages/User Login/userLogin';
import UserSignup from './pages/User Signup/userSignup';
import ViewProducts from './pages/View Products/viewProducts';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ LandingPage }/>
        <Route path="/login" exact component={ UserLogin }/>
        <Route path="/signup" exact component={ UserSignup }/>
        <Route path="/products" exact component={ ViewProducts }/>
      </Switch>
    </Router>
  );
}

export default App;
