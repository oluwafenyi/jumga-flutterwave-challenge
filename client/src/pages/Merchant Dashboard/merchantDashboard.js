import React, { useState } from 'react';
import Dashboard from '../../components/Dashboard/dashboard';
import { AltFooter } from '../../components/Footer/footer';
import MerchantOverview from '../../components/Merchant Overview/merchantOverview';
import MerchantUploadProduct from '../../components/Merchant UploadProduct/merchantUploadProduct';
import MerchantViewProducts from '../../components/Merchant ViewProducts/merchantViewProducts';
import MerchantDispatchService from '../../components/Merchant DispatchService/merchantDispatchService';
import Logo from '../../assets/test-logo.png';
import './merchantDashboard.scss';


const MerchantDashboard = () =>{
    const [ dashboardOption, setDashboardOption ] = useState('overview');
    return(
        <div className="merchant-dashboard-page">
            <aside>
                <Dashboard dashboardOption={ dashboardOption } setDashboardOption={ setDashboardOption } />
            </aside>
            <main className="merchant-dashboard-main">
                <section className="merchant-summary">
                    <div className="store-logo">
                        <img src={Logo} alt="Store Logo"/>
                    </div>
                    <div className="store-summary">
                        <h3 className="store-name">Uncle Ignatius and sons online stores</h3>
                        <h3 className="store-email">Ignatius_sons@yahoo.com</h3>
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