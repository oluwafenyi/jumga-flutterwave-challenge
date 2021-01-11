import React from 'react';
import './pagination.scss';

function Pagination(props) {

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
        return Array(props.numberOfPages).map((it, index) => {
           return (
               <h5 className="page-number" key={index + 1}>{ index + 1 }</h5>
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

export default Pagination;
