import React, { useState, useEffect, useRef } from 'react';
import { AltNavigation } from '../../components/Navigation/navigation';
import PlusSign from '../../assets/plus.svg';
import { Link, useHistory } from 'react-router-dom';
import Footer from '../../components/Footer/footer';
import './merchantSignup.css';
import { ToastContainer } from 'react-toastify';

import { jumga } from "../../axios";
import utils from "../../utils/utils";
import {notification} from "../../store/store";

import LoadingScreen from '../../components/Loading Screen/loadingScreen';

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
    const [ merchantLogoLink, setMerchantLogoLink ] = useState("");
    const history = useHistory();
    let uploadWidget = null;
    const instance = useRef(null)
    const [ loader, setLoader ] = useState(false);


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

    const cloudinaryUpload = () => {
        uploadWidget = window.cloudinary.createUploadWidget({
            cloudName: 'dkow6vfth',
            upload_preset: 'jumgapreset',
            folder: 'jumga-images',
            cropping: true,
        }, (error, result) => { if (result.event === "success") {
            // console.log(result.info)
            setMerchantLogoLink(result.info.secure_url);
            notification.setValues({status: "success", message: "Image upload successful", location:"here"})
            notification.display()
        }
        })
      if (uploadWidget === null) {
          return
      }
      uploadWidget.open();
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
        script.type = "text/javascript";
        script.async = true;
        instance.current.appendChild(script);
        // eslint-disable-next-line
    }, [])

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
        setLoader(true);
        if (merchantLogoLink === "") {
            notification.setValues({ status: "failed", message: "Please upload your logo", location: "here" });
            notification.display()
            setLoader(false);
            return
        }
        const payload = {
            ...form,
            country,
            "account_bank": bank,
            "business_contact_mobile": form.business_mobile,
        }
        try {
            const response = await jumga.post("/v1/merchant", payload);
            console.log(response.data);
            if (response.status === 201) {
                const authResponse = await jumga.post("/auth/token", { email: form.business_email, password: form.password })
                const token = authResponse.data.access_token;
                await jumga.put("/v1/merchant/logo", {link: merchantLogoLink}, {headers: {Authorization: `Bearer ${token}`}});
                notification.setValues({ status: "success", message: "Sign up successful! Login to your account.", location: "login" });
                setLoader(false);
                history.push("/login")
            }
        } catch (err) {
            notification.setValues({ status: "failed", message: await err.response.data.message, location: "merchant-sign-up" })
            setLoader(false);
            notification.display()
        }
    }


    return (
        <div className="merchant-sign-up">
            <div ref={instance}>

            </div>
            <nav>
                <AltNavigation/>
            </nav>
            <main>
                <ToastContainer/>
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
                                    <select name="bank" className="form-input-select" value={bank} onChange={handleBankSelection}>
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
                                <Link to="/login">Click here</Link>
                            </span>
                        </p>
                    </div>
                    <div className="business-logo">
                        <label onClick={cloudinaryUpload}>
                            <img src={PlusSign} className="business-logo-img" alt="Business Logo"/>
                            <p>Add Business Logo</p>
                        </label>   
                        <input type="file" accept="image/png,image/jpeg" multiple={false}/>
                    </div>
                </form>
            </main>
            <LoadingScreen loading_text={"Creating account"} loadingStatus={ loader } />
            <Footer/>
        </div>
    )
}

export default MerchantSignup
