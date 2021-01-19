import React, { useState } from 'react';
import SearchIcon from '../../assets/search.svg';
import './search.scss';
import {Link} from "react-router-dom";

function Search({ products }) {
    const [ searchFilter, setSearchFilter ] = useState("");

    const filteredProductList = () => {
        return products.filter(product => product.title.toLowerCase().includes(searchFilter.toLowerCase())).map(product => {
            return (
                <Link to={`products/${product.id}`} className="search-result" key={ product.id } >
                    <p>{ product.title }</p>
                </Link>
            )
        })
    }


    return (
        <div className="search">
            <div className={`desktop-search ${ searchFilter !== "" ? "search-mode": ""}`}>
                <img src={SearchIcon} alt="search icon"/>
                <input type="text" placeholder="Search for a product" className="search-input" onInput={(e) => setSearchFilter(e.target.value)} />
            </div>
            <div id="myDropdown" className="search-results">
                { searchFilter !== "" ? filteredProductList() : null }
            </div>        
        </div>
    )
}


export default Search;
