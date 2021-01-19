import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {AltNavigation} from '../../components/Navigation/navigation';
import Footer from '../../components/Footer/footer';
import { jumga } from "../../axios";
import { jumgaState, notification } from "../../store/store";
import LoginSVG from '../../assets/online_shopping.svg';
import './userLogin.scss';


const UserLogin = () => {
    const [ form, updateForm ] = useState({ "email": "", "password": "" });
    const history = useHistory();

    useEffect(() => {
        if (!notification.displayed() && notification.location === "login") {
            notification.display();
        }
    }, [])

    const handleFormChange = (e) => {
        updateForm(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            }
        });
    }

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await jumga.post("/auth/token", form);
            console.log(response.data);
            jumgaState.setAccessToken(response.data.access_token);
            const profileResponse = await jumga.get("/auth/user");
            const { name, email, country, address, mobile } = profileResponse.data.data;
            jumgaState.setUserData({ name, email, country, address, mobile })
            history.push("/");
        } catch (err) {
            notification.setValues({ status: "failed", message: "Invalid login credentials", location: "login" })
            console.log(err);
            notification.display();
        }
    }

    return(
        <div className="user-login-page">
          <nav>
                <AltNavigation/>
            </nav>
            <main>
                <ToastContainer/>
                <div className="user-login-img">
                    <img src={ LoginSVG } alt="Login"/>
                </div>
                <div className="user-login">
                    <div className="user-login-header">
                        <h3 className="user-login-title">Welcome back</h3>
                        <p className="user-login-subtitle">Let's spend those bags</p>
                    </div>
                    <form className="user-login-form">
                        <input type='email' name="email" placeholder="Email" onChange={handleFormChange} className="form-input" required/>
                        <input type='password' name="password" placeholder="Password" onChange={handleFormChange} className="form-input" required/>
                        <input type='submit' value="Login" onClick={submitForm} className="submit-btn login-btn"/>
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