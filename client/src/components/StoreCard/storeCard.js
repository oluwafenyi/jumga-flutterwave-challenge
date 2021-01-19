import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Elastic } from 'gsap';
import { Link } from 'react-router-dom';
import CategoryItem from '../CategoryItem/categoryItem';
import './storeCard.scss';

function StoreCard(props) {
    let storeCard = useRef(null);

    useEffect(()=>{
        gsap.fromTo(storeCard, {scale:0.8}, {opacity: 1, duration: 0.3, scale:1, ease: Elastic.easeOut,delay:0.1})
    },[storeCard])

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
        return props.categories.map((category,index) => {
            return (
                <CategoryItem key={ index } category={category}/>
            )
        })
    }

    return (
        <Link to={"/stores/" + props.storeId } ref={ el=>storeCard=el } className="store-card">
            <div className="store-icon">
                <img src={getLogo()} alt="Store Icon"/>
            </div>
            <div className="store-info">
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
            </div>
            
        </Link>
    )
}

export default StoreCard
