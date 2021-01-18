import React, { useRef, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import OverviewIcon from '../../assets/dashboard-icons/overview.svg';
import DispatchIcon from '../../assets/dashboard-icons/dispatch.svg';
import AddProductIcon from '../../assets/dashboard-icons/add-product.svg';
import ProductsIcon from '../../assets/dashboard-icons/your_products.svg'; 
import Logo from '../../assets/logos/Footer Logo.svg';
import './dashboard.css';

import { jumga } from "../../axios";
import {jumgaState} from "../../store/store";

import { Power3 } from 'gsap';
import { gsap } from 'gsap';

const Dashboard = ({dashboardOption,setDashboardOption, approved}) =>{
    const history = useHistory();
    let Dashboard = useRef(null);

    const ApprovalButtonView = observer(({ state }) => {
        if (!state.approved) {
            return  (
                <button className="logout-btn" onClick={ processApproval } style={{"background-color": "green", color: "white"}}>Process Approval</button>
            )
        }
        return <></>
    })

    const processApproval = async () => {
        try {
            const response = await jumga.post("/v1/merchant/process-approval")
            window.open(response.data.payment_link, "_self")
        } catch (err) {
            console.log(err)
        }
    }

    const logout = async () => {
        jumgaState.clearAccessToken();
        history.replace("/login");
    }

    // GSAP
    useEffect(() => {
        gsap.fromTo(Dashboard, {opacity: 0, x:-20}, {opacity: 1, duration: 1, x:0, ease: Power3.easeOut})
    }, []);

    return(
        <div className="dashboard" ref={ el=> Dashboard=el }>
            <div className="dashboard-logo">
                <img src={ Logo } alt="Logo" />
                <p>Merchant</p>
            </div>
            <ul className="dashboard-menu">
                <li onClick={ ()=>setDashboardOption('overview') } className="dashboard-menu-item"><img src={ OverviewIcon } alt="Overview" /><span>Overview</span></li>
                <li onClick={ ()=>setDashboardOption('myProducts') } className="dashboard-menu-item"><img src={ ProductsIcon } alt="Your products" /><span>Your Products</span></li>
                <li onClick={ ()=>setDashboardOption('upload') } className="dashboard-menu-item"><img src={ AddProductIcon } alt="Add products" /><span>Add Product</span></li>
                <li onClick={ ()=>setDashboardOption('dispatch') } className="dashboard-menu-item"><img src={ DispatchIcon } alt="Dispatch" /><span>Dispatch Service</span></li>
            </ul>
            <ApprovalButtonView state={ jumgaState } />
            <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
    )
}

export default Dashboard;