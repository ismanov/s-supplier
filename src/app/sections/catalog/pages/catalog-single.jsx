import React from "react";

import { CatalogSingleFilter } from "../organisms/catalog-single-filter";
import { CatalogSingleList } from "../organisms/catalog-single-list";

export const CatalogSingle = () => {
  return (
    <div className="catalog-single">
      <h1>Единый каталог</h1>
      <CatalogSingleFilter />
      <CatalogSingleList />
    </div>
  );
};
