import React from 'react';
import DispatchRider from '../../assets/test-dispatch.png';
import './merchantDispatchService.scss';

const MerchantDispatchService = () =>{
    window.scrollTo(0,0);
    return(
        <div className="merchant-dispatch-service">
            <h2 className="merchant-dispatch-service-title">Dispatch Service</h2>
            <div className="current-dispatch-rider">
                <h3 className="current-dispatch-rider-title">Current Dispatch Rider</h3>
                <div className="current-dispatch-rider-info">
                    <div className="dispatch-rider-passport">
                        <img src={ DispatchRider } alt="Dispatch Rider" />
                    </div>
                    <div className="dispatch-rider-details">
                        <h3 className="name">Wasiu Mutiu</h3>
                        <h4 className="contact-details-title">Contact Details</h4>
                        <div className="contact-details">
                            <p className="mobile-number">08012113422</p>
                            <p className="email">wasiu_mutiu69@yahoo.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="new-rider">
                <div className="new-rider-header">
                    <div className="chevron">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.5 27L22.5 18L13.5 9" stroke="#20263C" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h3 className="new-rider-title">Register new dispatch rider</h3>
                </div>
                <div className="new-rider-form-body">
                    <p className="new-rider-subtitle">(This wil overwrite the info of an existing dispatch rider)</p>
                    <form className="new-rider-form">
                        <input type="text" placeholder="Full Name" className="merchant-form-input"/>
                        <input type="email" placeholder="Email" className="merchant-form-input"/>
                        <input type="tel" placeholder="Mobile Number" className="merchant-form-input"/>
                        <select className="merchant-form-select">
                            <option className="merchant-form-select-item">Select Country</option>
                            <option className="merchant-form-select-item">Nigeria</option>
                            <option className="merchant-form-select-item">Kenya</option>
                            <option className="merchant-form-select-item">United Kingdom</option>
                        </select>
                        <select className="merchant-form-select">
                            <option className="merchant-form-select-item">Select Bank</option>
                            <option className="merchant-form-select-item">Nigeria</option>
                            <option className="merchant-form-select-item">Kenya</option>
                            <option className="merchant-form-select-item">United Kingdom</option>
                        </select>
                        <input type="text" placeholder="Account Number" className="merchant-form-input"/>
                        <input type="submit" value="Register" className="merchant-form-submit"/>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MerchantDispatchService;