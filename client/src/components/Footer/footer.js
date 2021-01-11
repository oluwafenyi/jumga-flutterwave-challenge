import React from 'react'
import { Link } from 'react-router-dom';
import FooterLogo from '../../assets/logos/Footer Logo.svg'
import Facebook from '../../assets/socials/facebook.svg';
import Instagram from '../../assets/socials/instagram.svg';
import Twitter from '../../assets/socials/twitter.svg';
import './footer.css';

import { merchantLink } from "../../constants";

function Footer() {
    return (
        <footer>
            <div className="desktop-footer">
                <Link to="/" className="footer-logo">
                    <img src={FooterLogo} alt="footer logo"/>
                </Link>
                <div className="footer-menu">
                    <h4 className="footer-menu-title">Contact Us</h4>
                    <ul className="footer-list">
                        <li className="footer-menu-item"><a href={'google.com'}>+123-234566</a></li>
                        <li className="footer-menu-item"><a href={'google.com'}>+123-234566</a></li>
                        <li className="footer-menu-item"><a href={'google.com'}>+123-234566</a></li>
                        <li className="footer-menu-item socials">
                            <a href={'google.com'} className="social"><img src={Facebook} alt="socials"/></a>
                            <a href={'google.com'} className="social"><img src={Twitter} alt="socials"/></a>
                            <a href={'google.com'} className="social"><img src={Instagram} alt="socials"/></a>
                        </li>
                    </ul>
                </div>
                <div className="footer-menu">
                    <h4 className="footer-menu-title">Categories</h4>
                    <ul className="footer-list">
                        <li className="footer-menu-item"><Link>Electronics</Link></li>
                        <li className="footer-menu-item"><Link>Fashion</Link></li>
                        <li className="footer-menu-item"><Link>Cosmetics</Link></li>
                        <li className="footer-menu-item"><Link>Food Stuff</Link></li>
                        <li className="footer-menu-item"><Link>Sports and Fitness</Link></li>
                    </ul>
                </div>
                <div className="footer-menu">
                    <h4 className="footer-menu-title">Menu</h4>
                    <ul className="footer-list">
                        <li className="footer-menu-item"><Link>All Products</Link></li>
                        <li className="footer-menu-item"><Link>Stores</Link></li>
                        <li className="footer-menu-item"><a href={ merchantLink + "/signup" }>Become a Merchant</a></li>
                    </ul>
                </div>
            </div>
            <div className="mobile-footer">
                <Link to="/" className="footer-logo">
                    <img src={FooterLogo} alt="footer logo"/>
                </Link>
                <div className="socials">
                    <a href={'google.com'} className="social"><img src={Facebook} alt="socials"/></a>
                    <a href={'google.com'} className="social"><img src={Twitter} alt="socials"/></a>
                    <a href={'google.com'} className="social"><img src={Instagram} alt="socials"/></a>
                </div>
            </div>
            
        </footer>
    )
}

export default Footer
