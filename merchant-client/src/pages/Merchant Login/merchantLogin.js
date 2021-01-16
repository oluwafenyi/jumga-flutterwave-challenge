import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {AltNavigation} from '../../components/Navigation/navigation';
import Footer from '../../components/Footer/footer';
import Shopping from '../../assets/web_shopping.svg';
import './merchantLogin.css';
import { jumga } from "../../axios";

import { jumgaState, notification } from "../../store/store";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MerchantLogin() {
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
            if (response.data.account_type === "user") {
                throw new Error("invalid merchant credentials");
            }
            console.log(response.data);
            jumgaState.setAccessToken(response.data.access_token);
            jumgaState.setApprovalStatus(response.data.approved);
            jumgaState.setRiderRegistered(response.data.rider);
            jumgaState.setStoreID(response.data.store_id);
            history.push("/");

        } catch (err) {
            notification.setValues({ status: "failed", message: "Invalid login credentials", location: "login" })
            console.log(err);
            notification.display();
        }
    }

    return (
        <div className="merchant-login-page">
            <nav>
                <AltNavigation/>
            </nav>
            <main>
                <ToastContainer/>
                <div className="merchant-login-img">
                    <img src={Shopping} alt="merchant" />
                </div>
                <div className="merchant-login">
                    <div className="merchant-login-header">
                        <h3 className="merchant-login-title">Welcome back</h3>
                        <p className="merchant-login-subtitle">Let's see how your products are doing</p>
                    </div>
                    <form className="merchant-login-form">
                        <input type='email' name="email" placeholder="Business Email" className="form-input" onChange={handleFormChange} required/>
                        <input type='password' name="password" placeholder="Password" className="form-input" onChange={handleFormChange} required/>
                        <input type='submit' value="Login" className="login-btn" onClick={submitForm} />
                    </form>
                    <p className="merchant-signup-link">
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

export default MerchantLogin
