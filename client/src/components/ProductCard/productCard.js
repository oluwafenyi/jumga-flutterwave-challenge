import React,{ useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Power3 } from 'gsap';
import { Link } from 'react-router-dom';
import './productCard.scss';

const ProductCard = (props) =>{
    let product = useRef(null)

    const getPrice = () => {
        if (props.price) {
            return props.price.toFixed(2)
        }
    }

    useEffect(()=>{
        gsap.fromTo(product, {y:20}, {opacity: 1, duration: 0.3, y:0, ease: Power3.easeOut,delay:0.1})
    },[product])

    return(
        <Link to={"/products/" + props.productId} ref={ el=>product=el } className="product-card" style={{background:`linear-gradient(0deg, rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0.50)), url(${props.imageLink})`,backgroundPosition:"center",backgroundSize:"cover"}}>
            <div className="product-type">
                <p>{ props.category }</p>
            </div>
            <div className="product-details">
                <h3 className="product-name">{ props.name }</h3>
                <p className="product-price">{"$"}{ getPrice() } </p>
            </div>
        </Link>
    )
}

export default ProductCard;