import { createEvent } from "effector";

// ORDERS REPORT
export const updateOrdersReportFilterPropsEvent = createEvent();
export const resetOrdersReportFilterPropsEvent = createEvent();
export const resetOrdersReportListExcelEvent = createEvent();
export const resetOrderReportSubStatusItemsEvent = createEvent();

// CLIENTS REPORT
export const updateClientsReportFilterPropsEvent = createEvent();
export const resetClientsReportFilterPropsEvent = createEvent();
export const resetClientsReportListExcelEvent = createEvent();

// BRANCHES REPORT
export const updateBranchesReportFilterPropsEvent = createEvent();
export const resetBranchesReportFilterPropsEvent = createEvent();
export const resetBranchesReportListExcelEvent = createEvent();