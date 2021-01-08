import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import Search from '../Search/search';
import './navigation.css';

function Navigation() {
    const location = useLocation();
    console.log(location);
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
                <li><Link className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`}>Stores</Link></li>
                <li><Link to="/login" className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`}>Login</Link></li>
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
                    <li><Link className="menu-item">Stores</Link></li>
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
                    <li><Link className="menu-item">Stores</Link></li>
                    <li><Link to="/merchant/signup" className="menu-item">Become a merchant</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Navigation
