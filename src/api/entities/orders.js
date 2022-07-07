import { httpDelete, httpGet, httpPost, httpPut } from "../init";
const ORDERS_URL = "/api/cabinet/v1/orders"
// ORDERS
export const getOrdersList = (params) => httpGet({
  url: ORDERS_URL,
  params
});

export const saveOrderItem = (data) => httpPost({
  url: ORDERS_URL,
  data
});

export const getOrderItem = (params) => {
  debugger
  return httpGet({
    url: `${ORDERS_URL}/${params.id}`,
    warehouseId: params?.warehouseId
  })
};

export const getOrderItems = (params) => httpGet({
  url: `${ORDERS_URL}/lookup`,
  params
});

export const updateOrderItem = (data) => httpPut({
  url: `${ORDERS_URL}/${data.id}`,
  data
});

export const deleteOrderItem = (id) => httpDelete({
  url: `${ORDERS_URL}/${id}`
});

export const updateOrderStatus = (params) => httpPut({
  url: `${ORDERS_URL}/${params.id}/status`,
  params
});

export const getOrderStatusItems = () => httpGet({
  url: `${ORDERS_URL}/statuses`
});

export const getOrderReportSubStatusItems = (group) => httpGet({
  url: `${ORDERS_URL}/statuses-by-group/${group}`
});

export const getOrderSubStatusItems = (group) => httpGet({
  url: `${ORDERS_URL}/statuses-by-group/${group}`
});

// ORDERS-PAGE
export const confirmOrder = (data) => httpPut({
  url: `${ORDERS_URL}/status`,
  data
});

export const revisedOrder = (data) => httpPut({
  url: `${ORDERS_URL}`,
  data
});

export const rejectOrder = (data) => httpPut({
  url: `${ORDERS_URL}/status`,
  data
});

export const getOrderInfo = ({ id }) => httpGet({
  url: `${ORDERS_URL}/${id}`
});


// Contract
export const uploadContractFile = (data) => httpPost({
  url: `/api/contracts`,
  data,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const saveCurrentContract = (data) => httpPut({
  url: '/api/contracts/assign',
  data
});

export const getContractTypes = () => httpGet({
  url: '/api/contracts/types'
});

export const getCurrentContracts = (params) => httpGet({
  url: '/api/contracts/items',
  params
});

export const getContractDetails = (id) => httpGet({
  url: `/api/contracts/by-purchase-order/${id}`
});

// Invoice payment
export const getInvoicePaymentDetails = (id) => httpGet({
  url: `/api/invoice-payments/by-purchase-order/${id}`
});

// Power-of-attorney
export const getPowerOfAttorneyDetails = (id) => httpGet({
  url: `/api/power-of-attorneys/by-purchase-order/${id}`
});

export const confirmPowerOfAttorney = (data) => httpPut({
  url: '/api/power-of-attorneys/status',
  data
});

// Invoice
export const getInvoiceDetails = (id) => httpGet({
  url: `/api/invoices/by-purchase-order/${id}`
});

export const sendProductsToXfiles = (data) => httpPost({
  url: `/api/invoices/send-to-xfile`,
  data
});