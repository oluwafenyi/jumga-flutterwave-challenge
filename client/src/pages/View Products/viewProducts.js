import React from 'react';
import Navigation from '../../components/Navigation/navigation';
import ProductMenu from '../../components/ProductsMenu/productsMenu';
import ProductIcon from '../../components/ProductIcon/productIcon';
import FilterIcon from '../../assets/Filter Icon.svg';
import Footer from '../../components/Footer/footer';
import './viewProducts.css';

function ViewProducts() {
    return (
        <div className="view-products-page">
            <nav>
                <Navigation/>
            </nav>
            <main>
                <section className="view-product-header">
                    <div className="filter">
                        <div className="filter-icon">
                            <img src={FilterIcon} alt="filter"/>
                        </div>
                        <ul className="filter-menu">
                            <li className="filter-menu-item">A-Z</li>
                            <li className="filter-menu-item">Prices</li>
                            <li className="filter-menu-item">Ratings</li>
                        </ul>
                    </div>
                    <ProductMenu/>
                </section>
                <section className="products-gallery">
                    <ProductIcon/>
                    <ProductIcon/>
                    <ProductIcon/>
                </section>
            </main>
            <Footer/>
        </div>
    )
}

export default ViewProducts
