import React from 'react';
import Navigation from '../../components/Navigation/navigation';
import FilterIcon from '../../assets/Filter Icon.svg';
import ProductMenu from '../../components/ProductsMenu/productsMenu';
import ProductCard from '../../components/ProductCard/productCard';
import Footer from '../../components/Footer/footer';
import './store.css';

const Store = () =>{
    return(
        <div className="store-page">
            <header className="store-header">
                <nav>
                    <Navigation/>
                </nav>
                <div className="store-details">
                    <div className="store-icon">
                        <img src={""} alt="Store Icon" />
                    </div>
                    <div className="merchant-details">
                        <h3 className="store-name">Uncle Ignatius and sons online stores</h3>
                        <p className="store-owner">Owned by Ignatius Nwadiri</p>
                        <div className="contact-details">
                            <a href={"https://google.com"} target="_blank" rel="noreferrer" className="contact-link"><img src={""} alt="Mobile Number"/></a>
                            <a href={"https://yahoo.com"} target="_blank" rel="noreferrer" className="contact-link"><img src={""} alt="E-mail"/></a>
                        </div>
                        <div className="location-icon">🇳🇬</div>
                    </div>
                </div>
            </header>
            
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
                    <ProductCard/>
                    <ProductCard/>
                    <ProductCard/>
                </section>
            </main>
            <Footer/>
        </div>
    )
}

export default Store;