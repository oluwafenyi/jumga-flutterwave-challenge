import React, { useState, useEffect } from 'react';
import { AltNavigation } from '../../components/Navigation/navigation';
import PlusSign from '../../assets/plus.svg';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/footer';
import './merchantSignup.css';

import { jumga } from "../../axios";
import utils from "../../utils/utils";

function MerchantSignup() {
    const [ country, setCountry ] = useState("");
    const [ banks, setBanks ] = useState([]);
    const [ bank, setBank ] = useState("");
    const [ form, updateForm ] = useState({
        "account_number": "",
        "business_name": "",
        "address": "",
        "business_mobile": "",
        "business_email": "",
        "business_contact": "",
        "password": "",
        "confirm_password": "",
    });

    const handleCountrySelection = (e) => {
        setCountry(e.target.value);
    };

    const handleBankSelection = (e) => {
        setBank(e.target.value);
    }

    const handleFormChange = (e) => {
        updateForm((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            }
        });
    }

    useEffect(() => {
        const getBankData = async () => {
            if (country === "") {
                return;
            }
            const response = await jumga.get("/banks/" + country);
            if (response.status !== 200) {
                return;
            }
            const data = response.data;
            console.log(data);
            const banks = utils.getSortedBankList(data);
            setBanks(banks);
        };

        (async function () {
            await getBankData(country);
        })();
    }, [country]);


    const bankOptions = () => {
        return banks.map(bank => (
            <option value={bank.code} key={bank.code}>{ bank.name }</option>
        ))
    }

    const submitSignUpForm = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            country,
            "account_bank": bank,
            "business_contact_mobile": form.business_mobile,
        }
        console.log(payload)
        // try {
        //     const response = await jumga.post("/v1/merchant", payload);
        //     console.log(response.data);
        //
        // } catch (err) {
        //     console.log(err)
        // }
    }


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
                            <input type="text" name="business_contact" className="form-input" placeholder="Name" onChange={handleFormChange} required/>
                            <input type="text" name="business_name" className="form-input" placeholder="Business Name" onChange={handleFormChange} required/>
                            <input type="text" name="business_mobile" className="form-input" placeholder="Business Mobile Number" onChange={handleFormChange} required/>
                            <input type="email" name="business_email" className="form-input" placeholder="Business Email" onChange={handleFormChange} required/>
                            <input type="text" name="address" className="form-input" placeholder="Address" onChange={handleFormChange} required/>
                            <select name="country" className="form-input-select" value={country} onChange={handleCountrySelection}>
                                <option value="" disabled>Select Country</option>
                                <option value="NG">Nigeria</option>
                                <option value="GH">Ghana</option>
                                <option value="KE">Kenya</option>
                            </select>
                            <input type="password" name="password" className="form-input" placeholder="Password" onChange={handleFormChange} required/>
                            <input type="password" name="confirm_password" className="form-input" placeholder="Confirm Password" onChange={handleFormChange} required/>
                            <div className="account">
                                <h3 className="account-title">Account Details </h3>
                                <div className="account-details">
                                    <select name="bank" className="form-input" value={bank} onChange={handleBankSelection}>
                                        <option value="" disabled>Bank</option>
                                        {bankOptions()}
                                    </select>
                                    <input type="text" name="account_number" className="form-input" placeholder="Account Number" onChange={handleFormChange} required />
                                </div>
                                <p className="account-info">
                                    <span>*</span> Jumga requires a service charge of $20 to register a shop.
                                </p>
                            </div>
                        </div>
                        <input type="submit" value="Register" className="register-btn" onClick={submitSignUpForm}/>

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
