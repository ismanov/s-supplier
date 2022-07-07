import { createEffect } from "effector";
import { api } from "api";

// LIST
export const getAggregationsListEffect = createEffect({
  handler: api.aggregations.getAggregationsList
});

export const getAggregationProductsFilterItemsEffect = createEffect({
  handler: api.aggregations.getAggregationProductsItems
});

export const getAggregationStatusesItemsEffect = createEffect({
  handler: api.aggregations.getAggregationStatusesItems
});

// DETAILS
export const getAggregationDetailsEffect = createEffect({
  handler: api.aggregations.getAggregationDetails
});

// ORDERS
export const getAggregationOrdersListEffect = createEffect({
  handler: api.aggregations.getAggregationOrdersList
});

export const createAggregationOrderEffect = createEffect({
  handler: api.aggregations.createAggregationOrder
});

// ORDER-PRINT
export const getAggregationOrderCodesEffect = createEffect({
  handler: api.aggregations.getAggregationOrderCodes
});

// CREATE-AGGREGATION
export const createAggregationEffect = createEffect({
  handler: api.aggregations.createAggregation
});

export const getPackageTypesEffect = createEffect({
  handler: api.aggregations.getPackageTypes
});

export const getAggregationProductsItemsEffect = createEffect({
  handler: api.aggregations.getAggregationProductsItems
});