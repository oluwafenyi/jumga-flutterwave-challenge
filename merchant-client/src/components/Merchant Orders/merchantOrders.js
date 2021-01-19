import React,{ useEffect,useState, useRef } from 'react';

import { Power3 } from 'gsap';
import { gsap } from 'gsap';

import './merchantOrders.scss';
import {jumga} from "../../axios";

const MerchantOrders = () =>{
    let ordersPage = useRef(null);

    const [ tableData, setTableData ] = useState([])

    const tableListings =()=>{
        return tableData.map((product)=>{
            const { transaction_id,order_id,product_title,order_status,quantity,delivery_location,delivery_mobile,date_initiated,transaction_status } = product
            const dateFmt = new Date(date_initiated).toLocaleDateString("en-GB", {hour: "numeric", minute: "numeric", second: "numeric"})
            return(
                <tr key={ transaction_id }>
                    <td>{ order_id }</td>
                    <td>{ transaction_id }</td>
                    <td>{product_title}</td>
                    <td>{order_status}</td>
                    <td>{quantity}</td>
                    <td>{delivery_mobile}</td>
                    <td>{delivery_location}</td>
                    <td>{dateFmt}</td>
                    <td>{transaction_status}</td>
                </tr>
            )
        })
    }

    // GSAP
    useEffect(()=>{
        gsap.fromTo(ordersPage, {y:-50}, {opacity: 1, duration: 1, y:0, ease: Power3.easeOut,delay:0.4})
    },[])

    useEffect(() => {
        async function getOrders() {
            const response = await jumga.get("/v1/merchant/orders");
            if (response.status === 200) {
                setTableData(response.data.data)
            }
        }

        (async function(){
            await getOrders()
        })();
    }, [])

    return(
        <div className="merchant-orders-page" ref={ el=>ordersPage=el }>
            <div className="merchant-orders-header">
                <h3 className="merchant-orders-title">Orders</h3>
                <p className="merchant-orders-subtitle">Keeps track of incoming and existing orders</p>
            </div>
            <div className="table-section">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Transaction ID</th>
                            <th>Product Name</th>
                            <th>Order status</th>
                            <th>Quantity</th>
                            <th>Delivery mobile</th>
                            <th>Delivery location</th>
                            <th>Date Initiated</th>
                            <th>Transaction status</th>
                        </tr>
                    </thead>
                    <tbody>
                        { tableListings() }
                    </tbody>
                </table>
            </div>
            

        </div>
    )
}

export default MerchantOrders;