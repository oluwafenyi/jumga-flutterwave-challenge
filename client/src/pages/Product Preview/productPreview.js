import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navigation from '../../components/Navigation/navigation';
import ProductIcon from '../../components/ProductCard/productCard';
import Footer from '../../components/Footer/footer';
import Arrow from '../../assets/LeftArrow.svg';
import PaymentModal from '../../components/Payment Modal/paymentModal';
import './productPreview.scss';
import {jumga} from "../../axios";

const ProductPreview = ()=>{
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
    }, [productId])

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
            <Footer/>
            { paymentModal ? 
                <PaymentModal 
                    setPaymentModal={setPaymentModal} 
                    productPrice = { productData.price }
                    quantity = { quantity }
                    deliveryFee = { productData.delivery_fee }
                    imageLink = { productData.display_image.link }
                /> 
                : null 
            }
        </div>
    )
}

export default ProductPreview;