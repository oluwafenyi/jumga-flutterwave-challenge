import React from 'react';
import { Link } from 'react-router-dom';
import CategoryItem from '../CategoryItem/categoryItem';
import './storeCard.css';

function StoreCard() {
    return (
        <Link to="/store" className="store-card">
            <div className="store-icon">
                <img src={""} alt="Store Icon"/>
            </div>
            <div className="store-details">
                <h3 className="store-name">Uchemba Stores</h3>
                <div className="store-owner">
                    <div className="location-icon">{'🇳🇬'}</div>
                    <p className="store-owner-name">Uchemba</p> 
                </div>
            </div>
            <div className="categories-available">
                <CategoryItem category={'Fashion'}/>
                <CategoryItem category={'Food Stuff'}/>
            </div>
        </Link>
    )
}

export default StoreCard
