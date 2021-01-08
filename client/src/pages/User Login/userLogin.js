import React from 'react';
import { Link } from 'react-router-dom';
import {AltNavigation} from '../../components/Navigation/navigation';
import Footer from '../../components/Footer/footer';
import User from '../../assets/online_shopping.svg';
import './userLogin.css';


const UserLogin = () =>{
    return(
        <div className="user-login-page">
          <nav>
                <AltNavigation/>
            </nav>
            <main>
                <div className="user-login-img">
                    <img src={User} alt="user" />
                </div>
                <div className="user-login">
                    <div className="user-login-header">
                        <h3 className="user-login-title">Welcome back</h3>
                        <p className="user-login-subtitle">Let's spend those bags</p>
                    </div>
                    <form className="user-login-form">
                        <input type='email' placeholder="Email" className="form-input"/>
                        <input type='password' placeholder="Password" className="form-input"/>
                        <input type='submit' value="Login" className="submit-btn login-btn"/>
                    </form>
                    <p className="user-signup-link">
                        Don't have an account? 
                        <span>
                            <Link to="/signup">Click here</Link>
                        </span>
                    </p>
                </div>
            </main>
            <Footer/>  
        </div>
    )
}

export default UserLogin;