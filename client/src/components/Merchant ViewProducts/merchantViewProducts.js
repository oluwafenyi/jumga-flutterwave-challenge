import React from 'react';
import {AltPagination} from '../Pagination/pagination';
import MerchantProductCard from '../Merchant ProductCard/merchantProductCard';
import StoresSearch from '../../components/StoresSearch/storesSearch';
import './merchantViewProducts.scss';

function MerchantViewProducts() {
    window.scrollTo(0,0);
    return (
        <div className="merchant-view-products">
            <h2 className="merchant-view-products-title">My Products</h2>
            <div className="view-products">
                <StoresSearch/>
                <div className="products-list">
                    <MerchantProductCard hasDeleteBtn={ true } width={ 500 } />
                    <MerchantProductCard hasDeleteBtn={ true } width={ 500 } />
                    <MerchantProductCard hasDeleteBtn={ true } width={ 500 } />
                    <MerchantProductCard hasDeleteBtn={ true } width={ 500 } />
                    <MerchantProductCard hasDeleteBtn={ true } width={ 500 } />
                </div>
            </div>
            <AltPagination/>
        </div>
    )
}

export default MerchantViewProducts
