import React, { useState, useEffect } from 'react';
import queryString from "query-string";
import Navigation from '../../components/Navigation/navigation';
import ProductMenu from '../../components/ProductsMenu/productsMenu';
import ProductIcon from '../../components/ProductIcon/productIcon';
import FilterIcon from '../../assets/Filter Icon.svg';
import Footer from '../../components/Footer/footer';
import './viewProducts.css';

import {jumga} from "../../axios";

function ViewProducts(props) {
    const [ products, setProducts ] = useState([]);
    const [ nextPage, setNextPage ] = useState(false);
    const [ prevPage, setPrevPage ] = useState(false);

    useEffect(() => {
        const getProducts = async () => {
            const params = queryString.parse(props.location.search);
            let pageNumber = Number(params.page);

            if (isNaN(pageNumber) || pageNumber < 1) {
                pageNumber = 1;
            }

            if (pageNumber === 1) {
                setPrevPage(false);
            } else {
                setPrevPage(true);
            }

            let limit = 12 * pageNumber;
            try {
                const response = await jumga.get(`/v1/product?startAt=${limit - 12}&limit=${limit}`);
                console.log(response.data);
                setProducts(response.data.data);
                if (response.data.next) {
                    setNextPage(true);
                }
            } catch (err) {
                console.log(err)
            }
        }

        (async function() {
            await getProducts();
        })();
    }, [])

    const productListing = () => {
        return products.map(product => {
            return (
                <ProductIcon key={ product.id } category={ product.category.name } name={ product.title } price={ product.price } imageLink={ product.display_image.link } />
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
                    <div className="filter">
                        <div className="filter-icon">
                            <img src={FilterIcon} alt="filter"/>
                        </div>
                        <ul className="filter-menu">
                            <li className="filter-menu-item">A-Z</li>
                            <li className="filter-menu-item">Prices</li>
                            <li className="filter-menu-item">Ratings</li>
                        </ul>
                    </div>
                    <ProductMenu/>
                </section>
                <section className="products-gallery">
                    <ProductIcon category="Fashion" name="Adidas" price="500"/>
                    <ProductIcon category="Fashion" name="Adidas" price="500"/>
                    <ProductIcon category="Fashion" name="Adidas" price="500"/>
                    { productListing() }
                </section>
            </main>
            <Footer/>
        </div>
    )
}

export default ViewProducts
