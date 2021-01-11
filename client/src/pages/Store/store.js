import React, { useState } from 'react';
import Navigation from '../../components/Navigation/navigation';
import FilterIcon from '../../assets/Filter Icon.svg';
import ProductMenu from '../../components/ProductsMenu/productsMenu';
import ProductCard from '../../components/ProductCard/productCard';
import Phone from '../../assets/phone.svg';
import Email from '../../assets/email.svg';
import Footer from '../../components/Footer/footer';
import Pagination from '../../components/Pagination/pagination';
import './store.css';

const Store = () =>{
    const [ storeCategory, setStoreCategory ] = useState('all');
    const [ storeFilter, setStoreFilter ] = useState(false);
    return(
        <div className="store-page">
            <nav>
                <Navigation/>
            </nav>

            <div className="store-header">
                <div className="store-icon">
                    <img src={""} alt="Store Icon" />
                </div>
                <div className="merchant-details">
                    <h3 className="store-name">Uncle Ignatius and sons online stores</h3>
                    <p className="store-owner">Owned by Ignatius Nwadiri</p>
                    <div className="contact-details">
                        <a href={"https://google.com"} target="_blank" rel="noreferrer" className="contact-link"><img src={Phone} alt="Mobile Number"/></a>
                        <a href={"https://yahoo.com"} target="_blank" rel="noreferrer" className="contact-link"><img src={Email} alt="E-mail"/></a>
                    </div>
                    <div className="location-icon">🇳🇬</div>
                </div>
            </div>
            
            <main>
                <section className="view-product-header">
                    <div className="filter">
                    <div onClick={ ()=>setStoreFilter(!storeFilter) } className="filter-icon">
                            <img src={FilterIcon} alt="filter"/>
                        </div>
                        <ul className={`filter-menu ${ storeFilter ? "open-filter-menu" : "" }`}>
                            <li className="filter-menu-item">A-Z</li>
                            <li className="filter-menu-item">Prices</li>
                            <li className="filter-menu-item">Ratings</li>
                        </ul>
                    </div>
                    <ProductMenu  category={ storeCategory } setCategory={ setStoreCategory } />
                </section>
                <section className="products-gallery">
                    <ProductCard/>
                    <ProductCard/>
                    <ProductCard/>
                </section>
                <Pagination/>
            </main>
            
            <Footer/>
        </div>
    )
}

export default Store;