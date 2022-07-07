import { createStore } from "effector";

export const dataStoreCreator = (effects, effect, initialData = {}) =>
  createStore({
    loading: false,
    data: initialData,
    error: null,
  })
    .on(effects[effect].pending, (prevStore, pending) => {
      return {
        ...prevStore,
        loading: pending,
      };
    })
    .on(effects[effect].finally, (prevStore, response) => {
      if (response.error) {
        return {
          ...prevStore,
          data: initialData,
          error: response.error.response.data,
        };
      } else {
        return {
          ...prevStore,
          data: response.result.data,
          error: null,
        };
      }
    });

export const infoStoreCreator = (effects, effect) =>
  createStore({
    loading: false,
    success: false,
    error: null,
  })
    .on(effects[effect].pending, (prevStore, pending) => {
      return {
        ...prevStore,
        loading: pending,
      };
    })
    .on(effects[effect].finally, (prevStore, response) => {
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
    });
