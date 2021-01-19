import React from 'react';
import { useHistory } from "react-router-dom";
import Verve from '../../assets/verve.svg';
import Visa from '../../assets/visa.svg';
import Mastercard from '../../assets/mastercard.svg';
import './paymentModal.scss';
import { jumga } from "../../axios";
import {jumgaState} from "../../store/store";

const PaymentModal = ({ setPaymentModal, quantity, productPrice, deliveryFee, imageLink, productId, productName }) =>{
    const history = useHistory();

    const getTotal = () => {
        return ((Number(productPrice) * Number(quantity)) + Number(deliveryFee)).toFixed(2);
    }

    const price = (val) => {
        if (val) {
            return val.toFixed(2)
        }
        return ""
    }

    const initiatePayment = async (e) => {
        e.preventDefault();
        if (!jumgaState.isAuthenticated()) {
            history.push("/login");
        }
        const response = await jumga.post("/v1/transaction/order", { product: Number(productId), quantity });
        if (response.status === 201) {
            window.open(response.data.payment_link, "_self");
        }
    }

    return(
        <div className="payment-modal-page">
            <div className="payment-modal">
                <div className="close-btn" onClick={ ()=>setPaymentModal(false) }>
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25.0003 45.8333C36.5063 45.8333 45.8337 36.5059 45.8337 25C45.8337 13.494 36.5063 4.16663 25.0003 4.16663C13.4944 4.16663 4.16699 13.494 4.16699 25C4.16699 36.5059 13.4944 45.8333 25.0003 45.8333Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M31.25 18.75L18.75 31.25" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.75 18.75L31.25 31.25" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {/* <img src={CloseBtn} alt="Close"/> */}
                </div>
                <div className="product-summary">
                    <div className="payment-summary">
                        <div className="payment-details">
                            <div className="product-amount">
                                <p className="product">{ productName } <span>x { quantity }</span>:</p>
                                <p className="amount">${ price(productPrice) }</p>
                            </div>
                            <div className="delivery-amount">
                                <p className="delivery">Delivery :</p>
                                <p className="amount">${ price(deliveryFee)}</p>
                            </div>
                            <div className="total-amount">
                                <p className="total">Total :</p>
                                <p className="amount">${ getTotal() }</p>
                            </div>
                        </div>
                        <button className="flutterwave-redirect" onClick={ initiatePayment } >Pay with Flutterwave</button>
                        <p className="charges-text"><span>*</span>Additional transaction fees may apply</p>
                    </div>
                    <div className="product-img">
                        <img src={ imageLink } alt="Product display"/>
                    </div>
                </div>
                <div className="acceptable-payments">
                    <img className="card-type" src={Mastercard} alt="Card Type"/>
                    <img className="card-type" src={Verve} alt="Card Type"/>
                    <img className="card-type" src={Visa} alt="Card Type"/>
                </div>
            </div>
            <div className="modal-mask" onClick={ ()=>setPaymentModal(false) }></div>
        </div>
    )
}

export default PaymentModal;