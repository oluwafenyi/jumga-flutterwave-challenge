import React,{ useState }from 'react';
import Navigation from '../../components/Navigation/navigation';
import ProductMenu from '../../components/ProductsMenu/productsMenu';
import ProductCard from '../../components/ProductCard/productCard';
import FilterIcon from '../../assets/Filter Icon.svg';
import Footer from '../../components/Footer/footer';
import './viewProducts.css';
import Pagination from '../../components/Pagination/pagination';

function ViewProducts() {
    const [ filterMenu, showFilterMenu ] = useState(false);
    const [ category, setCategory ] = useState('all');
    return (
        <div className="view-products-page">
            <nav>
                <Navigation/>
            </nav>
            <main>
                <section className="view-product-header">
                    <div className="filter">
                        <div onClick={ ()=>showFilterMenu(!filterMenu) } className="filter-icon">
                            <img src={FilterIcon} alt="filter"/>
                        </div>
                        <ul className={`filter-menu ${ filterMenu ? "open-filter-menu" : "" }`}>
                            <li className="filter-menu-item">A-Z</li>
                            <li className="filter-menu-item">Prices</li>
                            <li className="filter-menu-item">Ratings</li>
                        </ul>
                    </div>
                    <ProductMenu category={ category } setCategory={ setCategory } />
                </section>
                <section className="products-gallery">
                    <ProductCard/>
                    <ProductCard/>
                    <ProductCard/>
                </section>
                <Pagination/>
            </main>
            <Footer/>
        </div>
    )
}

export default ViewProducts
