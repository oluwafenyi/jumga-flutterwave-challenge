import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation/navigation';
import ProductIcon from '../../components/ProductCard/productCard';
import Footer from '../../components/Footer/footer';
import PaymentModal from '../../components/Payment Modal/paymentModal';
import './productPreview.scss';


const ProductPreview = ()=>{
    const [paymentModal,setPaymentModal] = useState(false);
    return(
        <div className="product-preview">
            <nav>
                <Navigation/>
            </nav>
            <main>
                <section className="back-option">
                    <Link to="/products" className="back-option-btn">
                        <div className="arrow">
                            <svg width="31" height="16" viewBox="0 0 31 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.292406 7.29277C-0.0981179 7.6833 -0.0981179 8.31646 0.292406 8.70698L6.65637 15.0709C7.04689 15.4615 7.68006 15.4615 8.07058 15.0709C8.4611 14.6804 8.4611 14.0473 8.07058 13.6567L2.41373 7.99988L8.07058 2.34302C8.4611 1.9525 8.4611 1.31934 8.07058 0.928811C7.68006 0.538287 7.04689 0.538287 6.65637 0.928811L0.292406 7.29277ZM30.9995 6.99988L0.999513 6.99988V8.99988L30.9995 8.99988V6.99988Z" fill="black"/>
                            </svg>

                            {/* <img className="other-products-arrow" src={Arrow} alt="arrow" /> */}
                        </div> 
                       <p>Products</p>
                    </Link>
                </section>
                <section className="product-info">
                    <div className="product-details">
                        <div className="product-specifics">   
                            <h3 className="product-source">Uchemba Stores/<span>Fashion</span></h3>
                            <h1 className="product-name">Adidas Sneakers</h1>
                            <h2 className="product-price">$500</h2>
                        </div>
                        <div className="product-description">
                            <h4 className="description-title">Description</h4>
                            <p className="description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Euismod aliquet eget fermentum elementum fusce interdum nibh. 
                            Sed elit vel blandit urna ipsum convallis. Mi dui, eu dignissim nisi, cursus eu fringilla. Ornare in ut pellentesque ut.
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
                            <input type="text" className="form-input quantity-input" placeholder="Quantity" required/>
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
                        <img src={'https://res.cloudinary.com/dkow6vfth/image/upload/v1609805142/jumga-images/mock%20images/BojAdpN4n1M_iegwqs.png'} alt="Product Display"/>
                    </div>
                </section>
                <section className="other-products">
                    <h3 className="other-products-title">More from Uchemba Stores</h3>
                    <div className="products">
                        <ProductIcon/>
                        <ProductIcon/>
                        <ProductIcon/>
                    </div>
                </section>
            </main>
            <Footer/>
            { paymentModal ? 
                <PaymentModal 
                    setPaymentModal={setPaymentModal} 
                    paymentModal={ paymentModal } 
                /> 
                : null 
            }
        </div>
    )
}

export default ProductPreview;