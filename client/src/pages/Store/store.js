import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import queryString from "query-string";
import Navigation from '../../components/Navigation/navigation';
// import FilterIcon from '../../assets/Filter Icon.svg';
import ProductMenu from '../../components/ProductsMenu/productsMenu';
import ProductCard from '../../components/ProductCard/productCard';
import Phone from '../../assets/phone.svg';
import Email from '../../assets/email.svg';
import Footer from '../../components/Footer/footer';
import Pagination from '../../components/Pagination/pagination';
import Placeholders from 'loading-placeholders';
import './store.scss';
import {jumga} from "../../axios";
// import {notification} from "../../store/store";

const Store = (props) =>{
    const [ storeCategory, setStoreCategory ] = useState('all');
    // const [ storeFilter, setStoreFilter ] = useState(false);
    const [ storeData, setStoreData ] = useState({
        "business_name": "",
        "country": "",
        "logo": {
            "link": "",
        },
        "business_mobile": "",
        "business_email": "",
        "business_contact": "",
    });
    const [ prevPage, setPrevPage ] = useState(false);
    const [ nextPage, setNextPage ] = useState(false);
    const [ products, setProducts ] = useState([]);
    const [ numberOfPages, setNumberOfPages ] = useState(0);
    const [ page, setPage ] = useState(1);
    const [ loadingStatus, setLoadingStatus ] = useState('')
    const { storeId } = useParams();

    const getCountryIcon = () => {
        switch (storeData.country) {
            case "NG":
                return '🇳🇬';
            case "GH":
                return "🇬🇭";
            case "KE":
                return "🇰🇪";
            default:
                return "";
        }
    }

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await jumga.get(`/v1/store/${storeId}`);
                console.log(response.data);

                setStoreData(response.data.data);

                setTimeout(()=>{
                    setLoadingStatus(response.data.status);
                },2000)
            } catch (err) {
                console.log(err)
            }
        }

        (async function() {
            await getProduct();
        })();
    }, [storeId])

    useEffect(() => {
        const getProducts = async () => {
            const productsPP = 20;
            const params = queryString.parse(props.location.search);
            let pageNumber = Number(params.page);
            let categoryParam = params.category;

            if (isNaN(pageNumber) || pageNumber < 1) {
                pageNumber = 1;
            }

            setPage(pageNumber)

            if (!["all", "fitfam", "fashion", "cosmetics", "electronics", "foodstuff"].includes(categoryParam)) {
                categoryParam = "all"
            }

            setStoreCategory(categoryParam);

            if (pageNumber === 1) {
                setPrevPage(false);
            } else {
                setPrevPage(true);
            }

            let startAt = (productsPP * pageNumber) - productsPP;
            try {
                const response = await jumga.get(`/v1/store/${storeId}/products?startAt=${startAt}&limit=${productsPP}&category=${categoryParam}`);
                console.log(response.data);
                setProducts(response.data.data);
                if (response.data.next) {
                    setNextPage(true);
                } else {
                    setNextPage(false)
                }
                const pages = Math.ceil( response.data.total / productsPP);
                setNumberOfPages(pages);
            } catch (err) {
                console.log(err)
            }
        }

        (async function() {
            await getProducts();
        })();
    }, [ props.location.search, storeCategory,storeId])

    const productListing = () => {
        if(products.length > 0){
            return products.map(product => {
                return (
                    <ProductCard key={ product.id } productId={product.id} category={ product.category.name } name={ product.title } price={ product.price } imageLink={ product.display_image.link } />
                )
            })
        }else{
            return (
                <i className="empty-listing">Nothing to see here...yet</i>
            )
        }
        
    }

    return(
        <div className="store-page">
            <nav>
                <Navigation/>
            </nav>

            <div className="store-header">
                <div className="store-icon">
                    <img src={ storeData.logo.link } alt="Store Icon" />
                </div>
                <div className="merchant-details">
                    <h3 className="store-name">{ storeData.business_name }</h3>
                    <p className="store-owner">Owned by { storeData.business_contact }</p>
                    <div className="contact-details">
                        <a href={`tel: ${storeData.business_mobile}`} target="_blank" rel="noreferrer" className="contact-link"><img src={Phone} alt="Mobile Number"/></a>
                        <a href={`mailto: ${storeData.business_email}`} target="_blank" rel="noreferrer" className="contact-link"><img src={Email} alt="E-mail"/></a>
                    </div>
                    <div className="location-icon">{ getCountryIcon() }</div>
                </div>
            </div>
            
            <main>
                <section className="view-product-header">
                    {/*<div className="filter">*/}
                    {/*<div onClick={ ()=>setStoreFilter(!storeFilter) } className="filter-icon">*/}
                    {/*        <img src={FilterIcon} alt="filter"/>*/}
                    {/*    </div>*/}
                    {/*    <ul className={`filter-menu ${ storeFilter ? "open-filter-menu" : "" }`}>*/}
                    {/*        <li className="filter-menu-item">A-Z</li>*/}
                    {/*        <li className="filter-menu-item">Prices</li>*/}
                    {/*        <li className="filter-menu-item">Ratings</li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}
                    <ProductMenu category={ storeCategory } />
                </section>

                {
                    loadingStatus !== 'success'
                    ?
                        <Placeholders 
                            height="280px"
                            width="300.5px"
                            br="36px"
                            n="6"
                            margin="0.4rem"

                        />
                    :
                        <section className="products-gallery" >
                            {productListing()}
                        </section>
                         
                    }
                <Pagination prev={prevPage} next={nextPage} numberOfPages={numberOfPages} category={storeCategory} page={page} />
            </main>
            
            <Footer/>
        </div>
    )
}

export default Store;