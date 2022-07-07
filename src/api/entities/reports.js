import { httpDelete, httpGet, httpPost, httpPut } from "../init";

// ORDERS REPORTS
export const getOrdersReportList = (params) => httpGet({
  url: '/api/order/reports/by-orders',
  params
});

export const getOrdersReportListExel = (params) => httpGet({
  responseType: "blob",
  url: '/api/order/reports/by-orders/export',
  params
});

// CLIENTS REPORTS
export const getClientsReportList = (params) => httpGet({
  url: '/api/order/reports/by-customers',
  params
});

export const getClientsReportListExcel = (params) => httpGet({
  responseType: "blob",
  url: '/api/order/reports/by-customers/export',
  params
});

// BRACNHES REPORTS
export const getBranchesReportList = (params) => httpGet({
  url: '/api/order/reports/by-branches',
  params
});

export const getBranchesReportListExcel = (params) => httpGet({
  responseType: "blob",
  url: '/api/order/reports/by-branches/export',
  params
});