import React from 'react';
import SearchIcon from '../../assets/search.svg';
import './storesSearch.scss'

const StoresSearch = ({ setSearchFilter }) =>{

    const updateSearchFilter = (e) => {
        setSearchFilter(e.target.value);
    }

    return(
        <div className="stores-search">
            <img src={SearchIcon} alt="search icon"/>
            <input type="text" placeholder="Filter" className="search-input" onInput={updateSearchFilter} />
        </div>
    )
        
}

export default StoresSearch;