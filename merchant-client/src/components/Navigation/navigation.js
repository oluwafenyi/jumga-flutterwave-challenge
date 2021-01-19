import React, { useState } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom';
import Search from '../Search/search';
import './navigation.scss';

import { clientLink } from "../../constants";
import { jumgaState } from "../../store/store";

function Navigation() {
    const location = useLocation();
    const history = useHistory();

    const logoutUser = () => {
        jumgaState.clearAccessToken();
        history.push("/");
    }

    const getAuthStatusButton = () => {
        if (!jumgaState.isAuthenticated()) {
            return (
                <li><Link to="/login" className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`}>Login</Link></li>
            )
        }
        return (
            <li><button className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`} onClick={logoutUser} >Logout</button></li>
        )
    }

    return (
        <div className="navigation">
            <div className="mobile-menu-btn">
                <div className="bar bar-1"></div>
                <div className="bar bar-2"></div>
                <div className="bar bar-3"></div>
            </div>
            <ul className="desktop-menu">
                <li><a href={ clientLink + "/" } className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`} >Home</a></li>
                <li><a href={ clientLink + "/products" } className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`}>All Products</a></li>
                <li><a href={ clientLink + "/stores" } className={`menu-item ${location.pathname !== '/' ? 'dark' : '' }`}>Stores</a></li>
                { getAuthStatusButton() }
            </ul>
            <Link to="/" className="logo">
                <h1 className={`${location.pathname !== '/' ? 'dark' : '' }`}>jumga.</h1>
            </Link>
            <Search/>
            <div className="mobile-menu-container">
                <div className="close-menu-btn">
                    <div className="bar bar-1"></div>
                    <div className="bar bar-2"></div>
                </div>
                <div className="logo">
                    <h1>jumga.</h1>
                    <p>Merchant</p>
                </div>

                <ul className="mobile-menu">
                    <li><a href={ clientLink + "/" } className="menu-item" >Home</a></li>
                    <li><a href={ clientLink + "/products" } className="menu-item">All Products</a></li>
                    <li><a href={ clientLink + "/stores" } className="menu-item">Stores</a></li>
                    <li><Link to="/login" className="menu-item">Login</Link></li>
                </ul>
            </div>
        </div>
    )
}

