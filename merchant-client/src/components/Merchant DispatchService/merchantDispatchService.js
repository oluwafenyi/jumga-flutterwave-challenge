import React, { useState, useEffect, useRef } from 'react';
import DispatchRider from '../../assets/test-dispatch.png';
import './merchantDispatchService.scss';
import {jumga} from "../../axios";
import utils from "../../utils/utils";

import { Power3 } from 'gsap';
import { gsap } from 'gsap';

const MerchantDispatchService = () =>{
    const [ rider, setRider ] = useState({name: ""});
    const [ form, updateForm ] = useState({
        "name": "",
        "email": "",
        "mobile": "",
        "account_number": "",
    });
    const [ country, setCountry ] = useState("");
    const [ banks, setBanks ] = useState([]);
    const [ bank, setBank ] = useState("");
    let DispatchPage = useRef(null); 

    const currentRider = () => {
        if (rider.name !== "") {
            return (
                <div className="current-dispatch-rider">
                    <h3 className="current-dispatch-rider-title">Current Dispatch Rider</h3>
                    <div className="current-dispatch-rider-info">
                        <div className="dispatch-rider-passport">
                            <img src={ DispatchRider } alt="Dispatch Rider" />
                        </div>
                        <div className="dispatch-rider-details">
                            <h3 className="name">{ rider.name }</h3>
                            <h4 className="contact-details-title">Contact Details</h4>
                            <div className="contact-details">
                                <p className="mobile-number">{ rider.mobile }</p>
                                <p className="email">{ rider.email }</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
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

    const handleBankSelection = (e) => {
        setBank(e.target.value);
    }

    const handleFormChange = (e) => {
        updateForm(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            }
        });
    }

    const handleCountrySelection = (e) => {
        setCountry(e.target.value);
    }

    useEffect(() => {
        async function  getDispatchRider() {
            const response = await jumga.get("/v1/merchant/dispatch");
            console.log(response);
            if (response.data.data !== null) {
                setRider(response.data.data);
            }
        }

        (async function () {
            await getDispatchRider()
        })();

    }, [])

    const updateRider = async (e) => {
        e.preventDefault();
        console.log({ ...form, "account_bank": bank, country })
        try {
            await jumga.delete("/v1/merchant/dispatch");
        } catch (err) {
            console.log(err)
        }

        try {
            const response = await jumga.put("/v1/merchant/dispatch", { ...form, "account_bank": bank, country })
            console.log(response)
            if (response.status === 200) {
                setRider({
                    ...form
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(()=>{
        gsap.fromTo(DispatchPage, {y:-50}, {opacity: 1, duration: 1, y:0, ease: Power3.easeOut,delay:0.7})
    },[])

    return(
        <div className="merchant-dispatch-service" ref={ el=>DispatchPage=el }>
            <h2 className="merchant-dispatch-service-title">Dispatch Service</h2>
            { currentRider() }
            <div className="new-rider">
                <div className="new-rider-header">
                    <div className="chevron">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.5 27L22.5 18L13.5 9" stroke="#20263C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3 className="new-rider-title">Register new dispatch rider</h3>
                </div>
                <div className="new-rider-form-body">
                    <p className="new-rider-subtitle">(This will delete the existing rider)</p>
                    <form className="new-rider-form">
                        <input type="text" placeholder="Full Name" name="name" onChange={handleFormChange} className="merchant-form-input"/>
                        <input type="email" placeholder="Email" name="email" onChange={handleFormChange} className="merchant-form-input"/>
                        <input type="tel" placeholder="Mobile Number" name="mobile" onChange={handleFormChange} className="merchant-form-input"/>
                        <select className="merchant-form-select" value={country} onChange={handleCountrySelection}>
                            <option className="merchant-form-select-item" value="" disabled>Select Country</option>
                            <option className="merchant-form-select-item" value="NG">Nigeria</option>
                            <option className="merchant-form-select-item" value="KE">Kenya</option>
                            <option className="merchant-form-select-item" value="GH">Ghana</option>
                        </select>
                        <select className="merchant-form-select" value={bank} onChange={handleBankSelection}>
                            <option className="merchant-form-select-item" value="" disabled>Select Bank</option>
                            { bankOptions() }
                        </select>
                        <input type="text" placeholder="Account Number" name="account_number" onChange={ handleFormChange } className="merchant-form-input"/>
                        <input type="submit" value="Register" className="merchant-form-submit" onClick={ updateRider } />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MerchantDispatchService;