import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LandingPage from './pages/Landing Page/landingPage';
import UserLogin from './pages/User Login/userLogin';
import UserSignup from './pages/User Signup/userSignup';
import ViewProducts from './pages/View Products/viewProducts';
import ProductPreview from './pages/Product Preview/productPreview';
import Stores from './pages/Stores/stores';
import Store from './pages/Store/store';
import ScrollToTop from './components/ScrollToTop/scrollToTop';
import NotFound from './components/404 Page/notFound';
// import {createBrowserHistory} from "history";
import './App.css';

function App() {


  
  return (
    <Router>
      <ScrollToTop/>
      <Switch>
        <Route path="/" exact component={ LandingPage }/>
        <Route path="/login" exact component={ UserLogin }/>
        <Route path="/signup" exact component={ UserSignup }/>
        <Route path="/products" exact component={ ViewProducts }/>
        <Route path="/products/:productId" exact component={ ProductPreview }/>
        <Route path="/stores" exact component={ Stores }/>
        <Route path="/stores/:storeId" exact component={ Store }/>
        <Route path="/error" exact component={ NotFound }/>
      </Switch>
    </Router>
  );
}

export default App;
