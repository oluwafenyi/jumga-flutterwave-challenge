import React, { useState, useEffect, useRef } from 'react';
import Dashboard from '../../components/Dashboard/dashboard';
import { useHistory } from  "react-router-dom";
import { AltFooter } from '../../components/Footer/footer';
import { ToastContainer } from 'react-toastify';
import MerchantOverview from '../../components/Merchant Overview/merchantOverview';
import MerchantUploadProduct from '../../components/Merchant UploadProduct/merchantUploadProduct';
import MerchantViewProducts from '../../components/Merchant ViewProducts/merchantViewProducts';
import MerchantDispatchService from '../../components/Merchant DispatchService/merchantDispatchService';
import MerchantOrders from '../../components/Merchant Orders/merchantOrders';
import Logo from '../../assets/test-logo.png';
import ApprovedIcon from '../../assets/verified.svg';
import './merchantDashboard.scss';
import {jumgaState, notification} from "../../store/store";
import queryString from "query-string";
import { jumga } from "../../axios";

import { Power3 } from 'gsap';
import { gsap } from 'gsap';


const MerchantDashboard = (props) =>{
    const [ dashboardOption, setDashboardOption ] = useState('overview');
    const [ store, setStore ] = useState({
        "business_name": "",
        "business_email": "",
        "logo": {
            "link": "",
        }
    })
    const history = useHistory();
    let MerchantSummary = useRef(null);

    // The Approved bool
    const approved = false;

    useEffect(() => {
        if (!jumgaState.isAuthenticated()) {
            history.replace("/login");
        }

        const params = queryString.parse(props.location.search);
        const tx_ref = params.tx_ref
        const transaction_id = params.transaction_id

        const getMerchant = async () => {
            try {
                const response = await jumga.get("/auth/merchant")
                console.log(response.data.data)
                setStore(response.data.data.store)
            } catch (err) {
                console.log(err)
            }
        }

        (async function() {
            await getMerchant();
        })();

        const verifyTransaction = async () => {
            try {
                const response = await jumga.post("/v1/transaction/verify", { "tx_ref": tx_ref, "transaction_id": transaction_id })
                console.log(response.data)
                if (response.status === 200) {
                    notification.setValues({status: "success", message: `Merchant Approved`, location: "dashboard"})
                    notification.display()
                    jumgaState.setApprovalStatus(true);
                    notification.setValues({ status: "info", message: "Product upload disabled until a rider is registered", location: "here" })
                    notification.display()
                }
            } catch (err) {
                console.log(err)
                notification.setValues({status: "failed", message: `Error confirming Merchant Approval \ntransaction ref:${tx_ref}`, location: "dashboard"})
                notification.display()
            }
        }

        if ( tx_ref && transaction_id && !jumgaState.approved ) {
            (async function() {
                await verifyTransaction();
            })();
            return
        }

        if (!jumgaState.approved && jumgaState.isAuthenticated()) {
            notification.setValues({ status: "info", message: "All actions are disabled until you process your approval", location: "here" })
            notification.display()
        }

        if (!jumgaState.riderRegistered && jumgaState.isAuthenticated()) {
            notification.setValues({ status: "info", message: "Product upload disabled until a rider is registered", location: "here" })
            notification.display()
        }
    },[history,props.location.search]);

    // GSAP
    useEffect(()=>{
        gsap.fromTo(MerchantSummary, {x:-20, opacity:0}, {opacity: 1, duration: 1, x:0, ease: Power3.easeOut,delay:2})
    },[])

    const getLogo = () => {
        if (store.logo.link) {
            return store.logo.link;
        }
        return Logo
    }

    return(
        <div className="merchant-dashboard-page">
            <aside>
                <Dashboard dashboardOption={ dashboardOption } setDashboardOption={ setDashboardOption } approved={ jumgaState.approved } />
            </aside>
            <main className="merchant-dashboard-main">
                <ToastContainer/>
                <section className="merchant-summary" ref={ el=>MerchantSummary=el }>
                    <div className="store-logo">
                        <img src={ getLogo() } alt="Store Logo"/>
                    </div>
                    <div className="store-summary">
                        <div className="approved-name">
                            <h3 className="store-name">{ store.business_name }</h3>
                            {
                                approved ? <img src={ ApprovedIcon } alt="approved"/> : null
                            }
                        </div>
                        
                        <h3 className="store-email">{ store.business_email }</h3>
                    </div>
                </section>
                <section className="dashboard-display">
                    { dashboardOption === 'overview' ? <MerchantOverview/> : null }
                    { dashboardOption === 'myProducts' ? <MerchantViewProducts/> : null }
                    { dashboardOption === 'upload' ? <MerchantUploadProduct/> : null}
                    { dashboardOption === 'dispatch' ? <MerchantDispatchService/> : null}
                    { dashboardOption === 'orders' ? <MerchantOrders/> : null}
                </section>
                <AltFooter/>
            </main>

        </div>
    )
}

export default MerchantDashboard;