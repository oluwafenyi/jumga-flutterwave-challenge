import React from 'react';
import Dashboard from '../../components/Dashboard/dashboard';
import './merchantDashboard.scss';

const MerchantDashboard = () =>{
    return(
        <div className="merchant-dashboard-page">
            <aside>
                <Dashboard/>
            </aside>
            <main className="merchant-dashboard-main">
                <section className="merchant-summary">
                    <div className="store-logo">
                        <img src={""} alt="Store Logo"/>
                    </div>
                    <div className="store-summary">
                        <h3 className="store-name">Uncle Ignatius and sons online stores</h3>
                        <button className="">Logout</button>
                    </div>
                </section>
                <section className="dashboard-display">

                </section>
            </main>

        </div>
    )
}

export default MerchantDashboard;