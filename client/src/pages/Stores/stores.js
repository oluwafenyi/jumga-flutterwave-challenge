import React from 'react';
import SearchIcon from '../../assets/search.svg';
import {AltNavigation} from '../../components/Navigation/navigation';
import StoreCard from '../../components/StoreCard/storeCard';
import Footer from '../../components/Footer/footer';
import './stores.css'
import Pagination from '../../components/Pagination/pagination';

const Stores = () =>{
    return(
        <div className="stores-page">
            <nav>
                <AltNavigation/>
            </nav>
            <main>
                <div className="stores-header">
                    <h2 className="stores-page-title">Stores</h2>
                    <div className="stores-search">
                        <img src={SearchIcon} alt="search icon"/>
                        <input type="text" placeholder="Search for stores" className="search-input"/>
                    </div>
                </div>
                <section className="stores-gallery">
                    <StoreCard/>
                    <StoreCard/>
                    <StoreCard/>
                </section>
                <Pagination/>
            </main>
            <Footer/>
        </div>
    )
}

export default Stores;