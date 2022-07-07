import { createEffect } from "effector";
import { api } from "api";

// CATALOG ALL
export const getCatalogBranchesEffect = createEffect({
  handler: api.catalog.getCatalogBranchesList,
});

// Categories-all
export const getCategoriesEffect = createEffect({
  handler: api.catalog.getCategories,
});

export const addCategoryEffect = createEffect({
  handler: api.catalog.addCategory,
});

export const updateCategoryEffect = createEffect({
  handler: api.catalog.updateCategory,
});

export const deleteCategoryEffect = createEffect({
  handler: api.catalog.deleteCategory,
});

// Products
export const getProductListEffect = createEffect({
  handler: api.catalog.getProductList,
});

export const getProductInfoEffect = createEffect({
  handler: api.catalog.getProductInfo,
});

export const updateProductsBatchEffect = createEffect({
  handler: api.catalog.updateProductsBatch,
});

export const addProductEffect = createEffect({
  handler: api.catalog.addProduct,
});

export const updateProductEffect = createEffect({
  handler: api.catalog.updateProduct,
});

export const updateDetailsProductEffect = createEffect({
  handler: api.catalog.updateProduct,
});

export const deleteProductEffect = createEffect({
  handler: api.catalog.deleteProduct,
});

export const downloadAllCategoriesExcelEffect = createEffect({
  handler: api.catalog.downloadCategoriesExcel,
});

export const downloadCategoriesExcelEffect = createEffect({
  handler: api.catalog.downloadCategoriesExcel,
});

export const uploadProductListExcelEffect = createEffect({
  handler: api.catalog.uploadProductListExcel,
});

export const getUnitItemsEffect = createEffect({
  handler: api.catalog.getUnitItems,
});

export const getProductTypeItemsEffect = createEffect({
  handler: api.catalog.getProductTypeItems,
});

export const getCompanyCatalogItemsEffect = createEffect({
  handler: api.catalog.getCompanyCatalogItems,
});

export const getVatItemsEffect = createEffect({
  handler: api.catalog.getVatItems,
});

// CATALOG-SINGLE

// Categories-single
export const getCategoriesSingleEffect = createEffect({
  handler: api.catalog.getCategoriesSingle,
});

export const saveCategoriesSingleToBranchEffect = createEffect({
  handler: api.catalog.saveCategoriesSingleToBranch,
});

// CATEGORIES LIST
export const getCategoriesListEffect = createEffect({
  handler: api.catalog.getCategoriesList,
});

// SYNC CATALOG
export const syncCatalogEffect = createEffect({
  handler: api.catalog.syncCatalog,
});
