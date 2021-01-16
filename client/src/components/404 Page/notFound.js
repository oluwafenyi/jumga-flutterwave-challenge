import React from 'react';
import { Link } from 'react-router-dom';
import './notFound.css';

const NotFound = () =>{

    return(
        <div className="not-found-page">
            <h2 className="error">404</h2>
            <p className="subtitle">Product not found</p>
            <Link to="/products" className="page-link">Go to Products page</Link>
        </div>
    )
}

export default NotFound;