import { createStore } from 'effector';
import * as effects from './effects';
import * as events from './events';
import { PageableList } from "helpers/pagelist";
import moment from "moment";

moment.locale('ru');

const dateFormat = 'YYYY-MM-DDTHH:mm';

export const $ordersChart = createStore({ loading: false, data: [], error: null })
  .on(effects.getOrdersChartEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getOrdersChartEffect.finally, (prevState, response) => {
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

export const $ordersChartFilterProps = createStore({
    from: moment().subtract(1, 'month').startOf('day').format(dateFormat),
    to: moment().endOf('day').format(dateFormat),
  })
  .on(events.updateOrdersChartFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props
    }
  })
  .reset(events.resetOrdersChartFilterPropsEvent);

export const $ordersCustomers = createStore({ loading: false, data: [], error: null })
  .on(effects.getOrdersCustomersEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getOrdersCustomersEffect.finally, (prevState, response) => {
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

export const $ordersTopProducts = createStore({ loading: false, data: [], error: null })
  .on(effects.getOrdersTopProductsEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getOrdersTopProductsEffect.finally, (prevState, response) => {
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

export const $ordersTopProductsFilterProps = createStore({ type: "AMOUNT" })
  .on(events.updateOrdersTopProductsFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props
    }
  })
  .reset(events.resetOrdersTopProductsFilterPropsEvent);

export const $ordersTopBranches = createStore({ loading: false, data: [], error: null })
  .on(effects.getOrdersTopBranchesEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getOrdersTopBranchesEffect.finally, (prevState, response) => {
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