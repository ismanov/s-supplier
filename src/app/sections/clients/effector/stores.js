import { createStore } from 'effector';
import * as effects from './effects';
import * as events from './events';
import { PageableList } from "helpers/pagelist";

// CLIENTS-LIST
export const $clientsList = createStore({ loading: false, data: new PageableList(), error: null })
  .on(effects.getClientsListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getClientsListEffect.finally, (prevState, response) => {
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

export const $clientsItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getClientsItemsEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getClientsItemsEffect.finally, (prevState, response) => {
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

export const $clientItem = createStore({ loading: false, data: {}, error: null })
  .on(effects.getClientItemEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getClientItemEffect.finally, (prevState, response) => {
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
  }).reset(events.resetClientItemEffect);

export const $clientsFilterProps = createStore({})
  .on(events.updateClientsFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props
    }
  })
  .reset(events.resetClientsFilterPropsEvent);

// CLIENT-PAGE
export const $currentClient = createStore({ loading: false, data: null, error: null })
  .on(effects.getCurrentClientEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getCurrentClientEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: null,
        error: response.error.response
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null
      };
    }
  })
  .reset(events.resetCurrentClientPageEvent);

export const $clientOrders = createStore({ loading: false, data: new PageableList(), error: null })
  .on(effects.getClientOrdersEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getClientOrdersEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: null,
        error: response.error.response
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null
      };
    }
  })
  .reset(events.resetCurrentClientPageEvent);

export const $clientOrdersFilterProps = createStore({})
  .on(events.updateClientOrdersFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props
    }
  })
  .reset(events.resetClientOrdersFilterPropsEvent)
  .reset(events.resetCurrentClientPageEvent);

export const $clientOrderSubStatusItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getClientOrderSubStatusItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    }
  })
  .on(effects.getClientOrderSubStatusItemsEffect.finally, (prevStore, response) => {
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
  .reset(events.resetClientOrderSubStatusItemsEvent)
  .reset(events.resetCurrentClientPageEvent);