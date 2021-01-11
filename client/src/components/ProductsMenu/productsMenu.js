import React from 'react';
import './productsMenu.css';

function ProductsMenu({ category, setCategory }) {
    return (
        <div className="products-menu">
            <ul className="products-list">
                <li className={`product ${category === 'all' ? "selected-category" : '' }`} onClick={ ()=>setCategory('all') }>All Products</li>
                <li className={`product ${category === 'electronics' ? "selected-category" : '' }`} onClick={ ()=>setCategory('electronics') }>Electronics</li>
                <li className={`product ${category === 'fashion' ? "selected-category" : '' }`} onClick={ ()=>setCategory('fashion') }>Fashion</li>
                <li className={`product ${category === 'cosmetics' ? "selected-category" : '' }`} onClick={ ()=>setCategory('cosmetics') }>Cosmetics</li>
                <li className={`product ${category === 'food' ? "selected-category" : '' }`} onClick={ ()=>setCategory('foodstuff') }>Food Stuff</li>
                <li className={`product ${category === 'sports' ? "selected-category" : '' }`} onClick={ ()=>setCategory('fitfam') }>Sport and Fitness</li>
            </ul>
        </div>
    )
}

export default ProductsMenu
