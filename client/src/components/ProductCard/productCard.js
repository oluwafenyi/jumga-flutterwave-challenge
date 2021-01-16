import React from 'react';
import { Link } from 'react-router-dom';
import './productCard.css';

const ProductCard = (props) =>{

    const getPrice = () => {
        if (props.price) {
            return props.price.toFixed(2)
        }
    }

    return(
        <Link to={"/products/" + props.productId} className="product-card" style={{background:`url(${props.imageLink})`}}>
            <div className="product-type">
                <p>{ props.category }</p>
            </div>
            <div className="product-details">
                <h3 className="product-name">{ props.name }</h3>
                <p className="product-price">$ { getPrice() } </p>
            </div>
        </Link>
    )
}

export default ProductCard;