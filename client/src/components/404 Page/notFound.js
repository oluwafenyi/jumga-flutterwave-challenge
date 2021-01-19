import React from 'react';
import { Link } from 'react-router-dom';
import './notFound.scss';
import Navigation from "../Navigation/navigation";

const NotFound = ({nav}) =>{

    return(
        <div>
            <nav>
                {nav ? <Navigation/> : null}
            </nav>
            <div className="not-found-page">
                <h2 className="error">404</h2>
                <p className="subtitle">Page not found</p>
                <Link to="/products" className="page-link">Go to Products page</Link>
                <Link to="/" className="page-link">Go Home</Link>
            </div>
        </div>
    )
}

export default NotFound;