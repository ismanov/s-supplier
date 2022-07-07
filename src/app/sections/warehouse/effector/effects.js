import { createEffect } from "effector";
import { api } from "api";

// WAREHOUSE STOCK
export const getWarehouseListEffect = createEffect({
  handler: api.warehouse.getWarehouseList,
});

export const getWarehouseStockListEffect = createEffect({
  handler: api.warehouse.getWarehouseStockList,
});

export const getReportGrandTotalEffect = createEffect({
  handler: api.warehouse.getReportGrandTotal,
});

export const getWarehouseStockItemsEffect = createEffect({
  handler: api.warehouse.getWarehouseStockItems,
});

export const getWarehouseListLookupEffect = createEffect({
  handler: api.warehouse.getWarehouseListLookup,
});

export const saveWarehouseStockItemEffect = createEffect({
  handler: api.warehouse.saveWarehouseStockItem,
});

export const getWarehouseStockItemEffect = createEffect({
  handler: api.warehouse.getWarehouseStockItem,
});

export const updateWarehouseItemEffect = createEffect({
  handler: api.warehouse.updateWarehouseItem,
});

export const deleteStockInItemEffect = createEffect({
  handler: api.warehouse.deleteStockInItem,
});

export const deleteStockOutItemEffect = createEffect({
  handler: api.warehouse.deleteStockOutItem,
});

// SHIPMENT
export const getWarehouseShipmentListEffect = createEffect({
  handler: api.warehouse.getWarehouseShipmentList,
});

export const saveWarehouseShipmentItemEffect = createEffect({
  handler: api.warehouse.saveWarehouseShipmentItem,
});

export const getWarehouseShipmentItemEffect = createEffect({
  handler: api.warehouse.getWarehouseShipmentItem,
});

// STOCK-REPORT
export const getWarehouseStockReportListEffect = createEffect({
  handler: api.warehouse.getWarehouseStockReportList,
});

// INVOICE

export const getInvoiceListEffect = createEffect({
  handler: api.invoices.getXFileInvoiceList,
});

export const getInvoiceItemEffect = createEffect({
  handler: api.invoices.getXFileInvoiceItem,
});

// address
export const getRegionItemsEffect = createEffect({
  handler: api.user.getRegionItems,
});

export const getDistrictItemsEffect = createEffect({
  handler: api.user.getDistrictItems,
});

export const getDistrictItemsForModalEffect = createEffect({
  handler: api.user.getDistrictItems,
});

// EMPLOYEE

export const getEmployeesListEffect = createEffect({
  handler: api.warehouse.getEmployeesList,
});

//BRANCHES

export const getBranchesListEffect = createEffect({
  handler: api.user.getBranchesList,
});

// CREATE AND UPDATE WAREHOUSE EFFECT
export const createAndUpdateWarehouseEffect = createEffect({
  handler: api.warehouse.createAndUpdateWarehouse,
});

// UPDATE STATUS WAREHOUSE EFFECT
export const changeWarehouseStatusEffect = createEffect({
  handler: api.warehouse.changeWarehouseStatus,
});

// SUPPLIERS

export const getSuppliersListEffect = createEffect({
  handler: api.warehouse.getSuppliersList,
});

export const getSuppliersItemsEffect = createEffect({
  handler: api.warehouse.getSuppliersItems,
});

export const createAndUpdateSupplierEffect = createEffect({
  handler: api.warehouse.createAndUpdateAndDeleteSupplier,
});

// CUSTOMER

export const getCustomerListEffect = createEffect({
  handler: api.warehouse.getCustomerList,
});

export const createAndUpdateCustomerEffect = createEffect({
  handler: api.warehouse.createAndUpdateAndDeleteCustomer,
});

// CUSTOMER AND SUPPLIER DETAIL
export const getCustomerAndSupplierDetailsEffect = createEffect({
  handler: api.warehouse.getCustomerAndSupplierDetails,
});

// GET INFO BY TIN
export const getInfoByTinEffect = createEffect({
  handler: api.warehouse.getInfoByTin,
});

// INVOICE  ====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const createInvoiceEffect = createEffect({
  handler: api.invoices.createInvoice,
});

// BANK INFO
export const getBankInfoByTinEffect = createEffect({
  handler: api.warehouse.getBankInfoByTin,
});
