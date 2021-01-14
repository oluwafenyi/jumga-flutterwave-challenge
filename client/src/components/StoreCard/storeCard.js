import React from 'react';
import { Link } from 'react-router-dom';
import CategoryItem from '../CategoryItem/categoryItem';
import './storeCard.css';

function StoreCard(props) {

    const getCountryIcon = () => {
        switch (props.country) {
            case "NG":
                return '🇳🇬';
            case "GH":
                return "🇬🇭";
            case "KE":
                return "🇰🇪";
            default:
                return "";
        }
    }

    const getLogo = () => {
        console.log(props.imageLink)

        if (props.imageLink) {
            return props.imageLink.link
        }
        return ""
    }

    const categoryItems = () => {
        return props.categories.map(category => {
            return (
                <CategoryItem category={category}/>
            )
        })
    }

    return (
        <Link to={"/stores/" + props.storeId } className="store-card">
            <div className="store-icon">
                <img src={getLogo()} alt="Store Icon"/>
            </div>
            <div className="store-details">
                <h3 className="store-name">{ props.businessName }</h3>
                <div className="store-owner">
                    <div className="location-icon">{ getCountryIcon() }</div>
                    <p className="store-owner-name">{ props.businessContact }</p>
                </div>
            </div>
            <div className="categories-available">
                {categoryItems()}
            </div>
        </Link>
    )
}

export default StoreCard
