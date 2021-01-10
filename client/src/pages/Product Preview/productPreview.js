import React from 'react';
import Navigation from '../../components/Navigation/navigation';
import ProductIcon from '../../components/ProductCard/productCard';
import Footer from '../../components/Footer/footer'; 

const ProductPreview = ()=>{
    return(
        <div className="product-preview">
            <nav>
                <Navigation/>
            </nav>
            <main>
                <section className="back-option">
                    <div className="back-option-btn">
                        <img src={''} alt="back" />
                        <p>Back</p>
                    </div>
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
                            <input type="text" placeholder="Quantity" required/>
                        </div>
                        <div className="product-gallery">
                            <div className="product-other-image">
                                <img src={""} alt="more pictures"/>
                            </div>
                            <div className="product-other-image">
                                <img src={""} alt="more pictures"/>
                            </div>
                        </div>
                        <button className="purchase-btn">
                            Buy Now
                        </button>
                    </div>
                    <div className="display-picture">
                        <img src={''} alt="Product Display"/>
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
        </div>
    )
}

export default ProductPreview;