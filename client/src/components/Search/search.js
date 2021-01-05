import React from 'react';
import SearchIcon from '../../assets/search.svg';
import './search.css';

function Search() {
    return (
        <div className="search">
            <div className="desktop-search">
                <img src={SearchIcon} alt="search icon"/>
                <input type="text" placeholder="Search for a product" className="search-input"/>
            </div>
            <div className="mobile-search-icon">
                <img src={SearchIcon} alt="search icon" />
            </div>
           

            <div className="mobile-search">
                <img src={SearchIcon} alt="search icon"/>
                <input type="text" placeholder="Search for a product" className="search-input"/>
            </div>
        </div>
    )
}


export default Search
