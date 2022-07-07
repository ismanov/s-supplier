import { createStore } from 'effector';
import * as effects from './effects';
import * as events from './events';
import { PageableList } from "helpers/pagelist";

export const $ordersList = createStore({ loading: false, data: new PageableList(), error: null })
  .on(effects.getOrdersListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getOrdersListEffect.finally, (prevState, response) => {
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

export const $ordersFilterProps = createStore({})
  .on(events.updateOrdersFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props
    }
  })
  .reset(events.resetOrdersFilterPropsEvent);

export const $orderStatusItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getOrderStatusItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    }
  })
  .on(effects.getOrderStatusItemsEffect.finally, (prevStore, response) => {
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

export const $orderItem = createStore({ loading: false, data: {}, error: null })
  .on(effects.getOrderItemEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    }
  })
  .on(effects.getOrderItemEffect.finally, (prevStore, response) => {
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
  }).reset(events.resetOrderItemEffect);

export const $orderItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getOrderItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    }
  })
  .on(effects.getOrderItemsEffect.finally, (prevStore, response) => {
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

export const $orderSubStatusItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getOrderSubStatusItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    }
  })
  .on(effects.getOrderSubStatusItemsEffect.finally, (prevStore, response) => {
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
  .reset(events.resetOrderSubStatusItemsEvent);

export const $confirmOrder = createStore({ loading: false, success: false, error: null })
  .on(effects.confirmOrderEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.confirmOrderEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetConfirmOrderEvent);

export const $revisedOrder = createStore({ loading: false, success: false, error: null })
  .on(effects.revisedOrderEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.revisedOrderEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetRevisedOrderEvent);

export const $rejectOrder = createStore({ loading: false, success: false, error: null })
  .on(effects.rejectOrderEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.rejectOrderEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetRejectOrderEvent);

// ORDERS PAGE
export const $orderInfo = createStore({ loading: false, data: {}, error: null })
  .on(effects.getOrderInfoEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.getOrderInfoEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: {},
        error: response.error.response
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetOrderInfoEvent);

// Contract
export const $uploadContractFile = createStore({ loading: false, success: false, error: null })
  .on(effects.uploadContractFileEffect, (prevStore, params) => {
    return {
      ...prevStore,
      loading: true,
    };
  })
  .on(effects.uploadContractFileEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        loading: false,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        loading: false,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetUploadContractFileEvent)
  .reset(events.resetOrderInfoEvent);

export const $saveCurrentContract = createStore({ loading: false, success: false, error: null })
  .on(effects.saveCurrentContractEffect, (prevStore, params) => {
    return {
      ...prevStore,
      loading: true,
    };
  })
  .on(effects.saveCurrentContractEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        loading: false,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        loading: false,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetSaveCurrentContractEvent)
  .reset(events.resetOrderInfoEvent);

export const $contractTypes = createStore({ loading: false, data: [], error: null })
  .on(effects.getContractTypesEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.getContractTypesEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetOrderInfoEvent);

export const $currentContracts = createStore({ loading: false, data: [], error: null })
  .on(effects.getCurrentContractsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.getCurrentContractsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetOrderInfoEvent);

export const $contractDetails = createStore({ loading: false, data: {}, error: null })
  .on(effects.getContractDetailsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.getContractDetailsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: {},
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetContractDetailsEvent)
  .reset(events.resetOrderInfoEvent);

// Invoice payment
export const $invoicePaymentDetails = createStore({ loading: false, data: {}, error: null })
  .on(effects.getInvoicePaymentDetailsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.getInvoicePaymentDetailsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: {},
        error: response.error.response
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetOrderInfoEvent);

// Power-of-attorney
export const $powerOfAttorneyDetails = createStore({ loading: false, data: {}, error: null })
  .on(effects.getPowerOfAttorneyDetailsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.getPowerOfAttorneyDetailsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: {},
        error: response.error.response
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetOrderInfoEvent);

export const $confirmPowerOfAttorney = createStore({ loading: false, success: false, error: null })
  .on(effects.confirmPowerOfAttorneyEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.confirmPowerOfAttorneyEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetConfirmPowerOfAttorneyEvent)
  .reset(events.resetOrderInfoEvent);

// Invoice
export const $invoiceDetails = createStore({ loading: false, data: {}, error: null })
  .on(effects.getInvoiceDetailsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.getInvoiceDetailsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: {},
        error: response.error.response
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetOrderInfoEvent);

export const $sendProductsToXfiles = createStore({ loading: false, success: false, error: null })
  .on(effects.sendProductsToXfilesEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.sendProductsToXfilesEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetSendProductsToXfilesEvent)
  .reset(events.resetOrderInfoEvent);