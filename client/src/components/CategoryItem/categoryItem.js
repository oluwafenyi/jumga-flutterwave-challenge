import React from 'react';
import './categoryItem.css';

const CategoryItem = ({category})=> {
    return (
        <h4 className="category-item">
            { category }
        </h4>
    )
}

export default CategoryItem;
