import React, { useState, useEffect } from 'react';
import SearchIcon from '../../assets/search.svg';
import './storesSearch.scss'
import {Link} from "react-router-dom";
import {jumga} from "../../axios";

const StoresSearch = () =>{
    const [ searchFilter, setSearchFilter ] = useState("");
    const [ allStores, setAllStores ] = useState([]);

    useEffect(() => {
        async function getAllStores() {
            const response = await jumga.get("/v1/store/all")
            if (response.status === 200) {
                setAllStores(response.data.data)
            }
        }

        (async function() {
           await getAllStores()
        })()

    }, [])

    const filteredStoreList = () => {
        return allStores.filter(store => store.name.toLowerCase().includes(searchFilter.toLowerCase())).map(store => {
            return (
                <Link to={`stores/${store.id}`}>
                    <p>{ store.name }</p>
                </Link>
            )
        })
    }

    return(
        <div className="stores-search">
            <img src={SearchIcon} alt="search icon"/>
            <input type="text" placeholder="Search" className="search-input" onInput={(e) => {setSearchFilter(e.target.value)}} />
            <div id="myDropdown" className="dropdown-content">
                { searchFilter !== "" ? filteredStoreList() : null }
            </div>
        </div>
    )
        
}

export default StoresSearch;