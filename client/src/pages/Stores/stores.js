import React from 'react';
import StoresSearch from '../../components/StoresSearch/storesSearch';
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
                    <StoresSearch/>
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