import React from 'react';
import { Link } from "react-router-dom";
import './productsMenu.css';

function ProductsMenu({ category }) {
    return (
        <div className="products-menu">
            <ul className="products-list">
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
