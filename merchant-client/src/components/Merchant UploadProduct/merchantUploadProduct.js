import React, { useState, useEffect, useRef } from 'react';
import PlusSign from '../../assets/plus.svg';
import './merchantUploadProduct.scss';
import { ToastContainer } from 'react-toastify';
import {jumgaState, notification} from "../../store/store";
import {jumga} from "../../axios";
import LoadingScreen from '../Loading Screen/loadingScreen';

import { Power3 } from 'gsap';
import { gsap } from 'gsap';

const MerchantUploadProduct = () =>{
    const [ category, setCategory ] = useState("");
    const [ productImageLink, setProductImageLink ] = useState("");
    const [ form, updateForm ] = useState({
        title: "",
        price: 0,
        "delivery_fee": 0,
        description: "",
        stock: 0,
    });
    let uploadWidget = null;
    let UploadPage = useRef(null);
    const instance = useRef(null);
    const [ loader,setLoader ] = useState(false);

    const cloudinaryUpload = () => {
        uploadWidget = window.cloudinary.createUploadWidget({
            cloudName: 'dkow6vfth',
            upload_preset: 'jumgapreset',
            folder: 'jumga-images',
            cropping: true,
        }, (error, result) => { if (result.event === "success") {
            // console.log(result.info)
            setProductImageLink(result.info.secure_url);
            notification.setValues({status: "success", message: "Image upload successful", location:"here"})
            notification.display()
        }
        })
        if (uploadWidget === null) {
            return
        }
        uploadWidget.open();
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
        script.type = "text/javascript";
        script.async = true;
        instance.current.appendChild(script);
        // eslint-disable-next-line
    }, [])

    const handleFormChange = (e) => {
        updateForm(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            }
        });
    }

    const handleCategorySelection = (e) => {
        setCategory(e.target.value)
    }

    const createProduct = async (e) => {
        e.preventDefault();
        setLoader(true);
        if (!jumgaState.riderRegistered) {
            notification.setValues({ status: "info", message: "Product upload disabled until a rider is registered", location: "here" })
            setLoader(false);
            notification.display()
            return
        }
        if (productImageLink === "") {
            notification.setValues({ status: "failed", message: "Please upload product image", location: "here" });
            setLoader(false);
            notification.display()
            return
        }
        try {
            const response = await jumga.post("/v1/product", { ...form, category, "delivery_fee": Number(form.delivery_fee), stock: Number(form.stock), price: Number(form.price) })
            if (response.status === 201) {
                const id = response.data.data.id
                await jumga.put(`/v1/product/${id}/image`, { link: productImageLink })
                notification.setValues({ status: "success", message: "Product listing successful", location: "here" });
                setLoader(false);
                notification.display();
            }
        } catch (err) {
            setLoader(false);
            console.log(err)
        }
    }

    // GSAP
    useEffect(()=>{
        gsap.fromTo(UploadPage, {y:-50}, {opacity: 1, duration: 1, y:0, ease: Power3.easeOut,delay:0.7})
    },[])

    return(
        <div className="merchant-upload-product" ref={ el=> UploadPage=el  }>
            <div ref={instance}>

            </div>
            <ToastContainer/>
            <div className="merchant-upload-product-header">
                <h3 className="merchant-upload-product-title">Upload Product</h3>
                <p className="merchant-upload-product-subtitle">Add more products to your store</p>
            </div>
            <form className="upload-form">
                <div className='product-details'>
                    <input type="text" name="title" placeholder="Product Name" onChange={handleFormChange} className="merchant-form-input"/>
                    <input type="currency" step="0.01" name="price" placeholder="Product Price" onChange={handleFormChange} className="merchant-form-input"/>
                    <input type="currency" step="0.01" name="delivery_fee" placeholder="Product Delivery Fee" onChange={handleFormChange} className="merchant-form-input"/>
                    <textarea className="description" name="description" onChange={handleFormChange} placeholder="Give a brief description of the product"></textarea>
                    <select className="merchant-form-select" value={category} onChange={handleCategorySelection}>
                        <option className="merchant-form-select-item" value="" disabled>Select Category</option>
                        <option className="merchant-form-select-item" value="electronics">Electronics</option>
                        <option className="merchant-form-select-item" value="cosmetics">Cosmetics</option>
                        <option className="merchant-form-select-item" value="foodstuff">Food Stuff</option>
                        <option className="merchant-form-select-item" value="fashion">Fashion</option>
                        <option className="merchant-form-select-item" value="fitfam">Sports & Fitness</option>
                    </select>
                    <input type="number" name="stock" placeholder="Stock" onChange={handleFormChange} className="merchant-form-input"/>
                    <input type="submit" value="Upload Product" onClick={createProduct} className="merchant-form-submit"/>
                </div>
                <div className="product-img">
                    <label htmlFor="product-img" onClick={cloudinaryUpload}>
                        <img src={PlusSign} className="product" alt="Product"/>
                        <p>Add Product Image</p>
                    </label>   
                    <input type="file" accept="image/png,image/jpeg" multiple={false}/>
                </div>
                
            </form>
            <LoadingScreen loading_text={"Adding Product"} loadingStatus={ loader }/>
        </div>
    )
}

export default MerchantUploadProduct;