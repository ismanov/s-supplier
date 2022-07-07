import { httpDelete, httpGet, httpPost, httpPut } from "../init";

export const getOrdersChart = (params) => httpGet({
  url: '/api/order/reports/by-statuses/chart',
  params
});

export const getOrdersCustomers = (params) => httpGet({
  url: '/api/cabinet/v1/account/customers/lookup',
  params
});

export const getOrdersTopProducts = (type) => httpGet({
  url: `/api/order/reports/top-products/${type}`,
});

export const getOrdersTopBranches = () => httpGet({
  url: '/api/order/reports/top-branches',
});