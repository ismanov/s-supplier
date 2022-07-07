import { createEvent } from "effector";

// ORDERS
export const updateOrdersFilterPropsEvent = createEvent();
export const resetOrdersFilterPropsEvent = createEvent();
export const resetOrderSubStatusItemsEvent = createEvent();
export const resetConfirmOrderEvent = createEvent();
export const resetRevisedOrderEvent = createEvent();
export const resetRejectOrderEvent = createEvent();
export const resetOrderItemEffect = createEvent();

// ORDERS PAGE
export const resetOrderInfoEvent = createEvent();

// Contract
export const resetUploadContractFileEvent = createEvent();
export const resetSaveCurrentContractEvent = createEvent();
export const resetContractDetailsEvent = createEvent();

// Power-of-attorney
export const resetConfirmPowerOfAttorneyEvent = createEvent();

// Invoice
export const resetSendProductsToXfilesEvent = createEvent();