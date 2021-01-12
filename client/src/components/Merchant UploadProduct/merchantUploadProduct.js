import React from 'react';
import PlusSign from '../../assets/plus.svg';
import './merchantUploadProduct.scss';

const MerchantUploadProduct = () =>{
    window.scrollTo(0,0);
    return(
        <div className="merchant-upload-product">
            <div className="merchant-upload-product-header">
                <h3 className="merchant-upload-product-title">Upload Product</h3>
                <p className="merchant-upload-product-subtitle">Add more products to your store</p>
            </div>
            <form className="upload-form">
                
                <div className='product-details'>
                    <input type="text" placeholder="Product Name" className="merchant-form-input"/>
                    <input type="text" placeholder="Product Price" className="merchant-form-input"/>
                    <textarea className="description" placeholder="Give a brief description of the product"></textarea>
                    <select className="merchant-form-select">
                        <option className="merchant-form-select-item">Select Category</option>
                        <option className="merchant-form-select-item">Electronics</option>
                        <option className="merchant-form-select-item">Cosmetics</option>
                        <option className="merchant-form-select-item">Food Stuff</option>
                        <option className="merchant-form-select-item">Fashion</option>
                        <option className="merchant-form-select-item">Sports and Fitness</option>
                    </select>
                    <input type="number" placeholder="Product Quantity" className="merchant-form-input"/>
                    <input type="submit" value="Upload Product" className="merchant-form-submit"/>
                </div>
                <div className="product-img">
                    <label htmlFor="product-img">
                        <img src={PlusSign} className="product" alt="Product"/>
                        <p>Add Product Image</p>
                    </label>   
                    <input type="file" id="product-img" accept="image/png,image/jpeg" multiple={false}/>
                </div>
                
            </form>

        </div>
    )
}

export default MerchantUploadProduct;