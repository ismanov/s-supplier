import { createEffect } from "effector";
import { api } from "api";

// ORDERS
export const getOrdersListEffect = createEffect({
  handler: api.orders.getOrdersList
});

export const saveOrderItemEffect = createEffect({
  handler: api.orders.saveOrderItem
});

export const getOrderItemEffect = createEffect({
  handler: api.orders.getOrderItem
});

export const getOrderItemsEffect = createEffect({
  handler: api.orders.getOrderItems
});

export const updateOrderItemEffect = createEffect({
  handler: api.orders.updateOrderItem
});

export const deleteOrderItemEffect = createEffect({
  handler: api.orders.deleteOrderItem
});

export const updateOrderStatusEffect = createEffect({
  handler: api.orders.updateOrderStatus
});

export const getOrderStatusItemsEffect = createEffect({
  handler: api.orders.getOrderStatusItems
});

export const getOrderSubStatusItemsEffect = createEffect({
  handler: api.orders.getOrderSubStatusItems
});

export const confirmOrderEffect = createEffect({
  handler: api.orders.confirmOrder
});

export const revisedOrderEffect = createEffect({
  handler: api.orders.revisedOrder
});

export const rejectOrderEffect = createEffect({
  handler: api.orders.rejectOrder
});

// ORDERS-PAGE
export const getOrderInfoEffect = createEffect({
  handler: api.orders.getOrderInfo
});

// Contract
export const uploadContractFileEffect = createEffect({
  handler: api.orders.uploadContractFile
});

export const saveCurrentContractEffect = createEffect({
  handler: api.orders.saveCurrentContract
});

export const getContractTypesEffect = createEffect({
  handler: api.orders.getContractTypes
});

export const getCurrentContractsEffect = createEffect({
  handler: api.orders.getCurrentContracts
});

export const getContractDetailsEffect = createEffect({
  handler: api.orders.getContractDetails
});

// Invoice payment
export const getInvoicePaymentDetailsEffect = createEffect({
  handler: api.orders.getInvoicePaymentDetails
});

// Power-of-attorney
export const getPowerOfAttorneyDetailsEffect = createEffect({
  handler: api.orders.getPowerOfAttorneyDetails
});

export const confirmPowerOfAttorneyEffect = createEffect({
  handler: api.orders.confirmPowerOfAttorney
});

// Invoice
export const getInvoiceDetailsEffect = createEffect({
  handler: api.orders.getInvoiceDetails
});

export const sendProductsToXfilesEffect = createEffect({
  handler: api.orders.sendProductsToXfiles
});