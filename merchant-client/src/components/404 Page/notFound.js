import React from 'react';
import { Link } from 'react-router-dom';
import './notFound.css';
import Navigation, {AltNavigation} from "../Navigation/navigation";
import {clientLink} from "../../constants";

const NotFound = ({nav}) =>{

    return(
        <div>
            <nav>
                {nav ? <AltNavigation/> : null}
            </nav>
            <div className="not-found-page">
                <h2 className="error">404</h2>
                <p className="subtitle">Page not found</p>
                <a href={ clientLink + "/products" } className="page-link">Go to Products page</a>
                <Link to="/" className="page-link">Go Home</Link>
            </div>
        </div>
    )
}

export default NotFound;