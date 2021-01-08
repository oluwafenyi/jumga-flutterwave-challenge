import React from 'react';
import './paymentModal.css';

const PaymentModal = () =>{
    return(
        <div className="payment-modal-page">
            <div className="payment-modal">
                <div className="close-btn">
                    <img src={""} alt="Close"/>
                </div>
                <div className="product-summary">
                    <div className="payment-summary">
                        <div className="payment-details">
                            <div className="product-amount">
                                <p className="product">Adidas Sneakers <span>x 1</span>:</p>
                                <p className="amount">$500</p>
                            </div>
                            <div className="delivery-amount">
                                <p className="delivery">Delivery :</p>
                                <p className="amount">$10</p>
                            </div>
                            <div className="total-amount">
                                <p className="total">Total :</p>
                                <p className="amount">$500</p>
                            </div>
                        </div>
                        <button className="flutterwave-redirect">Pay with Flutterwave</button>
                        <p className="charges-text"><span>*</span>Additional transaction fees may apply</p>
                    </div>
                    <div className="product-img">
                        <img src={''} alt="Product display"/>
                    </div>
                </div>
                <div className="acceptable-payments">
                    <img className="card-type" src={''} alt="Card Type"/>
                    <img className="card-type" src={''} alt="Card Type"/>
                    <img className="card-type" src={''} alt="Card Type"/>
                </div>
            </div>
            <div className="modal-mask"></div>
        </div>
    )
}

export default PaymentModal;