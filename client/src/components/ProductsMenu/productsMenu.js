import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import './productsMenu.scss';

function ProductsMenu({ category }) {
    let productMenu = useRef(null);

    const handleScroll = (scrollOffset)=>{
        productMenu.current.scrollLeft += scrollOffset   
    }


    return (
        <div className="products-menu">
            <button className="forward-btn" onClick={ ()=>handleScroll(-150) } >
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.25 37.5L18.75 25L31.25 12.5" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <ul className="products-list" ref={ el=>productMenu.current=el} >
                <li className={`product ${category === 'all' ? "selected-category" : '' }`}>
                    <Link to="?category=all">
                        All Products
                    </Link>
                </li>
                <li className={`product ${category === 'electronics' ? "selected-category" : '' }`}>
                    <Link to="?category=electronics">
                        Electronics
                    </Link>
                </li>
                <li className={`product ${category === 'fashion' ? "selected-category" : '' }`}>
                    <Link to="?category=fashion">
                        Fashion
                    </Link>
                </li>
                <li className={`product ${category === 'cosmetics' ? "selected-category" : '' }`}>
                    <Link to="?category=cosmetics">
                        Cosmetics
                    </Link>
                </li>
                <li className={`product ${category === 'foodstuff' ? "selected-category" : '' }`}>
                    <Link to="?category=foodstuff">
                        Food Stuff
                    </Link>
                </li>
                <li className={`product ${category === 'fitfam' ? "selected-category" : '' }`}>
                    <Link to="?category=fitfam">
                        Sports & Fitness
                    </Link>
                </li>
            </ul>  
            <button className="backward-btn" onClick={ ()=>handleScroll(150) }>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.75 37.5L31.25 25L18.75 12.5" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </div>
    )
}

export function AltProductsMenu({ category, setCategory }) {
    return (
        <div className="products-menu">
            <ul className="products-list">
                <li className={`product ${category === 'all' ? "selected-category" : '' }`} onClick={ ()=>setCategory('all') }>All Products</li>
                <li className={`product ${category === 'electronics' ? "selected-category" : '' }`} onClick={ ()=>setCategory('electronics') }>Electronics</li>
                <li className={`product ${category === 'fashion' ? "selected-category" : '' }`} onClick={ ()=>setCategory('fashion') }>Fashion</li>
                <li className={`product ${category === 'cosmetics' ? "selected-category" : '' }`} onClick={ ()=>setCategory('cosmetics') }>Cosmetics</li>
                <li className={`product ${category === 'foodstuff' ? "selected-category" : '' }`} onClick={ ()=>setCategory('foodstuff') }>Food Stuff</li>
                <li className={`product ${category === 'fitfam' ? "selected-category" : '' }`} onClick={ ()=>setCategory('fitfam') }>Sports & Fitness</li>
            </ul>
        </div>
    )
}

export default ProductsMenu
