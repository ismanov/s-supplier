import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PageableList } from "helpers/pagelist";
import React from "react";
import moment from "moment";
import {
  dataStoreCreator,
  infoStoreCreator,
} from "./../../../helpers/effectorStoreCreator";

// STOCK-IN-LIST
export const $warehouseList = dataStoreCreator(
  effects,
  "getWarehouseListEffect",
  new PageableList()
);

export const $stockList = createStore({
  loading: false,
  data: new PageableList(),
  error: null,
})
  .on(effects.getWarehouseStockListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getWarehouseStockListEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: new PageableList(),
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $stockItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getWarehouseStockItemsEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getWarehouseStockItemsEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $stockFilterProps = createStore({
  from: moment().subtract(30, "days"),
  to: moment(),
  search: "",
})
  .on(events.updateStockFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props,
    };
  })
  .reset(events.resetStockFilterPropsEvent);

export const $shipmentList = createStore({
  loading: false,
  data: new PageableList(),
  error: null,
})
  .on(effects.getWarehouseShipmentListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getWarehouseShipmentListEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: new PageableList(),
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $shipmentItem = createStore({
  loading: false,
  data: {},
  error: null,
})
  .on(effects.getWarehouseShipmentItemEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getWarehouseShipmentItemEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: {},
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetShipmentItemEvent);

export const $shipmentFilterProps = createStore({
  from: moment().subtract(30, "days"),
  to: moment(),
})
  .on(events.updateShipmentFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props,
    };
  })
  .reset(events.resetShipmentFilterPropsEvent);

export const $invoiceList = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getInvoiceListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getInvoiceListEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $wareHousesItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getWarehouseListLookupEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getWarehouseListLookupEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $suppliersItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getSuppliersItemsEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getSuppliersItemsEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $regionItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getRegionItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getRegionItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  });

// ADDRESS STORES
export const $districtItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getDistrictItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getDistrictItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetDistrictItemsEvent);

export const $districtItemsForModal = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getDistrictItemsForModalEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getDistrictItemsForModalEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetDistrictItemsForModalEvent);

// EMPLOYEE STORES

export const $employeesList = createStore({
  loading: false,
  data: new PageableList(),
  error: null,
})
  .on(effects.getEmployeesListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getEmployeesListEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: new PageableList(),
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  });

// BRANCHES

export const $branchesList = createStore({
  loading: false,
  data: new PageableList(),
  error: null,
})
  .on(effects.getBranchesListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getBranchesListEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: new PageableList(),
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  });

// CREATE AND UPDATE WAREHOUSE

export const $createAndUpdateWarehouse = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.createAndUpdateWarehouseEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.createAndUpdateWarehouseEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error?.response?.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetCreateAndUpdateWarehouseEvent);

// update status

export const $changeWarehouseStatus = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.changeWarehouseStatusEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.changeWarehouseStatusEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetChangeWarehouseStatusEvent);

export const $stockItem = createStore({ loading: false, data: {}, error: null })
  .on(effects.getWarehouseStockItemEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getWarehouseStockItemEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: {},
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetWarehouseStockItemEvent);

// STOCK-REPORT

export const $stockReportFilterProps = createStore({
  date: moment(),
  size: 20,
})
  .on(events.updateStockReportFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props,
    };
  })
  .reset(events.resetStockReportFilterPropsEvent);

export const $stockReportList = dataStoreCreator(
  effects,
  "getWarehouseStockReportListEffect",
  new PageableList()
);

export const $reportGrandTotal = dataStoreCreator(
  effects,
  "getReportGrandTotalEffect",
  []
).reset(events.resetReportGrandTotalEvent);

//  SUPPLIERS

export const $suppliersList = dataStoreCreator(
  effects,
  "getSuppliersListEffect",
  new PageableList()
);

export const $createAndUpdateSupplier = infoStoreCreator(
  effects,
  "createAndUpdateSupplierEffect"
).reset(events.resetCreateAndUpdateSupplierEvent);

//  CUSTOMER

export const $customerList = dataStoreCreator(
  effects,
  "getCustomerListEffect",
  new PageableList()
);

export const $createAndUpdateCustomer = infoStoreCreator(
  effects,
  "createAndUpdateCustomerEffect"
).reset(events.resetCreateAndUpdateCustomerEvent);

// GET CUSTOMER AND SUPPLIER BY  ID

export const $customerAndSupplierDetails = dataStoreCreator(
  effects,
  "getCustomerAndSupplierDetailsEffect"
).reset(events.resetCustomerAndSupplierDetailsEvent);

// GET INFO BY TIN

export const $infoByTin = dataStoreCreator(effects, "getInfoByTinEffect").reset(
  events.resetInfoByTinEvent
);

// INVOICE  ========================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const $createInvoice = dataStoreCreator(
  effects,
  "createInvoiceEffect"
).reset(events.resetCreateInvoiceEvent);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<======================================================================

// BANK INFO

export const $bankInfo = dataStoreCreator(
  effects,
  "getBankInfoByTinEffect"
).reset(events.resetBankInfoByTinEvent);

// STOCK  > DELETE  >>>>>>>>>>>>>>>>>>>>

export const $deleteStockInItem = infoStoreCreator(
  effects,
  "deleteStockInItemEffect"
).reset(events.resetDeleteStockInItemEvent);

export const $deleteStockOutItem = infoStoreCreator(
  effects,
  "deleteStockOutItemEffect"
).reset(events.resetDeleteStockOutItemEvent);

// <<<<<<<<<<<<<<<<<<
