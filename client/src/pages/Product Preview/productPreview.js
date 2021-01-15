import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { jumga } from "../../axios";
import { notification } from "../../store/store";
import queryString from "query-string";

import { TweenMax, Power3 } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {useHistory} from 'react-router-dom';

import Navigation from '../../components/Navigation/navigation';
import ProductIcon from '../../components/ProductCard/productCard';
import Footer from '../../components/Footer/footer';
import PaymentModal from '../../components/Payment Modal/paymentModal';
import './productPreview.scss';


const ProductPreview = (props) =>{
    let previewPage = useRef(null);
    const history = useHistory();
    const [ paymentModal, setPaymentModal ] = useState(false);
    const [ quantity, setQuantity ] = useState(1);
    const [ productData, setProductData ] = useState({
        "title": "",
        "price": "",
        "delivery_fee": "",
        "description": "",
        "store": {
            "business_name": ""
        },
        "category": {
            "name": ""
        },
        "display_image": {
            "link": ""
        }
    });
    const { productId } = useParams();

    useEffect(() => {
        const params = queryString.parse(props.location.search);
        const tx_ref = params.tx_ref
        const transaction_id = params.transaction_id

        const verifyTransaction = async () => {
            try {
                const response = await jumga.post("/v1/transaction/verify", { "tx_ref": tx_ref, "transaction_id": transaction_id })
                console.log(response.data)
                if (response.status === 200) {
                    notification.setValues({status: "success", message: `Order #${response.data.orderID} confirmed`, location: "productPreview"})
                    notification.display()
                }
            } catch (err) {
                console.log(err)
                notification.setValues({status: "failed", message: `Error confirming order for transaction ref:${tx_ref}`, location: "productPreview"})
                notification.display()
            }
        }

        if ( tx_ref && transaction_id ) {
            (async function() {
                await verifyTransaction();
            })();
        }


        const getProduct = async () => {
            try {
                const response = await jumga.get(`/v1/product/${productId}`);
                console.log(response.data);
                setProductData(response.data.data);
            } catch (err) {
                console.log(err)
            }
        }

        (async function() {
            await getProduct();
        })();
    }, [productId,props.location.search])

    const toProductPage  = () =>{
        TweenMax.to(
            previewPage.querySelector('.product-preview-content'),
            .5,
            {
                opacity:0, x:10, ease:Power3.easeOut
            }
        )
        setTimeout(()=>{
            history.push('/products')
        },700)
        
    }

    return(
        <div className="product-preview" ref={ el=>previewPage=el }>
            <nav>
                <Navigation/>
            </nav>
            <div className="product-preview-content">
                <main>
                    <ToastContainer/>
                    <section className="back-option">
                        <button onClick={ toProductPage } className="back-option-btn">
                            <div className="arrow">
                                <svg width="31" height="16" viewBox="0 0 31 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.292406 7.29277C-0.0981179 7.6833 -0.0981179 8.31646 0.292406 8.70698L6.65637 15.0709C7.04689 15.4615 7.68006 15.4615 8.07058 15.0709C8.4611 14.6804 8.4611 14.0473 8.07058 13.6567L2.41373 7.99988L8.07058 2.34302C8.4611 1.9525 8.4611 1.31934 8.07058 0.928811C7.68006 0.538287 7.04689 0.538287 6.65637 0.928811L0.292406 7.29277ZM30.9995 6.99988L0.999513 6.99988V8.99988L30.9995 8.99988V6.99988Z" fill="black"/>
                                </svg>

                                {/* <img className="other-products-arrow" src={Arrow} alt="arrow" /> */}
                            </div> 
                        <p>Products</p>
                        </button>
                    </section>
                    <section className="product-info">
                        <div className="product-details">
                            <div className="product-specifics">   
                                <h3 className="product-source">{ productData.store.business_name }/<span>{ productData.category.name }</span></h3>
                                <h1 className="product-name">{ productData.title }</h1>
                                <h2 className="product-price">{ `$${productData.price}` }</h2>
                            </div>
                            <div className="product-description">
                                <h4 className="description-title">Description</h4>
                                <p className="description">
                                    { productData.description }
                                </p>
                            </div>
                            <div className="product-size-quantity">
                                <select className="form-input-select product-size">
                                    <option>Size</option>
                                    <option>S</option>
                                    <option>M</option>
                                    <option>L</option>
                                    <option>XL</option>
                                    <option>XXL</option>
                                </select>
                                <input type="number" className="form-input quantity-input" placeholder="Quantity" onChange={ (e) => { setQuantity(Number(e.target.value)) } } required/>
                            </div>
                            <div className="product-gallery">
                                {/* <div className="product-other-image">
                                    <img src={""} alt="more pictures"/>
                                </div>
                                <div className="product-other-image">
                                    <img src={""} alt="more pictures"/>
                                </div> */}
                            </div>
                            <button className="purchase-btn" onClick={()=>setPaymentModal(true)}>
                                Buy Now
                            </button>
                        </div>
                        <div className="display-picture">
                            <img src={ productData.display_image.link } alt="Product Display"/>
                        </div>
                    </section>
                    <section className="other-products">
                        <h3 className="other-products-title">More from { productData.store.business_name }</h3>
                        <div className="products">
                            <ProductIcon/>
                            <ProductIcon/>
                            <ProductIcon/>
                        </div>
                    </section>
                </main>
            </div>
            
            <Footer/>
            { paymentModal ? 
                <PaymentModal 
                    setPaymentModal={setPaymentModal} 
                    productPrice = { productData.price }
                    quantity = { quantity }
                    deliveryFee = { productData.delivery_fee }
                    imageLink = { productData.display_image.link }
                    productId = { productId }
                /> 
                : null 
            }
        </div>
    )
}

export default ProductPreview;