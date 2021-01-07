import React from 'react';
import { Link } from 'react-router-dom';
import {AltNavigation} from '../../components/Navigation/navigation';
import Footer from '../../components/Footer/footer';
import Shopping from '../../assets/web_shopping.svg';
import './merchantLogin.css';

function MerchantLogin() {
    return (
        <div className="merchant-login-page">
            <nav>
                <AltNavigation/>
            </nav>
            <main>
                <div className="merchant-login-img">
                    <img src={Shopping} alt="merchant" />
                </div>
                <div className="merchant-login">
                    <div className="merchant-login-header">
                        <h3 className="merchant-login-title">Welcome back</h3>
                        <p className="merchant-login-subtitle">Let's see how your products are doing</p>
                    </div>
                    <form className="merchant-login-form">
                        <input type='email' placeholder="Business Email" className="form-input"/>
                        <input type='password' placeholder="Password" className="form-input"/>
                        <input type='submit' value="Login" className="login-btn"/>
                    </form>
                    <p className="merchant-signup-link">
                        Don't have an account? 
                        <span>
                            <Link to="/admin-signup">Click here</Link>
                        </span>
                    </p>
                </div>
            </main>
            <Footer/>
        </div>
    )
}

export default MerchantLogin
