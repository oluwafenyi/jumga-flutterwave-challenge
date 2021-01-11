import React from 'react';
import LineChart from '../../assets/Line chart.svg';
import '.merchantOverview.css';

const MerchantOverview = () =>{
    return(
        <div className="merchant-overview">
            <div className="merchant-overview-title">
                <p>Overview</p>
            </div>
            <div className="overview-details">
                <div className="total-values">
                    <div className="total-ratings">
                        <p className="available-products">Total number of available products: <span></span></p>
                        <p className="ratings">Total number of available products: <span></span></p>
                    </div>
                    <div className="total-statistics">
                        <p className="sales">Total number of sales: <span></span></p>
                        <p className="products-shipped">Total products shipped:<span></span></p>
                        <p className="order-awaiting">Orders awaiting shipping:<span></span></p>
                    </div>
                </div>
                <div className="sales-details">
                    <div className="sales-graph">
                        <h3 className="sales-title">Weekly Statistics</h3>
                        <img src={ LineChart } alt="Line Chart"/>
                    </div>
                    <div className="sales-statistics">
                        <p className="sales">Number of sales: <span></span></p>
                        <p className="products-shipped">Products shipped:<span></span></p>
                        <p className="order-awaiting">Orders awaiting shipping:<span></span></p>
                    </div>
                </div>
            </div>
            <div className="top-sales-section">
                <h3 className="top-sales-title">Top selling products</h3>
                <div className="top-sales">

                </div>
            </div>
        </div>
    )
}

export default MerchantOverview;