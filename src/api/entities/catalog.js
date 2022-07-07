import { httpDelete, httpGet, httpPost, httpPut } from "../init";

// CATALOG ALL
// Categories
export const getCatalogBranches = (params) =>
  httpGet({
    url: "/api/cabinet/v1/account/branches/lookup",
    params,
  });
export const getCatalogBranchesList = (params) =>
  httpGet({
    url: "/api/cabinet/v1/branches",
    params,
  });

export const getCategories = (params) =>
  httpGet({
    url: `/api/cabinet/v1/categories/tree/${params.branchId}`,
  });

export const addCategory = (data) =>
  httpPost({
    url: "/api/cabinet/v1/categories",
    data,
  });

export const updateCategory = (data) =>
  httpPut({
    url: "/api/cabinet/v1/categories" + (data.id ? `/${data.id}` : ""),
    data,
  });

export const deleteCategory = (data) =>
  httpDelete({
    url: `/api/cabinet/v1/account/categories/${data.id}/${data.branchId}`,
  });

// Products
export const getProductList = (params) =>
  httpGet({
    url: "/api/cabinet/v1/products",
    params,
  });

export const getProductInfo = (params) =>
  httpGet({
    url: `/api/cabinet/v1/products/${params.id}`,
  });

export const updateProductsBatch = (data) =>
  httpPut({
    url: "/api/cabinet/v1/account/branch/products/batch",
    data,
  });

export const addProduct = (data) =>
  httpPost({
    url: "/api/cabinet/v1/products",
    data,
  });

export const updateProduct = (data) =>
  httpPut({
    url: `/api/cabinet/v1/products/${data.id}`,
    data,
  });

export const deleteProduct = ({ productId }) =>
  httpDelete({
    url: `/api/cabinet/v1/products/${productId}`,
  });

export const downloadCategoriesExcel = ({ branchId, ...params }) =>
  httpGet({
    responseType: "blob",
    url: `/api/cabinet/v1/account/branch/products/template/${branchId}`,
    params,
  });

export const uploadProductListExcel = (data) =>
  httpPost({
    url: `/api/cabinet/v1/account/branch/products/import/${data.branchId}${
      data.categoryId ? `?categoryId=${data.categoryId}` : ""
    }`,
    data: data.file,
  });

export const getUnitItems = () =>
  httpGet({
    url: "/api/cabinet/v1/units/items",
  });

export const getCompanyCatalogItems = () =>
  httpGet({
    url: "/api/cabinet/v1/products/company/catalog",
  });

export const getProductTypeItems = () =>
  httpGet({
    url: "/api/cabinet/v1/products/types",
  });

export const getVatItems = () =>
  httpGet({
    url: "/api/cabinet/v1/companies/vats",
  });

// CATALOG-SINGLE
// Categories-single
export const getCategoriesSingle = () =>
  httpGet({
    url: "/api/cabinet/v1/single-catalog/categories",
  });

export const saveCategoriesSingleToBranch = (data) =>
  httpPost({
    url: "/api/cabinet/v1/categories/lookup",
    data,
  });

export const getCategoriesList = (params) =>
  httpGet({
    url: "/api/cabinet/v1/categories/lookup",
    params,
  });

export const syncCatalog = (params) =>
  httpGet({
    url: "/api/cabinet/v1/categories/lookup",
    params,
  });
