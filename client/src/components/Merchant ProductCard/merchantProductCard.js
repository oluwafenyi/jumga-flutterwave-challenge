import React from 'react';
import './merchantProductCard.css';

const MerchantProductCard = ({hasDeleteBtn}) =>{

    return(
        <div className="merchant-product-card">
            <div className="product-details">
                <div className="product-img">
                    <img src={ "" } alt="Product"/>
                </div>
                <div className="name-price">
                    <h3 className="product-name">Adidas</h3>
                    <p className="product-price">$500</p>
                </div>
            </div>
            <div className={`delete-btn ${hasDeleteBtn === false ? 'hide-delete' : ''}`}>
                <img src={""} alt="Delete Btn" />
            </div>
        </div>
    )
}

export default MerchantProductCard;