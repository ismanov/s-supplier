import { createEffect } from "effector";
import { api } from "api";

// USER
export const getCurrentUserEffect = createEffect({
  handler: api.user.getCurrentUser
});

export const updateUserEffect = createEffect({
  handler: api.user.updateUser
});

//UNITS

export const getUnitItemsEffect = createEffect({
  handler: api.user.getUnitItems
});

//PRODUCTS

export const getProductItemsEffect = createEffect({
  handler: api.user.getProductItems
});