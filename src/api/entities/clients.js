import { httpDelete, httpGet, httpPost, httpPut } from "../init";
const CLIENTS_LIST_URL = '/api/cabinet/v1/customers';
// CLIENTS-LIST
export const getClientsList = (params) => httpGet({
  url: CLIENTS_LIST_URL,
  params
});

export const getClientsItems = (params) => httpGet({
  url: `${CLIENTS_LIST_URL}/lookup`,
  params
});

export const getClientItem = (id) => httpGet({
  url: `${CLIENTS_LIST_URL}/${id}`
});

// CLIENT-PAGE
export const getCurrentClient = (id) => httpGet({
  url: `${CLIENTS_LIST_URL}/${id}`
});

export const getClientOrders = (params) => httpGet({
  url: `/api/purchase/orders`,
  params
});

export const getClientOrderSubStatusItems = (group) => httpGet({
  url: `/api/purchase/orders/statuses-by-group/${group}`
});