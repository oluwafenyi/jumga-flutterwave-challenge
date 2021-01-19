import React from 'react';
import SearchIcon from '../../assets/search.svg';
import './storesSearch.scss'

const StoresSearch = ({ setSearchFilter }) =>{

    return(
        <div className="stores-search">
            <img src={SearchIcon} alt="search icon"/>
            <input type="text" placeholder="Search" className="search-input" onInput={(e) => {setSearchFilter(e.target.value)}} />
        </div>
    )
        
}

export default StoresSearch;