import React, { useState, useEffect } from 'react';
import Dashboard from '../../components/Dashboard/dashboard';
import { useHistory } from  "react-router-dom";
import { AltFooter } from '../../components/Footer/footer';
import { ToastContainer } from 'react-toastify';
import MerchantOverview from '../../components/Merchant Overview/merchantOverview';
import MerchantUploadProduct from '../../components/Merchant UploadProduct/merchantUploadProduct';
import MerchantViewProducts from '../../components/Merchant ViewProducts/merchantViewProducts';
import MerchantDispatchService from '../../components/Merchant DispatchService/merchantDispatchService';
import Logo from '../../assets/test-logo.png';
import './merchantDashboard.scss';
import {jumgaState, notification} from "../../store/store";
import queryString from "query-string";
import { jumga } from "../../axios";


const MerchantDashboard = (props) =>{
    const [ dashboardOption, setDashboardOption ] = useState('overview');
    const [ store, setStore ] = useState({
        "business_name": "",
        "business_email": "",
    })
    const history = useHistory();

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

        if (!jumgaState.approved) {
            notification.setValues({ status: "info", message: "All actions are disabled until you process your approval", location: "here" })
            notification.display()
        }
    },[]);


    return(
        <div className="merchant-dashboard-page">
            <aside>
                <Dashboard dashboardOption={ dashboardOption } setDashboardOption={ setDashboardOption } approved={ jumgaState.approved } />
            </aside>
            <main className="merchant-dashboard-main">
                <ToastContainer/>
                <section className="merchant-summary">
                    <div className="store-logo">
                        <img src={Logo} alt="Store Logo"/>
                    </div>
                    <div className="store-summary">
                        <h3 className="store-name">{ store.business_name }</h3>
                        <h3 className="store-email">{ store.business_email }</h3>
                    </div>
                </section>
                <section className="dashboard-display">
                    { dashboardOption === 'overview' ? <MerchantOverview/> : null }
                    { dashboardOption === 'myProducts' ? <MerchantViewProducts/> : null }
                    { dashboardOption === 'upload' ? <MerchantUploadProduct/> : null}
                    { dashboardOption === 'dispatch' ? <MerchantDispatchService/> : null}
                </section>
                <AltFooter/>
            </main>

        </div>
    )
}

export default MerchantDashboard;