import React from 'react';
import './pagination.scss';

function Pagination() {
    return (
        <div className="pagination">
            <h5 className="previous-btn">prev</h5>
            <div className="pages">
                <h5 className="page-number">1</h5>
                <h5 className="page-number">2</h5>
                <h5 className="page-number">3</h5>
                <h5 className="page-number">4</h5>
                <h5 className="page-number">5</h5>
            </div>
            <h5 className="next-btn">next</h5>
        </div>
    )
}

export function AltPagination() {
    return (
        <div className="alt-pagination">
            <h5 className="previous-btn">prev</h5>
            <div className="pages">
                <h5 className="page-number">1</h5>
                <h5 className="page-number">2</h5>
                <h5 className="page-number">3</h5>
                <h5 className="page-number">4</h5>
                <h5 className="page-number">5</h5>
            </div>
            <h5 className="next-btn">next</h5>
        </div>
    )
}

export default Pagination;
