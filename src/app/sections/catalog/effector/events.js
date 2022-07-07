import { createEvent } from "effector";

// CATALOG ALL
export const resetCatalogBranchesEvent = createEvent();

// Categories-all
export const resetCategoriesEvent = createEvent();
export const resetAddCategoryEvent = createEvent();
export const resetUpdateCategoryEvent = createEvent();
export const resetDeleteCategoryEvent = createEvent();
export const resetDownloadAllCategoriesExcelEvent = createEvent();
export const resetUploadProductListExcelEvent = createEvent();
export const updateCategoriesFilterPropsEvent = createEvent();
export const resetCategoriesFilterPropsEvent = createEvent();
export const updateCategoriesSearchEvent = createEvent();
export const resetCategoriesSearchEvent = createEvent();
export const resetCategoriesListEvent = createEvent();

// Products
export const resetProductListEvent = createEvent();
export const resetProductInfoEvent = createEvent();
export const updateProductListFilterPropsEvent = createEvent();
export const resetProductListFilterPropsEvent = createEvent();
export const resetUpdateProductsBatchEvent = createEvent();
export const resetAddProductEvent = createEvent();
export const resetUpdateProductEvent = createEvent();
export const resetUpdateDetailsProductEvent = createEvent();
export const resetDeleteProductEvent = createEvent();
export const addProductsBatchEvent = createEvent();
export const resetProductsBatchEvent = createEvent();

// CATALOG SINGLE
export const updateCategoriesSingleFilterPropsEvent = createEvent();
export const resetCategoriesSingleFilterPropsEvent = createEvent();
export const updateSelectedCategoriesSingleEvent = createEvent();
export const resetSelectedCategoriesSingleEvent = createEvent();
export const resetSaveCategoriesSingleToBranchEvent = createEvent();

// add  product modal items >>>>>>>>>>>>>>>>>>>>>

export const resetCompanyCatalogItemsEvent = createEvent();
export const resetProductTypeItemsEvent = createEvent();

// <<<<<<<<<<<<<<<<<<<

// SYNC CATALOG
export const resetSyncCatalogEvent = createEvent();
