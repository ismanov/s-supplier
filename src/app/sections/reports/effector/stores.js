import { createStore } from 'effector';
import * as effects from './effects';
import * as events from './events';
import { PageableList } from "helpers/pagelist";

// ORDERS REPORT
export const $ordersReportList = createStore({ loading: false, data: new PageableList(), error: null })
  .on(effects.getOrdersReportListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getOrdersReportListEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: new PageableList(),
        error: response.error.response
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null
      };
    }
  });

export const $ordersReportFilterProps = createStore({})
  .on(events.updateOrdersReportFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props
    }
  })
  .reset(events.resetOrdersReportFilterPropsEvent);

export const $ordersReportListExcel = createStore({ loading: false, data: null, filename: null, error: null })
  .on(effects.getOrdersReportListExcelEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getOrdersReportListExcelEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: null,
        filename: null,
        error: response.error.response
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        filename: response.result.headers["content-disposition"],
        error: null
      };
    }
  })
  .reset(events.resetOrdersReportListExcelEvent);

export const $orderReportsStatusItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getOrderReportsStatusItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    }
  })
  .on(effects.getOrderReportsStatusItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      }
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null
      }
    }
  });

export const $orderReportSubStatusItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getOrderReportSubStatusItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    }
  })
  .on(effects.getOrderReportSubStatusItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      }
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null
      }
    }
  })
  .reset(events.resetOrderReportSubStatusItemsEvent);

// CLIENTS REPORT
export const $clientsReportList = createStore({ loading: false, data: new PageableList(), error: null })
  .on(effects.getClientsReportListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getClientsReportListEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: new PageableList(),
        error: response.error.response
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null
      };
    }
  });

export const $clientsReportFilterProps = createStore({})
  .on(events.updateClientsReportFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props
    }
  })
  .reset(events.resetClientsReportFilterPropsEvent);

export const $clientsReportListExcel = createStore({ loading: false, data: null, filename: null, error: null })
  .on(effects.getClientsReportListExcelEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getClientsReportListExcelEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: null,
        filename: null,
        error: response.error.response
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        filename: response.result.headers["content-disposition"],
        error: null
      };
    }
  })
  .reset(events.resetClientsReportListExcelEvent);

// BRANCHES REPORT
export const $branchesReportList = createStore({ loading: false, data: [], error: null })
  .on(effects.getBranchesReportListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getBranchesReportListEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: [],
        error: response.error.response
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null
      };
    }
  });

export const $branchesReportFilterProps = createStore({})
  .on(events.updateBranchesReportFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props
    }
  })
  .reset(events.resetBranchesReportFilterPropsEvent);

export const $branchesReportListExcel = createStore({ loading: false, data: null, filename: null, error: null })
  .on(effects.getBranchesReportListExcelEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getBranchesReportListExcelEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: null,
        filename: null,
        error: response.error.response
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        filename: response.result.headers["content-disposition"],
        error: null
      };
    }
  })
  .reset(events.resetBranchesReportListExcelEvent);