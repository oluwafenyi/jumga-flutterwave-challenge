import React, { useState, useEffect } from 'react';
import queryString from "query-string";
import Navigation from '../../components/Navigation/navigation';
import ProductMenu from '../../components/ProductsMenu/productsMenu';
import ProductCard from '../../components/ProductCard/productCard';
import Footer from '../../components/Footer/footer';
import './viewProducts.css';
import Pagination from '../../components/Pagination/pagination';

import {jumga} from "../../axios";

function ViewProducts(props) {
    const [ products, setProducts ] = useState([]);
    const [ nextPage, setNextPage ] = useState(false);
    const [ prevPage, setPrevPage ] = useState(false);
    // const [ filterMenu, showFilterMenu ] = useState(false);
    const [ category, setCategory ] = useState('all');
    const [ numberOfPages, setNumberOfPages ] = useState(0);
    const [ page, setPage ] = useState(1);

    useEffect(() => {
        const getProducts = async () => {
            const productsPP = 24;
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
            setCategory(categoryParam);

            if (pageNumber === 1) {
                setPrevPage(false);
            } else {
                setPrevPage(true);
            }

            let limit = productsPP * pageNumber;
            try {
                const response = await jumga.get(`/v1/product?startAt=${limit - productsPP}&limit=${limit}&category=${categoryParam}`);
                console.log(response.data);
                setProducts(response.data.data);
                if (response.data.next) {
                    setNextPage(true);
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
    }, [ props.location.search ])

    const productListing = () => {
        return products.map(product => {
            return (
                <ProductCard key={ product.id } productId={product.id} category={ product.category.name } name={ product.title } price={ product.price } imageLink={ product.display_image.link } />
            )
        })
    }

    return (
        <div className="view-products-page">
            <nav>
                <Navigation/>
            </nav>
            <main>
                <section className="view-product-header">
                    {/* <div className="filter">
                        <div onClick={ ()=>showFilterMenu(!filterMenu) } className="filter-icon">
                            <svg viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.99987 10H9.99987C10.2547 10.0003 10.4999 10.0979 10.6852 10.2728C10.8706 10.4478 10.9821 10.687 10.997 10.9414C11.012 11.1958 10.9292 11.4464 10.7656 11.6418C10.602 11.8373 10.37 11.9629 10.1169 11.993L9.99987 12H5.99987C5.74499 11.9997 5.49984 11.9021 5.3145 11.7272C5.12916 11.5522 5.01763 11.313 5.0027 11.0586C4.98776 10.8042 5.07054 10.5536 5.23413 10.3582C5.39772 10.1627 5.62977 10.0371 5.88287 10.007L5.99987 10H9.99987H5.99987ZM3.99987 5H11.9999C12.2547 5.00028 12.4999 5.09788 12.6852 5.27285C12.8706 5.44782 12.9821 5.68695 12.997 5.94139C13.012 6.19584 12.9292 6.44638 12.7656 6.64183C12.602 6.83729 12.37 6.9629 12.1169 6.993L11.9999 7H3.99987C3.74499 6.99972 3.49984 6.90212 3.3145 6.72715C3.12916 6.55218 3.01763 6.31305 3.0027 6.05861C2.98776 5.80416 3.07054 5.55362 3.23413 5.35817C3.39772 5.16271 3.62977 5.0371 3.88287 5.007L3.99987 5H11.9999H3.99987ZM0.999868 0H14.9999C15.2547 0.000282707 15.4999 0.0978789 15.6852 0.272848C15.8706 0.447817 15.9821 0.686953 15.997 0.941395C16.012 1.19584 15.9292 1.44638 15.7656 1.64183C15.602 1.83729 15.37 1.9629 15.1169 1.993L14.9999 2H0.999868C0.744989 1.99972 0.499836 1.90212 0.3145 1.72715C0.129164 1.55218 0.0176337 1.31305 0.0026966 1.05861C-0.0122405 0.804163 0.0705431 0.553621 0.234133 0.358168C0.397724 0.162715 0.629773 0.0371036 0.882868 0.00699997L0.999868 0H14.9999H0.999868Z" fill="black"/>
                            </svg>
                            <p>Filter</p>
                        </div>
                        <ul className={`filter-menu ${ filterMenu ? "open-filter-menu" : "" }`}>
                            <li className="filter-menu-item">A-Z</li>
                            <li className="filter-menu-item">Prices</li>
                            <li className="filter-menu-item">Ratings</li>
                        </ul>
                    </div> */}
                    <ProductMenu category={ category } />
                </section>
                <section className="products-gallery">
                    { productListing() }
                </section>
                <Pagination prev={prevPage} next={nextPage} numberOfPages={numberOfPages} category={category} page={page} />
            </main>
            <Footer/>
        </div>
    )
}

export default ViewProducts
