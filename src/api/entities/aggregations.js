import { httpPost, httpGet } from "../init";

// LIST
export const getAggregationsList = (params) => httpGet({
  url: '/api/cabinet/v1/aggregations',
  params
});

export const getAggregationStatusesItems = () => httpGet({
  url: '/api/cabinet/v1/aggregations/statuses',
});

// DETAILS
export const getAggregationDetails = (id) => httpGet({
  url: `/api/cabinet/v1/aggregations/${id}`
});

// ORDERS
export const getAggregationOrdersList = (params) => httpGet({
  url: '/api/cabinet/v1/aggregations/batch',
  params
});

export const createAggregationOrder = (data) => httpPost({
  url: '/api/cabinet/v1/aggregations/batch',
  data
});

// ORDER-PRINT
export const getAggregationOrderCodes = (id) => httpGet({
  url: `/api/cabinet/v1/aggregations/batch/${id}`
});

// CREATE-AGGREGATION
export const createAggregation = (data) => httpPost({
  url: '/api/cabinet/v1/aggregations',
  data
});

export const getPackageTypes = () => httpGet({
  url: "/api/cabinet/v1/aggregations/package-types"
});

export const getAggregationProductsItems = (params) => httpGet({
  url: "/api/cabinet/v1/products/lookup",
  params
});