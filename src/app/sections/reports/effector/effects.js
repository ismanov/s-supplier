import { createEffect } from "effector";
import { api } from "api";

// ORDERS
export const getOrdersReportListEffect = createEffect({
  handler: api.reports.getOrdersReportList
});

export const getOrdersReportListExcelEffect = createEffect({
  handler: api.reports.getOrdersReportListExel
});

export const getOrderReportsStatusItemsEffect = createEffect({
  handler: api.orders.getOrderStatusItems
});

export const getOrderReportSubStatusItemsEffect = createEffect({
  handler: api.orders.getOrderReportSubStatusItems
});

// CLIENTS REPORT
export const getClientsReportListEffect = createEffect({
  handler: api.reports.getClientsReportList
});

export const getClientsReportListExcelEffect = createEffect({
  handler: api.reports.getClientsReportListExcel
});

// BRANCHES REPORT
export const getBranchesReportListEffect = createEffect({
  handler: api.reports.getBranchesReportList
});

export const getBranchesReportListExcelEffect = createEffect({
  handler: api.reports.getBranchesReportListExcel
});