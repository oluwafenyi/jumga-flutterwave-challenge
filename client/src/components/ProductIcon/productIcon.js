import React from 'react';
import './productIcon.css';

const ProductIcon = (props) =>{
    return(
        <div className="product-icon">
            <div className="product-type">
                <p>{ props.category }</p>
            </div>
            <div className="product-details">
                <h3 className="product-name">{ props.name }</h3>
                <p className="product-price">${ props.price }</p>
            </div>
        </div>
    )
}

export default ProductIcon;