import React from 'react';
import './categoryItem.scss';

const CategoryItem = ({category})=> {
    return (
        <h4 className="category-item">
            { category }
        </h4>
    )
}

export default CategoryItem;
