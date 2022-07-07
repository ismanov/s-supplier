import { httpDelete, httpGet, httpPost, httpPut } from "../init";

const WAREHOUSE_URL = "/api/cabinet/v1/warehouses";
const WAREHOUSE_STOCK_IN_URL = "/api/cabinet/v1/stock-in";
const WAREHOUSE_STOCK_OUT_URL = "/api/cabinet/v1/stock-out";
const CUSTOMER_URL = "/api/cabinet/v1/customers";
const SUPPLIERS_URL = "/api/cabinet/v1/suppliers";

// WAREHOUSES -----------------------------------------------------

export const getWarehouseList = (params) =>
  httpGet({
    url: `${WAREHOUSE_URL}`,
    params,
  });

export const getWarehouseListLookup = (params) =>
  httpGet({
    url: `${WAREHOUSE_URL}/lookup`,
    params,
  });

export const deleteWarehouseItem = (params) =>
  httpDelete({
    url: `${WAREHOUSE_URL}/${params.id}`,
    params,
  });

export const updateWarehouseItem = (params) =>
  httpPut({
    url: `${WAREHOUSE_URL}/${params.id}`,
    params,
  });

export const createAndUpdateWarehouse = ({ data, method, id }) =>
  (method === "POST" ? httpPost : httpPut)({
    url: WAREHOUSE_URL + (id || ""),
    data,
  });

export const changeWarehouseStatus = (data) =>
  httpPut({
    url: `${WAREHOUSE_URL}/${data.id}/status?status=${data.status}`,
  });

// STOCK-IN -----------------------------------------------------
export const getWarehouseStockList = (params) =>
  httpGet({
    url: `${WAREHOUSE_STOCK_IN_URL}`,
    params,
  });

export const getWarehouseStockItems = (params) =>
  httpGet({
    url: `${WAREHOUSE_STOCK_IN_URL}/lookup`,
    params,
  });

export const saveWarehouseStockItem = (data) =>
  httpPost({
    url: `${WAREHOUSE_STOCK_IN_URL}`,
    data,
  });

export const getWarehouseStockItem = (id) =>
  httpGet({
    url: `${WAREHOUSE_STOCK_IN_URL}/${id}`,
  });

export const getWarehouseStockReportList = (params) =>
  httpGet({
    url: `${WAREHOUSE_STOCK_IN_URL}/report`,
    params,
  });

export const getReportGrandTotal = (params) =>
  httpGet({
    url: `${WAREHOUSE_STOCK_IN_URL}/report-grand-total`,
    params,
  });

export const deleteStockInItem = (id) =>
  httpDelete({
    url: `${WAREHOUSE_STOCK_IN_URL}/${id}`,
  });

// STOCK-OUT -----------------------------------------------------
export const getWarehouseShipmentList = (params) =>
  httpGet({
    url: `${WAREHOUSE_STOCK_OUT_URL}`,
    params,
  });

export const saveWarehouseShipmentItem = (data) =>
  httpPost({
    url: `${WAREHOUSE_STOCK_OUT_URL}`,
    data,
  });

export const getWarehouseShipmentItem = (id) =>
  httpGet({
    url: `${WAREHOUSE_STOCK_OUT_URL}/${id}`,
  });

export const deleteStockOutItem = (id) =>
  httpDelete({
    url: `${WAREHOUSE_STOCK_OUT_URL}/${id}`,
  });

// SUPPLIERS -----------------------------------------------------

export const getSuppliersList = (params) =>
  httpGet({
    url: `${SUPPLIERS_URL}`,
    params,
  });

export const getSuppliersItems = (params) =>
  httpGet({
    url: `${SUPPLIERS_URL}/lookup`,
    params,
  });

export const createAndUpdateAndDeleteSupplier = ({ data, method, id }) => {
  return (
    method === "POST" ? httpPost : method === "PUT" ? httpPut : httpDelete
  )({
    url: SUPPLIERS_URL + (id ? `/${id}` : ""),
    data,
  });
};

// CUSTOMER -----------------------------------------------------

export const getCustomerList = (params) =>
  httpGet({
    url: `${CUSTOMER_URL}`,
    params,
  });

export const createAndUpdateAndDeleteCustomer = ({ data, method, id }) =>
  (method === "POST" ? httpPost : method === "PUT" ? httpPut : httpDelete)({
    url: CUSTOMER_URL + (id ? `/${id}` : ""),
    data,
  });

// CUSTOMER AND SUPPLIER DETAIL

export const getCustomerAndSupplierDetails = (id, isSupplier) =>
  httpGet({
    url: `${isSupplier ? SUPPLIERS_URL : CUSTOMER_URL}/${id}`,
  });

//  GET INFO BY TIN
export const getInfoByTin = (tin, isSupplier) =>
  httpGet({
    url: `/api/cabinet/v1/${
      isSupplier ? "suppliers" : "customers"
    }/check/${tin}`,
  });

// GET EMPLOYEES LIST

export const getEmployeesList = (tin) =>
  httpGet({
    url: "/api/cabinet/v1/employees/lookup",
  });

// <<<<<<<<<<<<<<<<<<<<<<<<<<=========================================

// BANK INFO  >>>>>>>>>>>>>>>>>>>>> =====================

export const getBankInfoByTin = (tin) =>
  httpGet({
    url: `/api/cabinet/v1/banks/check/${tin}`,
  });
