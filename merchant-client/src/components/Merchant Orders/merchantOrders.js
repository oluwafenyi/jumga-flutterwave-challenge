import React,{ useEffect,useState, useRef } from 'react';

import { Power3 } from 'gsap';
import { gsap } from 'gsap';

import './merchantOrders.scss';

const MerchantOrders = () =>{
    let ordersPage = useRef(null);

    const [ tableData, setTableData ] = useState([
        {id:"1", product_name:"gloves", order_status:"processing", quantity:'10', delivery_mobile:'0802313679', delivery_location:"Ikeja,Lagos", date_initiated: "19/01/2021", transaction_status:"Completed"},
        {id:"2", product_name:"gloves", order_status:"processing", quantity:'10', delivery_mobile:'0802313679', delivery_location:"Ikeja,Lagos", date_initiated: "19/01/2021", transaction_status:"Completed"},
        {id:"3", product_name:"gloves", order_status:"processing", quantity:'10', delivery_mobile:'0802313679', delivery_location:"Ikeja,Lagos", date_initiated: "19/01/2021", transaction_status:"Completed"},
        {id:"4", product_name:"gloves", order_status:"processing", quantity:'10', delivery_mobile:'0802313679', delivery_location:"Ikeja,Lagos", date_initiated: "19/01/2021", transaction_status:"Completed"},
        {id:"5", product_name:"gloves", order_status:"processing", quantity:'10', delivery_mobile:'0802313679', delivery_location:"Ikeja,Lagos", date_initiated: "19/01/2021", transaction_status:"Completed"},
        {id:"6", product_name:"gloves", order_status:"processing", quantity:'10', delivery_mobile:'0802313679', delivery_location:"Ikeja,Lagos", date_initiated: "19/01/2021", transaction_status:"Completed"},
        {id:"7", product_name:"gloves", order_status:"processing", quantity:'10', delivery_mobile:'0802313679', delivery_location:"Ikeja,Lagos", date_initiated: "19/01/2021", transaction_status:"Completed"},
        {id:"8", product_name:"gloves", order_status:"processing", quantity:'10', delivery_mobile:'0802313679', delivery_location:"Ikeja,Lagos", date_initiated: "19/01/2021", transaction_status:"Completed"},
        {id:"9", product_name:"gloves", order_status:"processing", quantity:'10', delivery_mobile:'0802313679', delivery_location:"Ikeja,Lagos", date_initiated: "19/01/2021", transaction_status:"Completed"},
        {id:"10", product_name:"gloves", order_status:"processing", quantity:'10', delivery_mobile:'0802313679', delivery_location:"Ikeja,Lagos", date_initiated: "19/01/2021", transaction_status:"Completed"},
    ])

    const tableListings =()=>{
        tableData.map((product)=>{
            const { id,product_name,order_status,quantity,delivery_location,delivery_mobile,date_initiated,transaction_status }= product
            return(
                <tr key={ id }>
                    <td>{product_name}</td>
                    <td>{order_status}</td>
                    <td>{quantity}</td>
                    <td>{delivery_location}</td>
                    <td>{delivery_mobile}</td>
                    <td>{date_initiated}</td>
                    <td>{transaction_status}</td>
                </tr>
            )
        })
    }

    // GSAP
    useEffect(()=>{
        gsap.fromTo(ordersPage, {y:-50}, {opacity: 1, duration: 1, y:0, ease: Power3.easeOut,delay:0.4})
    },[])


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
                            <th>ID</th>
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
                        {tableData.map((product)=>{
                            const { id,product_name,order_status,quantity,delivery_location,delivery_mobile,date_initiated,transaction_status }= product
                            return(
                                <tr key={ id }>
                                    <td>{id}</td>
                                    <td>{product_name}</td>
                                    <td>{order_status}</td>
                                    <td>{quantity}</td>
                                    <td>{delivery_location}</td>
                                    <td>{delivery_mobile}</td>
                                    <td>{date_initiated}</td>
                                    <td>{transaction_status}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            

        </div>
    )
}

export default MerchantOrders;