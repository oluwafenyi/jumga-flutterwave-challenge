import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation/navigation';
import ProductIcon from '../../components/ProductCard/productCard';
import Footer from '../../components/Footer/footer';
import Arrow from '../../assets/LeftArrow.svg';
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
                            <img className="other-products-arrow" src={Arrow} alt="arrow" />
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