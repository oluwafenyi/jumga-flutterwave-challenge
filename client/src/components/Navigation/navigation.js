import React from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom';
import Search from '../Search/search';
import './navigation.css';

import { merchantLink } from "../../constants";
import { jumgaState} from "../../store/store";

function Navigation() {
    const location = useLocation();
    const history = useHistory();

    const logoutUser = () => {
        jumgaState.clearAccessToken();
        history.push("/");
    }

    const getAuthStatusButton = () => {
        if (!jumgaState.isAuthenticated()) {
            return (
                <li><Link to="/login" className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`}>Login</Link></li>
            )
        }
        return (
            <li><button className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`} onClick={logoutUser} >Logout</button></li>
        )
    }

    return (
        <div className="navigation">
            <div className="mobile-menu-btn">
                <div className="bar bar-1"></div>
                <div className="bar bar-2"></div>
                <div className="bar bar-3"></div>
            </div>
            <ul className="desktop-menu">
                <li><Link to="/" className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`} >Home</Link></li>
                <li><Link to="/products" className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`}>All Products</Link></li>
                <li><Link to="/stores" className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`}>Stores</Link></li>
                { getAuthStatusButton() }
            </ul>
            <Link to="/" className="logo">
                <h1 className={`${location.pathname !== '/' ? 'dark' : '' }`}>jumga.</h1>
            </Link>
            <Search/>
            <div className="mobile-menu-container">
                <div className="close-menu-btn">
                    <div className="bar bar-1"></div>
                    <div className="bar bar-2"></div>
                </div>
                <div className="logo">
                    <h1>jumga.</h1>
                </div>

                <ul className="mobile-menu">
                    <li><Link to="/" className="menu-item" >Home</Link></li>
                    <li><Link to="/products" className="menu-item">All Products</Link></li>
                    <li><Link to="/stores" className="menu-item">Stores</Link></li>
                    <li><Link to="/login" className="menu-item">Login</Link></li>
                </ul>
            </div>
        </div>
    )
}

export function AltNavigation() {

    return(
        <div className="alt-navigation">
            <div className="desktop-menu-container">
                <div className="mobile-menu-btn">
                    <div className="bar bar-1"></div>
                    <div className="bar bar-2"></div>
                    <div className="bar bar-3"></div>
                </div>
                <ul className="desktop-menu">
                    <li><Link to="/" className="menu-item">Home</Link></li>
                    <li><Link to="/products" className="menu-item">All Products</Link> </li>
                </ul>
                <Link to="/" className="logo">
                    <h1>jumga.</h1>
                </Link>
                <ul className="desktop-menu">
                    <li><Link to="/stores" className="menu-item">Stores</Link></li>
                    <li><Link to="/login" className="menu-item">Login</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Navigation
