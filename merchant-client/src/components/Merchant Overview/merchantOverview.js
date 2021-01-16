import React, { useState, useEffect, useRef } from 'react';
// import LineChart from '../../assets/Line chart.svg';
import Graph from '../Graph/graph';
import MerchantProductCard from '../Merchant ProductCard/merchantProductCard';
import './merchantOverview.scss';
import {jumga} from "../../axios";

import { Power3 } from 'gsap';
import { gsap } from 'gsap';

const MerchantOverview = () =>{
    const [ dashboard, setDashboard ] = useState({
        "product_count": 0,
        "sales_count": 0,
        "average_rating": 0,
        "quantity_shipped": 0,
        "awaiting_shipping": 0,
        "average_price": 0,
        "sales_past_week": 0,
        "shipped_this_week": 0,
        "awaiting_shipping_this_week": 0,
        "top_products": []
    })

    let overviewPage = useRef(null);

    const getAveragePrice = () => {
        return dashboard.average_price.toFixed(2);
    }

    const topSelling = () => {
        if (dashboard.top_products.length > 0) {
            const cards = dashboard.top_products.slice(0,6).map(product => {
                return (
                    <MerchantProductCard key={ product.id } productId={product.id} stock={ product.stock } hasDeleteBtn={ false } title={ product.title } price={ product.price } imageLink={ product.display_image } />
                )
            })

            return (
                <div className="top-sales-section">
                    <h3 className="top-sales-title">Top selling products</h3>
                    <div className="top-sales">
                        { cards }
                    </div>
                </div>
            )
        }
    }

    useEffect(()=>{
        gsap.fromTo(overviewPage, {y:-50}, {opacity: 1, duration: 1, y:0, ease: Power3.easeOut,delay:0.7})
    },[])

    useEffect(() => {
        async function getDashboard() {
            try {
                const response = await jumga.get("/v1/merchant/dashboard")
                console.log(response);
                if (response.status === 200) {
                    setDashboard(response.data.data);
                }
            } catch (err) {
                console.log(err)
            }
        }

        (async function() {
            await getDashboard();
        })();

    },[])


    return(
        <div className="merchant-overview" ref={ el=> overviewPage=el }>
            <p className="merchant-overview-title">Overview</p>
            <div className="overview-details" >
                <div className="total-values">
                    <div className="total-ratings">
                        <p className="available-products">Total number of available products: <span>{ dashboard.product_count }</span></p>
                        <p className="ratings">Average product ratings: <span>{ dashboard.average_rating }</span></p>
                        <p className="buyers">Average product price: <span>${ getAveragePrice() }</span></p>
                    </div>
                    <div className="total-statistics">
                        <p className="sales">Total number of sales: <span>{ dashboard.sales_count }</span></p>
                        <p className="products-shipped">Total products shipped: <span>{ dashboard.quantity_shipped }</span></p>
                        <p className="order-awaiting">Orders awaiting shipping: <span>{ dashboard.awaiting_shipping }</span></p>
                    </div>
                </div>
                <div className="sales-details">
                    <h3 className="sales-title">Weekly Statistics</h3>
                    <div className="sales-statistics">
                        <div className="sales-graph-img">
                            <Graph/>
                            {/* <img src={ LineChart } alt="Line Chart"/> */}
                        </div>
                        <div className="sales-values">
                            <p className="sales">Number of sales: <span>{ dashboard.sales_past_week }</span></p>
                            <p className="products-shipped">Products shipped: <span>{ dashboard.shipped_this_week }</span></p>
                            <p className="order-awaiting">Orders awaiting shipping: <span>{ dashboard.awaiting_shipping_this_week }</span></p>
                        </div>
                        
                    </div>
                   
                </div>
            </div>
            { topSelling() }
        </div>
    )
}

export default MerchantOverview;