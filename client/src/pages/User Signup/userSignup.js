import React from 'react';
import { Link } from 'react-router-dom';
import {AltNavigation} from '../../components/Navigation/navigation';
import Footer from '../../components/Footer/footer';
import './userSignup.css';

const UserSignup = () =>{
    return(
        <div className="user-signup-page">
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
                            <input type="text" name="first_name" className="form-input" placeholder="First Name" required/>
                            <input type="text" name="last_name" className="form-input" placeholder="Last Name" required/>
                            <input type="text" name="mobile_numbebr" className="form-input" placeholder="Mobile Number" required/>
                            <input type="email" name="email" className="form-input" placeholder="Email" required/>
                            <input type="text" name="address" className="form-input" placeholder="Address" required/>
                            <select name="Country" className="form-input-select">
                                <option selected>Select Country</option>
                                <option>Nigeria</option>
                                <option>Ghana</option>
                                <option>Kenya</option>
                                <option>United Kingdom</option>
                            </select>
                            <input type="password" name="password" className="form-input" placeholder="Password" required/>
                            <input type="password" name="confirm_password" className="form-input" placeholder="Confirm Password" required/>  
                            <input type="submit" value="Register" className="submit-btn user-register"/>
                        </form>
                        <p className="user-login-link">
                            Already have an account? 
                            <span>
                                <Link to="/login">Click here</Link>
                            </span>
                        </p>
                    </div>  
                    <div className="user-signup-img">
                        <img alt="user signup" src={"https://res.cloudinary.com/dkow6vfth/image/upload/v1609805145/jumga-images/mock%20images/429_2_tjeqjc.png"} />
                    </div>
                </section>
                
            </main>
            <Footer/>
        </div>
    )
}

export default UserSignup;