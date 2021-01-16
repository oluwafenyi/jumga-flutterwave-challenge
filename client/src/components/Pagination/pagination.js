import React from 'react';
import { Link } from "react-router-dom";
import './pagination.scss';

function Pagination(props) {
    const nextPage = () => {
        if (props.next) {
            return (
                <h5 className="next-btn">
                    <Link to={ `?category=${props.category}&page=${props.page + 1}` }>
                        next
                    </Link>
                </h5>
            )
        }
    }

    const prevPage = () => {
        if (props.prev) {
            return (
                <h5 className="previous-btn">
                    <Link to={ `?category=${props.category}&page=${props.page - 1}` }>
                        prev
                    </Link>
                </h5>
            )
        }
    }

    const pages = () => {
        console.log(props.numberOfPages)
        return Array.from(Array(props.numberOfPages).keys()).map(key => {
           return (
               <h5 className="page-number" key={ key + 1 }>
                   <Link to={ `?category=${props.category}&page=${ key + 1 }` }>
                       { key + 1 }
                   </Link>
               </h5>
           )
        });
    }

    return (
        <div className="pagination">
            { prevPage() }
            <div className="pages">
                { pages() }
            </div>
            { nextPage() }
        </div>
    )
}

export function AltPagination(props) {
    const nextPage = () => {
        if (props.next) {
            return (
                <h5 className="next-btn">next</h5>
            )
        }
    }

    const prevPage = () => {
        if (props.prev) {
            return (
                <h5 className="previous-btn">prev</h5>
            )
        }
    }

    const pages = () => {
        console.log(props.numberOfPages)
        return Array.from(Array(props.numberOfPages).keys()).map(key => {
           return (
               <h5 className="page-number" key={ key + 1 }>{ key + 1 }</h5>
           )
        });
    }

    return (
        <div className="alt-pagination">
            { prevPage() }
            <div className="pages">
                { pages() }
            </div>
            { nextPage() }
        </div>
    )

}

export default Pagination;
