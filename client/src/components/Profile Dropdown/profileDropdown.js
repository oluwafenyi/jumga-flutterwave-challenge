import React from 'react';
import { useHistory } from 'react-router-dom';
import { jumgaState} from "../../store/store";

import './profileDropdown.scss';

const ProfileDropdown = ({profileDropdown, displayProfileDropdown}) =>{
    const history = useHistory();

    const logoutUser = () => {
        jumgaState.clearAccessToken();
        history.push("/");
    }


    return(
        <div className={`profile-dropdown ${profileDropdown ? "show-profile-dropdown" : ""}`}>
            <button onClick={ ()=>displayProfileDropdown(false) } className="close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <div className="user-details">
                <div className="user-icon">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 15C28.1458 15 26.3333 15.5498 24.7915 16.58C23.2498 17.6101 22.0482 19.0743 21.3386 20.7873C20.6291 22.5004 20.4434 24.3854 20.8051 26.204C21.1669 28.0225 22.0598 29.693 23.3709 31.0041C24.682 32.3152 26.3525 33.2081 28.171 33.5699C29.9896 33.9316 31.8746 33.7459 33.5877 33.0364C35.3007 32.3268 36.7649 31.1252 37.7951 29.5835C38.8252 28.0418 39.375 26.2292 39.375 24.375C39.375 21.8886 38.3873 19.504 36.6291 17.7459C34.871 15.9877 32.4864 15 30 15Z" fill="black"/>
                        <path d="M30 3.75C24.8083 3.75 19.7331 5.28954 15.4163 8.17392C11.0995 11.0583 7.73497 15.158 5.74817 19.9546C3.76137 24.7511 3.24154 30.0291 4.2544 35.1211C5.26726 40.2131 7.76733 44.8904 11.4385 48.5615C15.1096 52.2327 19.7869 54.7327 24.8789 55.7456C29.9709 56.7585 35.2489 56.2386 40.0454 54.2518C44.842 52.265 48.9417 48.9005 51.8261 44.5837C54.7105 40.2669 56.25 35.1918 56.25 30C56.2421 23.0405 53.4739 16.3683 48.5528 11.4472C43.6317 6.52611 36.9595 3.75794 30 3.75V3.75ZM44.985 46.7362C44.9476 44.2769 43.9456 41.9306 42.1948 40.203C40.4441 38.4753 38.0847 37.5046 35.625 37.5H24.375C21.9154 37.5046 19.556 38.4753 17.8052 40.203C16.0544 41.9306 15.0524 44.2769 15.015 46.7362C11.6148 43.7001 9.21701 39.7029 8.13908 35.2737C7.06115 30.8446 7.35395 26.1925 8.97871 21.9335C10.6035 17.6745 13.4835 14.0094 17.2376 11.4236C20.9916 8.83775 25.4425 7.45317 30.0009 7.45317C34.5594 7.45317 39.0103 8.83775 42.7643 11.4236C46.5183 14.0094 49.3984 17.6745 51.0232 21.9335C52.6479 26.1925 52.9407 30.8446 51.8628 35.2737C50.7849 39.7029 48.3871 43.7001 44.9869 46.7362H44.985Z" fill="black"/>
                    </svg>
                </div>
                <div className="user-info">
                    <h3 className="user-name">Onwuka Stanley</h3>
                    <p className="user-email">stanstyler25@gmail.com</p>
                    <p className="user-mobile">08055051408</p>
                    <div className="user-country">🇳🇬</div>
                </div>
            </div>
            <button className="logout-btn" onClick={ logoutUser }>Logout</button>
        </div>
    )
}

export default ProfileDropdown;