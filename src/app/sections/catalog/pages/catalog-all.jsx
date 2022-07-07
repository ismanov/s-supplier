import React from "react";

import { CategoriesHead } from "../organisms/categories-head";
import { CategoriesFilter } from "../organisms/categories-filter";
import { Categories } from "../organisms/categories";
import { ProductsHead } from "../organisms/products-head";
import { ProductsFilter } from "../organisms/products-filter";
import { Products } from "../organisms/products";

export const CatalogAll = () => {
  return (
    <>
      <h1>Мой каталог</h1>
      <div className="catalog">
        <div className="catalog__col">
          <div className="catalog__col-left">
            <CategoriesHead />
            <CategoriesFilter />
            <Categories />
          </div>
        </div>
        <div className="catalog__col">
          <div className="catalog__col-right">
            <ProductsHead />
            <ProductsFilter />
            <Products />
          </div>
        </div>
      </div>
    </>
  )
};