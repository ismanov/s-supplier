import { createEffect } from "effector";
import { api } from "api";

// CLIENTS-LIST
export const getClientsListEffect = createEffect({
  handler: api.clients.getClientsList
});

export const getClientItemEffect = createEffect({
  handler: api.clients.getClientItem
});

export const getClientsItemsEffect = createEffect({
  handler: api.clients.getClientsItems
});

// CLIENT-PAGE
export const getCurrentClientEffect = createEffect({
  handler: api.clients.getCurrentClient
});

export const getClientOrdersEffect = createEffect({
  handler: api.clients.getClientOrders
});

export const getClientOrderSubStatusItemsEffect = createEffect({
  handler: api.clients.getClientOrderSubStatusItems
});