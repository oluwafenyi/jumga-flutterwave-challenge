import React from 'react';
import './topOffersPopup.scss';

const TopOffersPopup = ({ setPopupStatus, popupStatus }) =>{
    
    return(
        <div className={`top-offers-popup ${ popupStatus ? "" : "hide-popup" }`}>
            <div className="popup-body">
                <div onClick={ ()=> setPopupStatus(false) } className="close-btn">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25.125 13.125L13.125 25.125" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13.125 13.125L25.125 25.125" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div className="popup-details">
                    <p className="popup-title">Offers will be available soon</p>
                    <p className="popup-subtitle">Exercise Patience</p>
                    <button onClick={ ()=> setPopupStatus(false) } className="close-modal">Continue shopping</button>
                </div>
            </div>
            <div className="top-offers-mask"></div>
        </div>
    )
}

export default TopOffersPopup;