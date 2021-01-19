import React from 'react';
import { Link } from "react-router-dom";
import './pagination.scss';

function Pagination(props) {
    const getCategoryParam = () => {
        if (props.category) {
            return `category=${props.category}&`
        }
        return ""
    }

    const nextPage = () => {
        if (props.next) {
            return (
                <Link to={ `?${getCategoryParam()}page=${props.page + 1}` }>
                    <h5 className="next-btn">
                        next
                    </h5>
                </Link>
            )
        }
    }

    const prevPage = () => {
        if (props.prev) {
            return (
                <Link to={ `?${getCategoryParam()}page=${props.page - 1}` }>
                    <h5 className="previous-btn">
                        prev
                    </h5>
                </Link>
            )
        }
    }

    const pages = () => {
        console.log(props.numberOfPages)
        return Array.from(Array(props.numberOfPages).keys()).map(key => {
           return (
               <Link to={ `?${getCategoryParam()}page=${ key + 1 }` } key={ key } >
                   <h5 className="page-number" key={ key + 1 }>
                       { key + 1 }
                   </h5>
               </Link>
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
