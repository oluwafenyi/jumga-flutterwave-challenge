import React from 'react';
import { Link } from 'react-router-dom';
import './notFound.css';

const NotFound = () =>{

    return(
        <div className="not-found-page">
            <h2 className="404-title">404</h2>
            <p className="404-subtitle">Product not found</p>
            <Link to="/products">Go to Products page</Link>
        </div>
    )
}

export default NotFound;