import { httpGet, httpPost, httpPut, httpDelete } from "api/init";

const X_FILE_INVOICE_URL = "/api/cabinet/v1/xfile";
const INVOICE_URL = "/api/cabinet/v1/invoices";
const COMPANY_VAT_URL = "/api/cabinet/v1/companies/vat";

// X_FILE_INVOICE =====================================>>>>>>>>>>>>>>>>>>>>>>>>

export const getXFileInvoicesList = (params) =>
  httpGet({
    url: `${X_FILE_INVOICE_URL}/invoices`,
    params,
  });

export const getXFileInvoiceById = (id) =>
  httpGet({
    url: `${X_FILE_INVOICE_URL}/invoices/${id}`,
  });

export const getXFileStatusList = () =>
  httpGet({
    url: `${X_FILE_INVOICE_URL}/invoices/statuses`,
  });

export const getXFileInvoiceList = (tin) =>
  httpGet({
    url: `${X_FILE_INVOICE_URL}/tin/${tin}`,
  });

export const getXFileInvoiceItem = (id) =>
  httpGet({
    url: `${X_FILE_INVOICE_URL}/invoices/${id}`,
  });

// INVOICE =====================================>>>>>>>>>>>>>>>>>>>>>>>>

export const createInvoice = (data) =>
  httpPost({
    url: `${INVOICE_URL}`,
    data,
  });

export const getOutGoingInvoices = (params) =>
  httpGet({
    url: `${INVOICE_URL}`,
    params,
  });

export const getOutgoingInvoiceById = (id) =>
  httpGet({
    url: `${INVOICE_URL}/${id}`,
  });

export const getOutgoingInvoiceByIdForToSend = (id) =>
  httpGet({
    url: `${INVOICE_URL}/factura/${id}`,
  });

export const sendAndCancelInvoice = ({ data, status }) => {
  return httpPost({
    url: `${INVOICE_URL}/${status === "DRAFT" ? "send" : "cancel"}`,
    data,
  });
};

export const cancelDraftInvoice = (data) => {
  return httpPost({
    url: `${INVOICE_URL}/cancel-draft`,
    data,
  });
};

export const updateInvoice = (data) => {
  return httpPut({
    url: `${INVOICE_URL}/${data.id}`,
    data,
  });
};

export const syncInvoices = (id) => {
  return httpGet({
    url: `${INVOICE_URL}/sync`,
  });
};

export const deleteInvoice = (id) => {
  return httpDelete({
    url: `${INVOICE_URL}/${id}`,
  });
};

// API for  "НДС статус" and "Коэфф. разрыва при уплате НДС"

export const getVATStatus = (tin) =>
  httpGet({
    url: `${COMPANY_VAT_URL}/${tin}`,
  });

export const getCoefficientGapInVATPayment = (tin) =>
  httpGet({
    url: `${COMPANY_VAT_URL}/gap/${tin}`,
  });
