import { createStore } from 'effector';
import * as effects from './effects';
import * as events from './events';
import { PageableList } from "helpers/pagelist";

// LIST
export const $aggregationsList = createStore({ loading: false, data: new PageableList(), error: null })
  .on(effects.getAggregationsListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getAggregationsListEffect.finally, (prevState, response) => {
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

export const $aggregationsFilterProps = createStore({})
  .on(events.updateAggregationsFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props
    }
  })
  .reset(events.resetAggregationsFilterPropsEvent);

export const $aggregationProductsFilterItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getAggregationProductsFilterItemsEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getAggregationProductsFilterItemsEffect.finally, (prevState, response) => {
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

export const $aggregationStatusesItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getAggregationStatusesItemsEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getAggregationStatusesItemsEffect.finally, (prevState, response) => {
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

// DETAILS
export const $aggregationDetails = createStore({ loading: false, data: null, error: null })
  .on(effects.getAggregationDetailsEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getAggregationDetailsEffect.finally, (prevState, response) => {
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
  .reset(events.resetAggregationDetails);

// ORDERS
export const $aggregationOrdersList = createStore({ loading: false, data: new PageableList(), error: null })
  .on(effects.getAggregationOrdersListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getAggregationOrdersListEffect.finally, (prevState, response) => {
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

export const $aggregationsOrdersFilterProps = createStore({})
  .on(events.updateAggregationsOrdersFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props
    }
  })
  .reset(events.resetAggregationsOrdersFilterPropsEvent);

export const $createAggregationOrder = createStore({ loading: false, success: false, error: null })
  .on(effects.createAggregationOrderEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.createAggregationOrderEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevState,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetCreateAggregationOrderEvent);

// ORDER-PRINT
export const $aggregationOrderCodes = createStore({ loading: false, data: [], error: null })
  .on(effects.getAggregationOrderCodesEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getAggregationOrderCodesEffect.finally, (prevState, response) => {
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
  })
  .reset(events.resetAggregationOrderCodesEvent);

// CREATE AGGREGATION
export const $createAggregation = createStore({ loading: false, success: false, error: null })
  .on(effects.createAggregationEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.createAggregationEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevState,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetCreateAggregationEvent);

export const $packageTypes = createStore({ loading: false, data: [], error: null })
  .on(effects.getPackageTypesEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getPackageTypesEffect.finally, (prevState, response) => {
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

export const $aggregationProductsItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getAggregationProductsItemsEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getAggregationProductsItemsEffect.finally, (prevState, response) => {
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