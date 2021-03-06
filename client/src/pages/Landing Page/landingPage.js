import React, { useEffect, useRef ,useState } from 'react';
import { gsap } from 'gsap';
import { TweenMax,Power3 } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {Link, useHistory} from 'react-router-dom';
import Navigation from '../../components/Navigation/navigation';
import Footer from '../../components/Footer/footer';
import './landingPage.scss';
import TopOffersPopup from '../../components/Top Offers/topOffersPopup';


function LandingPage() {
    const [ popup, setPopup ] = useState(false);

    let hero = useRef(null);
    let heroBtn = useRef(null);
    let heroTitle = useRef(null);
    let landingPage = useRef(null);
    let history = useHistory();

    gsap.registerPlugin(ScrollTrigger);


    useEffect(()=>{
        gsap.fromTo(heroTitle, { y:+20 },{opacity:1,duration:.7,y:0, ease:Power3.easeOut});
        gsap.fromTo(hero, { x:+20 },{opacity:1, x:0,duration:.7, ease:Power3.easeOut,delay:.7});
        gsap.fromTo(heroBtn,{ y:-5 },{opacity:1, y:0,duration:.7 ,ease:Power3.easeOut,delay:1.4});
    },[])


    useEffect(()=>{
        const categories = landingPage.querySelectorAll('.category');
        categories.forEach(categoryAmin)
    },[])

    const categoryAmin = (category)=>{
        const categoryImg = category.querySelector('.category-img');
        const categoryDetails = category.querySelector('.category-details');

        gsap.timeline({
            scrollTrigger: {
                trigger: category,
                start: "center bottom",
                ease: "power2",
                toggleActions: "play none none none"
            }
        })
        .from(categoryImg, {
            x: -200,
            opacity: 0,
            duration: 0.5
          })
          .from(categoryDetails, {
            x: 200,
            opacity: 0,
            duration: 0.5,
            stagger: 0.2
        }, "-=0.5"); 
    }

    const toProductPage  = () =>{
        TweenMax.to(
            landingPage.querySelector('.landing-page-content'),
            .5,
            {
                opacity:0, x:-20, ease:Power3.easeOut
            }
        )
        setTimeout(()=>{
            history.push('/products')
        },700)
        
    }


    return (
        <div className="landing-page" ref={ el => landingPage = el }>
            <div className="landing-page-content">
                <header className="landing-header">
                    <nav>
                        <Navigation />
                    </nav>
                    <div className="hero" >
                        <div className="hero-text">
                            <h2 className="hero-title" ref={ el=> heroTitle=el  }>Shop easy with Jumga</h2>
                            <p className="hero-main-text" ref={ el=> hero=el }>
                                Jumga is an online store that allows merchants get their products to the customers across Nigeria, Ghana, Kenya and the UK in realtime. 
                            </p>
                            <button className="shop-btn" onClick={ toProductPage } ref={ el=> heroBtn=el }>Shop now</button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img src={"https://res.cloudinary.com/dkow6vfth/image/upload/v1609805142/jumga-images/mock%20images/BojAdpN4n1M_iegwqs.png"} alt="hero" />
                    </div>
                </header>
                <main >
                    <section className="top-offers">
                        <p className="top-offers-title">Top offers for the week</p>
                        <div className="offers-tiles">
                            <div onClick={ ()=> setPopup(true) } className="offer-tile tile-1">
                                <h6 className="offer-subtitle">Save up to</h6>
                                <h3 className="offer-title">20%</h3>
                            </div>
                            <div onClick={ ()=> setPopup(true) } className="offer-tile tile-2">
                                <h3 className="offer-title">Get 2 for 1</h3>
                                <h6 className="offer-subtitle">limited stock</h6>
                            </div>
                            <div onClick={ ()=> setPopup(true) } className="offer-tile tile-3">
                                <h3 className="offer-title">40% off</h3>
                                <h6 className="offer-subtitle">fresh veggies</h6>
                            </div>
                            <div onClick={ ()=> setPopup(true) } className="offer-tile tile-4">
                                <h3 className="offer-title">50% off</h3>
                                <h6 className="offer-subtitle">washing machines</h6>
                            </div>
                            <div onClick={ ()=> setPopup(true) } className="offer-tile tile-5">
                                <h3 className="offer-title">10% off</h3>
                                <h6 className="offer-subtitle">female footwears</h6>
                            </div>
                            <div onClick={ ()=> setPopup(true) } className="offer-tile tile-6">
                                <h6 className="offer-subtitle">Get 10 with</h6>
                                <h3 className="offer-title">2% off each</h3>
                            </div>
                            <div onClick={ ()=> setPopup(true) } className="offer-tile tile-7">
                                <h3 className="offer-subtitle">Buy one,</h3>
                                <h3 className="offer-title">get one free</h3>
                            </div>
                        </div>
                    </section>
                    <section className="homepage-categories">
                        <h3 className="homepage-categories-title">Categories</h3>
                        <div className="categories-list">
                            <div className="category" >
                                <div className="category-img">
                                    <img src={"https://res.cloudinary.com/dkow6vfth/image/upload/v1610856974/jumga-images/mock%20images/compressed/gzeTjGu3b_k_iysav7.png"} alt="Category"/>
                                </div>
                                <div className="category-details">
                                    <h3 className="category-title">Fitness Equipment</h3>
                                    <p className="category-description">
                                        Check out our wide range of fitness equipments which can help you stay in shape even during this pandemic.
                                    </p>
                                    <Link to="/products?category=fitfam" className="btn shop-btn" >Shop Fitness</Link>
                                </div>
                            </div>
                            <div className="category">
                                <div className="category-img">
                                    <img src={"https://res.cloudinary.com/dkow6vfth/image/upload/v1610856986/jumga-images/mock%20images/compressed/P3pI6xzovu0_cjd7vg.png"} alt="Category"/>
                                </div>
                                <div className="category-details">
                                    <h3 className="category-title">Fashion</h3>
                                    <p className="category-description">
                                        We have something for the kids, men and women. We also have different outfits for different occasions.</p>
                                    <Link to="/products?category=fashion" className="btn shop-btn">Shop Fashion</Link>
                                </div>
                            </div>
                            <div className="category">
                                <div className="category-img">
                                    <img src={"https://res.cloudinary.com/dkow6vfth/image/upload/v1610989562/jumga-images/mock%20images/compressed/2JrpkyZ2ruQ_jumyot.png"} alt="Category"/>
                                </div>
                                <div className="category-details">
                                    <h3 className="category-title">Phones and Accessories</h3>
                                    <p className="category-description">
                                        Get your quality devices at affordable prices. You can also get their accessories too</p>
                                    <Link to="/products?category=electronics" className="btn shop-btn">Shop Phones</Link>
                                </div>
                            </div>
                        </div>
                        <button onClick={ toProductPage } className="products-homepage-link">
                            <p>Check out other products</p>
                            <div className="arrow">
                                <svg viewBox="0 0 31 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30.7071 8.70711C31.0976 8.31658 31.0976 7.68342 30.7071 7.29289L24.3431 0.928932C23.9526 0.538408 23.3195 0.538408 22.9289 0.928932C22.5384 1.31946 22.5384 1.95262 22.9289 2.34315L28.5858 8L22.9289 13.6569C22.5384 14.0474 22.5384 14.6805 22.9289 15.0711C23.3195 15.4616 23.9526 15.4616 24.3431 15.0711L30.7071 8.70711ZM0 9H30V7H0V9Z" fill="black"/>
                                </svg>
                            </div> 
                        </button>
                    </section>
                </main>
            </div>
            <TopOffersPopup setPopupStatus={ setPopup } popupStatus={ popup }  />
            <Footer/>
        </div>
    )
}

export default LandingPage;
