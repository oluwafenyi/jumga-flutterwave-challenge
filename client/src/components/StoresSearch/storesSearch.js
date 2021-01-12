import React from 'react';
import SearchIcon from '../../assets/search.svg';
import './storesSearch.scss'

const StoresSearch = () =>{
    return(
        <div className="stores-search">
            <img src={SearchIcon} alt="search icon"/>
            <input type="text" placeholder="Search" className="search-input"/>
        </div>
    )
        
}

export default StoresSearch;