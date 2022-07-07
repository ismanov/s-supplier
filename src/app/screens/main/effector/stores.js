import { createStore } from 'effector';
import * as effects from './effects';
import * as events from './events';

export const $currentUser = createStore({ loading: false, data: null, error: null })
  .on(effects.getCurrentUserEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    }
  })
  .on(effects.getCurrentUserEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: null,
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
  .reset(events.resetCurrentUserEvent);

export const $updateUser = createStore({ loading: false, success: false, error: null })
  .on(effects.updateUserEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    }
  })
  .on(effects.updateUserEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      }
    } else {
      return {
        ...prevStore,
        success: true,
        error: null
      }
    }
  })
  .reset(events.resetUpdateUserEvent);

// UNITS

export const $unitItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getUnitItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    }
  })
  .on(effects.getUnitItemsEffect.finally, (prevStore, response) => {
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
  .reset(events.resetUnitItemsEvent);

//PRODUCTS
export const $productItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getProductItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    }
  })
  .on(effects.getProductItemsEffect.finally, (prevStore, response) => {
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
  .reset(events.resetProductItemsEvent);