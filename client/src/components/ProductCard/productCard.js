import React from 'react';
import { Link } from 'react-router-dom';
import './productCard.css';

const ProductCard = () =>{
    let bg_link = '';
    //Passing in background from here
    return(
        <Link to="/preview" className="product-icon" style={{background:`url(${bg_link})`}}>
            <div className="product-type">
                <p>{ props.category }</p>
            </div>
            <div className="product-details">
                <h3 className="product-name">{ props.name }</h3>
                <p className="product-price">${ props.price }</p>
            </div>
        </Link>
    )
}

export default ProductCard;