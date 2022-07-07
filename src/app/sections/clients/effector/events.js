import { createEvent } from "effector";

// CLIENTS-LIST
export const updateClientsFilterPropsEvent = createEvent();
export const resetClientsFilterPropsEvent = createEvent();
export const resetClientItemEffect = createEvent();

// CLIENT-PAGE
export const resetCurrentClientPageEvent = createEvent();

export const updateClientOrdersFilterPropsEvent = createEvent();
export const resetClientOrdersFilterPropsEvent = createEvent();
export const resetClientOrderSubStatusItemsEvent = createEvent();