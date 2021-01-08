import React from 'react';
import './productsMenu.css';

function ProductsMenu() {
    return (
        <div className="products-menu">
            <ul className="products-list">
                <li className="product">All Products</li>
                <li className="product">Electronics</li>
                <li className="product">Fashion</li>
                <li className="product">Cosmetics</li>
                <li className="product">Food Stuff</li>
                <li className="product">Sport and Fitness</li>
            </ul>
        </div>
    )
}

export default ProductsMenu
