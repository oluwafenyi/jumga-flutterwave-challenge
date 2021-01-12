import React from 'react';
import LineChart from '../../assets/Line chart.svg';
import MerchantProductCard from '../Merchant ProductCard/merchantProductCard';
import './merchantOverview.scss';

const MerchantOverview = () =>{
    // window.scrollTo(0,0);
    return(
        <div className="merchant-overview">
            <p className="merchant-overview-title">Overview</p>
            <div className="overview-details">
                <div className="total-values">
                    <div className="total-ratings">
                        <p className="available-products">Total number of available products: <span></span></p>
                        <p className="ratings">Average product ratings: <span></span></p>
                        <p className="buyers">Total number of buyers: <span></span></p>
                    </div>
                    <div className="total-statistics">
                        <p className="sales">Total number of sales: <span></span></p>
                        <p className="products-shipped">Total products shipped:<span></span></p>
                        <p className="order-awaiting">Orders awaiting shipping:<span></span></p>
                    </div>
                </div>
                <div className="sales-details">
                    <h3 className="sales-title">Weekly Statistics</h3>
                    <div className="sales-statistics">
                        <div className="sales-graph-img">
                            <img src={ LineChart } alt="Line Chart"/>
                        </div>
                        <div className="sales-values">
                            <p className="sales">Number of sales: <span></span></p>
                            <p className="products-shipped">Products shipped:<span></span></p>
                            <p className="order-awaiting">Orders awaiting shipping:<span></span></p>
                        </div>
                        
                    </div>
                   
                </div>
            </div>
            <div className="top-sales-section">
                <h3 className="top-sales-title">Top selling products</h3>
                <div className="top-sales">
                    <MerchantProductCard hasDeleteBtn={ false } width={600} />
                    <MerchantProductCard hasDeleteBtn={ false } width={600} />
                    <MerchantProductCard hasDeleteBtn={ false } width={600} />
                </div>
            </div>
        </div>
    )
}

export default MerchantOverview;