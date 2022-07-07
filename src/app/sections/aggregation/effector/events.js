import { createEvent } from "effector";

// LIST
export const updateAggregationsFilterPropsEvent = createEvent();
export const resetAggregationsFilterPropsEvent = createEvent();

// DETAILS
export const resetAggregationDetails = createEvent();

// ORDERS
export const updateAggregationsOrdersFilterPropsEvent = createEvent();
export const resetAggregationsOrdersFilterPropsEvent = createEvent();
export const resetCreateAggregationOrderEvent = createEvent();

// ORDER-PRINT
export const resetAggregationOrderCodesEvent = createEvent();

// CREATE AGGREGATION
export const resetCreateAggregationEvent = createEvent();