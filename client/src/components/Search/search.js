import React, { useState } from 'react';
import SearchIcon from '../../assets/search.svg';
import './search.css';
import {Link} from "react-router-dom";

function Search({ products }) {
    const [ searchFilter, setSearchFilter ] = useState("");

    const filteredProductList = () => {
        return products.filter(product => product.title.toLowerCase().includes(searchFilter.toLowerCase())).map(product => {
            return (
                <Link to={`products/${product.id}`}>
                    <p>{ product.title }</p>
                </Link>
            )
        })
    }


    return (
        <div className="search">
            <div className="desktop-search">
                <img src={SearchIcon} alt="search icon"/>
                <input type="text" placeholder="Search for a product" className="search-input" onInput={(e) => setSearchFilter(e.target.value)} />
                <div id="myDropdown" className="dropdown-content">
                    { searchFilter !== "" ? filteredProductList() : null }
                </div>
            </div>        
        </div>
    )
}


export default Search;
