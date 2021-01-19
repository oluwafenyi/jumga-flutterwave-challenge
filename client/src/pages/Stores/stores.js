import React, { useState, useEffect } from 'react';
import queryString from "query-string";
import StoresSearch from '../../components/StoresSearch/storesSearch';
import {AltNavigation} from '../../components/Navigation/navigation';
import StoreCard from '../../components/StoreCard/storeCard';
import Footer from '../../components/Footer/footer';
import './stores.scss'
import Pagination from '../../components/Pagination/pagination';
import Placeholders from 'loading-placeholders';
import {jumga} from "../../axios";

const Stores = (props) =>{
    const [ stores, setStores ] = useState([]);
    const [ prevPage, setPrevPage ] = useState(false);
    const [ nextPage, setNextPage ] = useState(false);
    const [ numberOfPages, setNumberOfPages ] = useState(0);
    const [ page, setPage ] = useState(1);
    const [ storeLoadingStatus, setStoreLoadingStatus ] = useState('')

    useEffect(() => {
        const getStores = async () => {
            const storesPP = 24;
            const params = queryString.parse(props.location.search);
            let pageNumber = Number(params.page);

            if (isNaN(pageNumber) || pageNumber < 1) {
                pageNumber = 1;
            }

            setPage(pageNumber)

            if (pageNumber === 1) {
                setPrevPage(false);
            } else {
                setPrevPage(true);
            }

            let startAt = (storesPP * pageNumber) - storesPP;
            try {
                const response = await jumga.get(`/v1/store?approved=true&startAt=${startAt}&limit=${storesPP}`);
                console.log(response.data);
                setStores(response.data.data);
                if (response.data.next) {
                    setNextPage(true);
                } else {
                    setNextPage(false);
                }
                const pages = Math.ceil( response.data.total / storesPP);
                setNumberOfPages(pages);

                // For loading
                setTimeout(()=>{
                    setStoreLoadingStatus(response.data.status);
                },2000)
            } catch (err) {
                console.log(err)
            }
        }

        (async function() {
            await getStores();
        })();
    }, [props.location.search])

    const storeListing = () => {
        return stores.map(store => {
            return (
                <StoreCard key={ store.id } storeId={store.id} businessName={store.business_name} country={store.country} imageLink={store.logo} businessContact={store.business_contact} categories={store.categories} />
            )
        })
    }

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
                {
                    storeLoadingStatus !=="success"

                    ?
                    <Placeholders 
                        height="180px"
                        width="270px"
                        br="15px"
                        n="5"
                        margin="0.4rem"
                    />
                    :
                    <section className="stores-gallery">
                        { storeListing() }
                    </section>
                }
                <Pagination prev={prevPage} next={nextPage} numberOfPages={numberOfPages} page={page}/>
            </main>
            <Footer/>
        </div>
    )
}

export default Stores;