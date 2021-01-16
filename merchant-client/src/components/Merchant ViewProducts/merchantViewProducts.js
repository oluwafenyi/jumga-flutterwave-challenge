import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import {AltPagination} from '../Pagination/pagination';
import MerchantProductCard from '../Merchant ProductCard/merchantProductCard';
import StoresSearch from '../../components/StoresSearch/storesSearch';
import './merchantViewProducts.scss';
import {jumga} from "../../axios";
import {jumgaState} from "../../store/store";

import { Power3 } from 'gsap';
import { gsap } from 'gsap';

function MerchantViewProducts() {
    window.scrollTo(0,0);
    const [ products, setProducts ] = useState([])
    const [ prevPage, setPrevPage ] = useState(false);
    const [ nextPage, setNextPage ] = useState(false);
    const [ numberOfPages, setNumberOfPages ] = useState(0);
    const location = useLocation();
    let ViewProductsPage = useRef(null);

    useEffect(() => {
        const getProducts = async () => {
            const productsPP = 24;
            const params = queryString.parse(location.search);
            let pageNumber = Number(params.page);

            if (isNaN(pageNumber) || pageNumber < 1) {
                pageNumber = 1;
            }

            if (pageNumber === 1) {
                setPrevPage(false);
            } else {
                setPrevPage(true);
            }

            const storeId = jumgaState.store_id;
            const  storeCategory = "all";

            let limit = productsPP * pageNumber;
            try {
                const response = await jumga.get(`/v1/store/${storeId}/products?startAt=${limit - productsPP}&limit=${limit}&category=${storeCategory}`);
                console.log(response.data);
                setProducts(response.data.data);
                if (response.data.next) {
                    setNextPage(true);
                }
                const pages = Math.ceil( response.data.total / productsPP);
                setNumberOfPages(pages);
            } catch (err) {
                console.log(err)
            }
        }

        (async function() {
            await getProducts();
        })();
    }, [location.search])

    const productListing = () => {
        return products.map(product => {
            return (
                <MerchantProductCard key={ product.id } productId={product.id} stock={ product.stock } title={ product.title } price={ product.price } imageLink={ product.display_image } />
            )
        })
    }

    // GSAP
    useEffect(()=>{
        gsap.fromTo(ViewProductsPage, {y:-50}, {opacity: 1, duration: 1, y:0, ease: Power3.easeOut,delay:0.7})
    },[])

    return (
        <div className="merchant-view-products" ref={ el=> ViewProductsPage=el }>
            <h2 className="merchant-view-products-title">My Products</h2>
            <div className="view-products">
                <StoresSearch/>
                <div className="products-list">
                    { productListing() }
                </div>
            </div>
            <AltPagination prev={prevPage} next={nextPage} numberOfPages={numberOfPages} />
        </div>
    )
}

export default MerchantViewProducts
