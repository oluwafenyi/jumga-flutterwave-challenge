import React from 'react';
import { useHistory } from "react-router-dom";
import TestImg from '../../assets/test-img.png';
import './merchantProductCard.css';
import {jumga} from "../../axios";
import {clientLink} from "../../constants";

const MerchantProductCard = ({imageLink,title,price, stock, productId, hasDeleteBtn}) =>{
    const history = useHistory();

    if (hasDeleteBtn === undefined) {
        hasDeleteBtn = true;
    }
    const width = 500;

    const getImageLink = () => {
        if (imageLink) {
            return imageLink.link
        }
        return TestImg;
    }

    const getPrice = () => {
        if (!price) return;
        return price.toFixed(2)
    }

    const deleteProduct = async () => {
        try {
            const response = await jumga.delete(`/v1/product/${productId}`)
            console.log(response)
            if (response.status === 204) {
                history.go(0);
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className="merchant-product-card" style={{maxWidth:`${width}px`}}>
            <a href={ clientLink + `/products/${productId}` }>
                <div className="product-details">
                    <div className="product-img">
                        <img src={ getImageLink() } alt="Product"/>
                    </div>
                    <div className="name-price">
                        <h3 className="product-name">{ title }</h3>
                        <p className="product-price">${ getPrice() }</p>
                        <p className="product-quantity">Stock:<span>{ stock }</span></p>
                    </div>
                </div>
            </a>
            <div className={`delete-btn ${hasDeleteBtn === false ? 'hide-delete' : ''}`} onClick={deleteProduct} >
                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.9999 32.6618H8.63046C8.26482 32.6531 7.90447 32.5725 7.56999 32.4246C7.2355 32.2766 6.93345 32.0642 6.68108 31.7995C6.42872 31.5348 6.23098 31.223 6.09918 30.8818C5.96737 30.5406 5.90408 30.1768 5.91292 29.8112V11.026H7.8133V29.8112C7.80423 29.9273 7.8182 30.0441 7.85441 30.1548C7.89062 30.2655 7.94836 30.3679 8.0243 30.4562C8.10024 30.5445 8.19289 30.6169 8.29692 30.6693C8.40094 30.7217 8.5143 30.753 8.63046 30.7614H25.9999C26.1161 30.753 26.2294 30.7217 26.3334 30.6693C26.4375 30.6169 26.5301 30.5445 26.6061 30.4562C26.682 30.3679 26.7397 30.2655 26.776 30.1548C26.8122 30.0441 26.8261 29.9273 26.8171 29.8112V11.026H28.7174V29.8112C28.7263 30.1768 28.663 30.5406 28.5312 30.8818C28.3994 31.223 28.2016 31.5348 27.9493 31.7995C27.6969 32.0642 27.3949 32.2766 27.0604 32.4246C26.7259 32.5725 26.3655 32.6531 25.9999 32.6618Z" fill="black"/>
                    <path d="M29.4587 8.90709H4.96288C4.71088 8.90709 4.46919 8.80698 4.291 8.62879C4.1128 8.45059 4.0127 8.20891 4.0127 7.9569C4.0127 7.7049 4.1128 7.46321 4.291 7.28502C4.46919 7.10682 4.71088 7.00671 4.96288 7.00671H29.4587C29.7107 7.00671 29.9524 7.10682 30.1306 7.28502C30.3088 7.46321 30.4089 7.7049 30.4089 7.9569C30.4089 8.20891 30.3088 8.45059 30.1306 8.62879C29.9524 8.80698 29.7107 8.90709 29.4587 8.90709Z" fill="black"/>
                    <path d="M20.166 12.7078H22.0664V26.9607H20.166V12.7078Z" fill="black"/>
                    <path d="M12.5645 12.7078H14.4648V26.9607H12.5645V12.7078Z" fill="black"/>
                    <path d="M22.0663 5.92349H20.261V4.15614H14.3698V5.92349H12.5645V4.15614C12.5638 3.66817 12.751 3.19866 13.0871 2.84488C13.4231 2.4911 13.8824 2.28017 14.3698 2.25577H20.261C20.7483 2.28017 21.2076 2.4911 21.5437 2.84488C21.8798 3.19866 22.0669 3.66817 22.0663 4.15614V5.92349Z" fill="black"/>
                </svg>
            </div>
        </div>
    )
}

export default MerchantProductCard;