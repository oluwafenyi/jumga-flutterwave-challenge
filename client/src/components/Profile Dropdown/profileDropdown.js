import React from 'react';
import './profileDropdown.scss';

const ProfileDropdown = () =>{
    return(
        <div className="profile-dropdown">
            <div className="user-details">
                <div className="user-icon">
                    <img alt="user" src={""}/>
                </div>
                <div className="user-info">
                    <h3 className="user-name">Onwuka Stanley</h3>
                    <p className="user-email">stanstyler25@gmail.com</p>
                    <p className="user-mobile">08055051408</p>
                    <h5 className="user-country">🇳🇬</h5>
                </div>
            </div>
            <button className="logout-btn">Logout</button>
        </div>
    )
}

export default ProfileDropdown;