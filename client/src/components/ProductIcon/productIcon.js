import React from 'react';
import './productIcon.css';

const ProductIcon = () =>{
    return(
        <div className="product-icon">
            <div className="product-type">
                <p>Fashion</p>
            </div>
            <div className="product-details">
                <h3 className="product-name">Adidas</h3>
                <p className="product-price">$500</p>
            </div>
        </div>
    )
}

export default ProductIcon;