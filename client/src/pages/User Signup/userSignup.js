import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AltNavigation } from '../../components/Navigation/navigation';
import Footer from '../../components/Footer/footer';
import './userSignup.scss';
import { Power2 } from 'gsap';
import { gsap } from 'gsap';
import { jumga } from "../../axios";
import { notification } from "../../store/store";

const UserSignup = () => {
    
    const [ country, setCountry ] = useState("");
    const [ form, updateForm ] = useState({
        "email": "",
        "name": "",
        "address": "",
        "mobile": "",
        "password": "",
        "confirm_password": "",
    });
    const history = useHistory();
    let SignupPage = useRef(null);

    const handleCountrySelection = (e) => {
        setCountry(e.target.value);
    };

    const handleFormChange = (e) => {
        updateForm((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            }
        });
    }

    const submitSignUpForm = async (e) => {
        e.preventDefault();
        const payload = {...form, country};
        console.log(payload);
        try {
            const response = await jumga.post("/v1/user", payload);
            if (response.status === 201) {
                notification.setValues({ status: "success", message: "Sign up successful! Login to your account.", location: "login" });
                history.push("/login")
            }
            console.log(response)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        gsap.fromTo(SignupPage, {y:-50}, {opacity: 1, duration: 0.4, y:0, ease: Power2.easeOut,delay:0.1})
    },[])

    return(
        <div className="user-signup-page" ref={ el=>SignupPage=el }>
            <nav>
                <AltNavigation/>
            </nav>
            <main>
                <div className="user-sign-up-header">
                    <h3 className="user-sign-up-title">Sign up</h3>
                    <p className="user-sign-up-subtitle">Create an account and start shopping</p>
                </div>

                <section className="main-sign-up">
                    <div className="form-details">
                        <form className="user-sign-up-form">
                            <input type="text" name="name" className="form-input" placeholder="Full Name" onChange={handleFormChange} required/>                            <input type="text" name="mobile" className="form-input" placeholder="Mobile Number" onChange={handleFormChange} required/>
                            <input type="email" name="email" className="form-input" placeholder="Email" onChange={handleFormChange} required/>
                            <input type="text" name="address" className="form-input" placeholder="Address" onChange={handleFormChange} required/>
                            <select name="Country" className="form-input-select" value={country} onChange={handleCountrySelection}>
                                <option value="" disabled>Select Country</option>
                                <option value="NG">Nigeria</option>
                                <option value="GH">Ghana</option>
                                <option value="KE">Kenya</option>
                                <option value="UK">United Kingdom</option>
                            </select>
                            <input type="password" name="password" className="form-input" placeholder="Password" onChange={handleFormChange} required/>
                            <input type="password" name="confirm_password" className="form-input" placeholder="Confirm Password" onChange={handleFormChange} required/>
                            <input type="submit" value="Register" className="submit-btn user-register" onClick={submitSignUpForm} />
                        </form>
                        <p className="user-login-link">
                            Already have an account? 
                            <span>
                                <Link to="/login">Click here</Link>
                            </span>
                        </p>
                    </div>  
                    <div className="user-signup-img">
                        <img alt="user signup" src={"https://res.cloudinary.com/dkow6vfth/image/upload/v1610856975/jumga-images/mock%20images/compressed/429_2_mwxiuu.png"} />
                    </div>
                </section>
                
            </main>
            <Footer/>
        </div>
    )
}

export default UserSignup;