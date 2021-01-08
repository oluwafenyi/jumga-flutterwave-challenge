import React from 'react';
import SearchIcon from '../../assets/search.svg';
import AltNavigation from '../../components/Navigation/navigation';
import './stores.css'

const Stores = () =>{
    return(
        <div className="stores-page">
            <header className="stores-header">
                <nav>
                    <AltNavigation/>
                </nav>
                <h2 className="stores-page-title">Stores</h2>
                <div className="stores-search">
                    <img src={SearchIcon} alt="search icon"/>
                    <input type="text" placeholder="Search for stores" className="search-input"/>
                </div>

            </header>
            
            <main>

            </main>
        </div>
    )
}

export default Stores;