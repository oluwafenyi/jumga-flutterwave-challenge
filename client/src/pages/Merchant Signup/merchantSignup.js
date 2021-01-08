import React from 'react';
import { AltNavigation } from '../../components/Navigation/navigation';
import PlusSign from '../../assets/plus.svg';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/footer';
import './merchantSignup.css';

function MerchantSignup() {
    return (
        <div className="merchant-sign-up">
            <nav>
                <AltNavigation/>
            </nav>
            <main>
                <div className="merchant-sign-up-header">
                    <h3 className="merchant-sign-up-title">Become a merchant</h3>
                    <p className="merchant-sign-up-subtitle">Register your store and showcase your products</p>
                </div>
                <form className="merchant-sign-up-form">
                    <div className="form-details">
                        <div className="business-details">
                            <input type="text" name="first_name" className="form-input" placeholder="First Name" required/>
                            <input type="text" name="last_name" className="form-input" placeholder="Last Name" required/>
                            <input type="text" name="business_name" className="form-input" placeholder="Business Name" required/>
                            <input type="text" name="business_contact_number" className="form-input" placeholder="Business Mobile Number" required/>
                            <input type="email" name="business_email" className="form-input" placeholder="Business Email" required/>
                            <input type="text" name="business_address" className="form-input" placeholder="Address" required/>
                            <select name="Country" className="form-input-select">
                                <option selected>Select Country</option>
                                <option>Nigeria</option>
                                <option>Ghana</option>
                                <option>Kenya</option>
                                <option>United Kingdom</option>
                            </select>
                            <input type="password" name="password" className="form-input" placeholder="Password" required/>
                            <input type="password" name="confirm_password" className="form-input" placeholder="Confirm Password" required/>
                            <div className="account">
                                <h3 className="account-title">Account Details </h3>
                                <div className="account-details">
                                    <input type="text" name="bank" className="form-input" placeholder="Bank"/>
                                    <input type="text" name="bank" className="form-input" placeholder="Account Number"/>
                                </div>
                                <p className="account-info">
                                    <span>*</span> Jumga requires a service charge of $20 to register a shop.
                                </p>
                            </div>
                        </div>
                        <input type="submit" value="Register" className="register-btn"/>

                        <p className="merchant-login-link">
                            Already have an account? 
                            <span>
                                <Link to="/admin-login">Click here</Link>
                            </span>
                        </p>
                    </div>
                    <div className="business-logo">
                        <label htmlFor="business-logo">
                            <img src={PlusSign} className="business-logo-img" alt="Business Logo"/>
                            <p>Add Business Logo</p>
                        </label>   
                        <input type="file" id="business-logo" accept="image/png,image/jpeg" multiple={false}/>
                    </div>
                </form>
            </main>
            <Footer/>
        </div>
    )
}

export default MerchantSignup
