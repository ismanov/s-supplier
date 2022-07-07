import { createEvent } from "effector";

// WAREHOUSE
export const updateStockFilterPropsEvent = createEvent();
export const resetStockFilterPropsEvent = createEvent();
export const resetReportGrandTotalEvent = createEvent();

export const resetDeleteStockInItemEvent = createEvent();
export const resetDeleteStockOutItemEvent = createEvent();

export const updateStockReportFilterPropsEvent = createEvent();
export const resetStockReportFilterPropsEvent = createEvent();
export const updateShipmentFilterPropsEvent = createEvent();
export const resetShipmentFilterPropsEvent = createEvent();
export const resetWarehouseStockItemEvent = createEvent();
export const resetShipmentItemEvent = createEvent();
export const resetDistrictItemsEvent = createEvent();
export const resetDistrictItemsForModalEvent = createEvent();
export const resetCreateAndUpdateWarehouseEvent = createEvent();
export const resetChangeWarehouseStatusEvent = createEvent();
export const resetCreateAndUpdateSupplierEvent = createEvent();
export const resetCreateAndUpdateCustomerEvent = createEvent();
export const resetInfoByTinEvent = createEvent();
export const resetBankInfoByTinEvent = createEvent();
export const resetCustomerAndSupplierDetailsEvent = createEvent();
export const resetCreateInvoiceEvent = createEvent();