export function AltNavigation() {
    const [ altMenu, setAltMenu ]= useState(false);

    const getAuthButton = () => {
        if (jumgaState.isAuthenticated()) {
            return <li><Link to="/" className="menu-item">Dashboard</Link></li>
        }
        return <li><Link to="/login" className="menu-item">Login</Link></li>
    }

    return(
        <div className="alt-navigation">
            <div className="desktop-menu-container">
                <div className="mobile-menu-btn" onClick={ ()=>setAltMenu(true) }>
                    <div className="bar bar-1"></div>
                    <div className="bar bar-2"></div>
                    <div className="bar bar-3"></div>
                </div>
                <ul className="desktop-menu">
                    <li><a href={ clientLink + "/" } className="menu-item">Home</a></li>
                    <li><a href={ clientLink + "/products" } className="menu-item">All Products</a> </li>
                </ul>
                <Link to="/" className="logo">
                    <h1>jumga.</h1>
                    <p>Merchant</p>
                </Link>
                <ul className="desktop-menu">
                    <li><a href={ clientLink + "/stores" } className="menu-item">Stores</a></li>
                    { getAuthButton() }
                </ul>
            </div>
            <div className={`mobile-menu-container ${altMenu ? "show-mobile-menu" : ""}`}>
                <button className="close-menu-btn" onClick={ ()=>setAltMenu(false) }>
                    <svg width="40" height="40" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M39 13L13 39" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13 13L39 39" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <Link to="/" className="logo">
                    <h1>jumga.</h1>
                    <p>Merchant</p>
                </Link>
                <ul className="mobile-menu">
                    <li><a href={ clientLink + "/" } className="mobile-menu-item">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 25V17.5H17.5V25H23.75V15H27.5L15 3.75L2.5 15H6.25V25H12.5Z" fill="white"/>
                        </svg>
                        <p>Home</p>
                        </a>
                    </li>
                    <li><a href={ clientLink + "/products" } className="mobile-menu-item">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25.5 12H27V28.5H3V12H4.5V9.00001C4.5 4.86001 7.86 1.50001 12 1.50001C13.065 1.50001 14.085 1.72501 15 2.13001C15.9452 1.7132 16.967 1.49861 18 1.50001C22.14 1.50001 25.5 4.86001 25.5 9.00001V12ZM7.5 9.00001V12H10.5V9.00001C10.5 7.30501 11.085 5.76001 12.03 4.50001H12C9.525 4.50001 7.5 6.52501 7.5 9.00001ZM22.5 12V9.00001C22.5 6.52501 20.475 4.50001 18 4.50001H17.97C18.9563 5.79342 19.4935 7.37344 19.5 9.00001V12H22.5ZM15 5.67001C14.085 6.49501 13.5 7.68001 13.5 9.00001V12H16.5V9.00001C16.5 7.68001 15.915 6.49501 15 5.67001Z" fill="white"/>
                        </svg> 
                       <p>All Products</p>
                        </a>
                    </li>
                    <li><a href={ clientLink + "/stores" } className="mobile-menu-item">
                        <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0)">
                            <path d="M14.9992 18H5.99919V10.5H2.99919V22.5C2.99919 23.3297 3.6695 24 4.49919 24H16.4992C17.3289 24 17.9992 23.3297 17.9992 22.5V10.5H14.9992V18ZM29.7461 6.66562L25.7476 0.665625C25.4664 0.248437 24.9976 0 24.4961 0H5.50231C5.00075 0 4.532 0.248437 4.25544 0.665625L0.257 6.66562C-0.408625 7.66406 0.303875 9 1.50387 9H28.4992C29.6945 9 30.407 7.66406 29.7461 6.66562ZM23.9992 23.25C23.9992 23.6625 24.3367 24 24.7492 24H26.2492C26.6617 24 26.9992 23.6625 26.9992 23.25V10.5H23.9992V23.25Z" fill="white"/>
                            </g>
                            <defs>
                            <clipPath id="clip0">
                            <rect width="30" height="24" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                        <p>Stores</p>
                        </a>
                    </li>
                    <li><Link to="/login" className="mobile-menu-item">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0)">
                            <path d="M30 22.9101C30 22.4247 29.6065 22.0312 29.1211 22.0312H28.1832V6.52881C29.2061 6.16601 29.9409 5.18911 29.9409 4.0434V0.87943C29.9409 0.394053 29.5474 0.000549316 29.0621 0.000549316H0.937883C0.452506 0.000549316 0.0590022 0.394053 0.0590022 0.87943V4.04346C0.0590022 5.18917 0.793805 6.16607 1.81676 6.52887V22.0312H0.878881C0.393504 22.0312 0 22.4247 0 22.9101C0 23.3143 0.273273 23.654 0.644922 23.7565V29.1207C0.644922 29.606 1.03843 29.9996 1.5238 29.9996C2.00918 29.9996 2.40268 29.606 2.40268 29.1207V23.789H27.773V29.1207C27.773 29.606 28.1665 29.9996 28.6519 29.9996C29.1373 29.9996 29.5308 29.606 29.5308 29.1207V23.6874C29.8097 23.54 30 23.2474 30 22.9101ZM28.1832 4.04346C28.1832 4.52807 27.7889 4.92228 27.3043 4.92228C26.8197 4.92228 26.4254 4.52801 26.4254 4.04346V1.75831H28.1832V4.04346ZM24.6677 4.04346C24.6677 4.52807 24.2734 4.92228 23.7888 4.92228C23.3046 4.92228 22.9107 4.52883 22.9099 4.04498C22.9099 4.04445 22.91 4.04399 22.91 4.04346V1.75831H24.6677V4.04346ZM19.3944 1.75831H21.1521V4.04346C21.1521 4.04399 21.1521 4.04445 21.1521 4.04498C21.1513 4.52889 20.7575 4.92228 20.2733 4.92228C19.7887 4.92228 19.3944 4.52801 19.3944 4.04346V1.75831ZM17.6367 4.04346C17.6367 4.52807 17.2424 4.92228 16.7577 4.92228C16.2734 4.92228 15.8793 4.52842 15.8789 4.04422C15.8789 4.04399 15.8789 4.04375 15.8789 4.04346V1.75831H17.6367V4.04346ZM12.3634 1.75831H14.1211V4.04346V4.04381C14.1209 4.52825 13.7268 4.92228 13.2423 4.92228C12.7577 4.92228 12.3634 4.52801 12.3634 4.04346V1.75831ZM10.6056 4.04346C10.6056 4.52807 10.2114 4.92228 9.72675 4.92228C9.24225 4.92228 8.84804 4.52825 8.84787 4.04381C8.84787 4.04369 8.84787 4.04358 8.84787 4.04346V1.75831H10.6056V4.04346ZM5.33234 1.75831H7.09011V4.04346V4.04381C7.08987 4.52825 6.69572 4.92228 6.21122 4.92228C5.72661 4.92228 5.33234 4.52801 5.33234 4.04346V1.75831ZM1.81676 1.75831H3.57452V4.04346C3.57452 4.52807 3.18026 4.92228 2.69564 4.92228C2.21103 4.92228 1.81676 4.52801 1.81676 4.04346V1.75831ZM3.57452 6.52881C3.90194 6.41269 4.19976 6.23386 4.4534 6.00647C4.92027 6.42487 5.53636 6.67998 6.21117 6.67998C6.88597 6.67998 7.50207 6.42487 7.96893 6.00647C8.43579 6.42487 9.05188 6.67998 9.72669 6.67998C10.4015 6.67998 11.0176 6.42487 11.4844 6.00647C11.9513 6.42487 12.5674 6.67998 13.2422 6.67998C13.917 6.67998 14.5331 6.42487 15 6.00647C15.4668 6.42487 16.0829 6.67998 16.7577 6.67998C17.4325 6.67998 18.0486 6.42487 18.5155 6.00647C18.9824 6.42487 19.5984 6.67998 20.2733 6.67998C20.948 6.67998 21.5642 6.42493 22.031 6.00653C22.4978 6.42493 23.1139 6.67998 23.7887 6.67998C24.4635 6.67998 25.0796 6.42487 25.5465 6.00647C25.8002 6.23386 26.098 6.41269 26.4254 6.52881V22.0312H21.6794V18.6915C21.6794 16.6216 20.1156 14.9111 18.1076 14.6769C18.6554 13.9944 18.9842 13.1289 18.9842 12.1877C18.9842 9.99078 17.1968 8.20343 14.9999 8.20343C12.803 8.20343 11.0157 9.99078 11.0157 12.1877C11.0157 13.1289 11.3445 13.9944 11.8922 14.6769C9.88424 14.9111 8.32042 16.6216 8.32042 18.6915V22.0312H3.57447V6.52881H3.57452ZM12.7735 12.1877C12.7735 10.96 13.7723 9.96119 15 9.96119C16.2276 9.96119 17.2265 10.96 17.2265 12.1877C17.2265 13.4154 16.2276 14.4142 15 14.4142C13.7723 14.4142 12.7735 13.4154 12.7735 12.1877ZM13.3008 16.4063H16.6992V18.5156H13.3008V16.4063ZM12.4219 20.2734H17.5781C18.0635 20.2734 18.457 19.8799 18.457 19.3945V16.5592C19.3128 16.8897 19.9217 17.7206 19.9217 18.6915V22.0312H10.0782V18.6915C10.0782 17.7205 10.6872 16.8896 11.543 16.5592V19.3945C11.543 19.8799 11.9365 20.2734 12.4219 20.2734Z" fill="white"/>
                            <path d="M24.0231 27.3048C23.5385 27.3048 23.1443 26.9106 23.1443 26.4259C23.1443 25.9406 22.7507 25.5471 22.2654 25.5471H7.91032C7.42495 25.5471 7.03144 25.9406 7.03144 26.4259C7.03144 26.9106 6.63718 27.3048 6.15256 27.3048C5.66719 27.3048 5.27368 27.6983 5.27368 28.1837V29.1206C5.27368 29.606 5.66719 29.9995 6.15256 29.9995C6.63794 29.9995 7.03144 29.606 7.03144 29.1206V28.9119C7.77955 28.6467 8.37332 28.0529 8.63856 27.3048H21.5371C21.8023 28.0529 22.3961 28.6467 23.1443 28.9119V29.1206C23.1443 29.606 23.5378 29.9995 24.0231 29.9995C24.5085 29.9995 24.902 29.606 24.902 29.1206V28.1837C24.902 27.6983 24.5086 27.3048 24.0231 27.3048Z" fill="white"/>
                            </g>
                            <defs>
                            <clipPath id="clip0">
                            <rect width="30" height="30" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                        <p>Login</p>
                        </Link>
                    </li>
                </ul>
                <p className='copyright'>© 2021 Jumga. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Navigation
