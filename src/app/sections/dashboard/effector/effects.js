import { createEffect } from "effector";
import { api } from "api";

export const getOrdersChartEffect = createEffect({
  handler: api.dashboard.getOrdersChart
});

export const getOrdersCustomersEffect = createEffect({
  handler: api.dashboard.getOrdersCustomers
});

export const getOrdersTopProductsEffect = createEffect({
  handler: api.dashboard.getOrdersTopProducts
});

export const getOrdersTopBranchesEffect = createEffect({
  handler: api.dashboard.getOrdersTopBranches
});