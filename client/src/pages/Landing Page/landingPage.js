import React, { useEffect, useRef } from 'react';
import { TweenMax, Power3 } from 'gsap';
import {Link} from 'react-router-dom';
import Navigation from '../../components/Navigation/navigation';
import Footer from '../../components/Footer/footer';
import './landingPage.css';

function LandingPage() {
    let hero = useRef(null);
    let heroBtn = useRef(null);

    useEffect(()=>{
        TweenMax.to(hero, 3,{opacity:1, x:+20, ease:Power3.easeOut});
        TweenMax.to(heroBtn,3,{opacity:1, y:-5 ,ease:Power3.easeOut,delay:.2});
    },[])



    return (
        <div className="landing-page">
            <header className="landing-header">
                <nav>
                    <Navigation/>
                </nav>
                <div className="hero">
                    <div className="hero-image">
                        <img src={"https://res.cloudinary.com/dkow6vfth/image/upload/v1609805142/jumga-images/mock%20images/BojAdpN4n1M_iegwqs.png"} alt="hero" />
                    </div>
                    <div className="hero-text">
                        <p className="hero-main-text" ref={ el=> hero=el }>
                            Jumga is an online store that allows merchants get their products to the customers across Nigeria, Ghana, Kenya and the UK in realtime. 
                        </p>
                        <Link to="/" className="shop-btn" ref={ el=> heroBtn=el }>Shop now</Link>
                    </div>
                </div>
            </header>
            <main>
                <section className="top-offers">
                    <p className="top-offers-title">Top offers for the week</p>
                    <div className="offers-tiles">
                        <div className="offer-tile tile-1">
                            <h6 className="offer-subtitle">Save up to</h6>
                            <h3 className="offer-title">20%</h3>
                        </div>
                        <div className="offer-tile tile-2">
                            <h3 className="offer-title">Get 2 for 1</h3>
                            <h6 className="offer-subtitle">limited stock</h6>
                        </div>
                        <div className="offer-tile tile-3">
                            <h3 className="offer-title">40% off</h3>
                            <h6 className="offer-subtitle">fresh veggies</h6>
                        </div>
                        <div className="offer-tile tile-4">
                            <h3 className="offer-title">50% off</h3>
                            <h6 className="offer-subtitle">washing machines</h6>
                        </div>
                        <div className="offer-tile tile-5">
                            <h3 className="offer-title">10% off</h3>
                            <h6 className="offer-subtitle">female footwears</h6>
                        </div>
                        <div className="offer-tile tile-6">
                            <h3 className="offer-title">Buy one, get one free</h3>
                        </div>
                    </div>
                </section>
                <section className="homepage-categories">
                    <h3 className="homepage-categories-title">Categories</h3>
                    <div className="categories-list">
                        <div className="category">
                            <div className="category-img">
                                <img src={"https://res.cloudinary.com/dkow6vfth/image/upload/v1609805149/jumga-images/mock%20images/2JrpkyZ2ruQ_qza1vc.png"} alt="Category"/>
                            </div>
                            <div className="category-details">
                                <h3 className="category-title">Home Appliances</h3>
                                <p className="category-description">
                                    Check out our wide range of electrical applicances from washing machines to . They are also affordable.
                                </p>
                                <Link to="/" className="btn shop-btn" >Shop Electronics</Link>
                            </div>
                        </div>
                        <div className="category">
                            <div className="category-img">
                                <img src={"https://res.cloudinary.com/dkow6vfth/image/upload/v1609805155/jumga-images/mock%20images/P3pI6xzovu0_h9fgrc.png"} alt="Category"/>
                            </div>
                            <div className="category-details">
                                <h3 className="category-title">Clothings</h3>
                                <p className="category-description">
                                    We have something for the kids, men and women. We also have different outfits for different occasions.</p>
                                <Link to="/" className="btn shop-btn">Shop Clothing</Link>
                            </div>
                        </div>
                        <div className="category">
                            <div className="category-img">
                                <img src={"https://res.cloudinary.com/dkow6vfth/image/upload/v1609805150/jumga-images/mock%20images/2JrpkyZ2ruQ-1_uf4l1s.png"} alt="Category"/>
                            </div>
                            <div className="category-details">
                                <h3 className="category-title">Phones and Accessories</h3>
                                <p className="category-description">
                                    Get your quality devices at affordable prices. You can also get their accessories too</p>
                                <Link to="/" className="btn shop-btn">Shop Phones</Link>
                            </div>
                        </div>
                    </div>
                    <h4 className="other-categories-text">Want to check out other products? <Link to="/" className="other-categories-link">Click here</Link></h4>
                </section>
            </main>
            <Footer/>
        </div>
    )
}

export default LandingPage;
