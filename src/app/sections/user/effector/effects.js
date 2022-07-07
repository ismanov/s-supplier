import { createEffect } from "effector";
import { api } from "api";

// USER-INFO
export const getUserInfoEffect = createEffect({
  handler: api.user.getUserInfo,
});

export const updateUserInfoEffect = createEffect({
  handler: api.user.updateUserInfo,
});

// USER-SECURITY
export const updateUserPasswordEffect = createEffect({
  handler: api.user.updateUserPassword,
});

// USER-COMPANY
export const getUserCompanyInfoEffect = createEffect({
  handler: api.user.getUserCompanyInfo,
});

export const getUserCompanyInfoByTinEffect = createEffect({
  handler: api.user.getUserCompanyInfoByTin,
});

export const updateUserCompanyInfoEffect = createEffect({
  handler: api.user.updateUserCompanyInfo,
});

export const uploadUserCompanyLogoEffect = createEffect({
  handler: api.user.uploadUserCompanyLogo,
});

export const deleteUserCompanyLogoEffect = createEffect({
  handler: api.user.deleteUserCompanyLogo,
});

export const getActivityTypeItemsEffect = createEffect({
  handler: api.user.getActivityTypeItems,
});

export const getDeliveryTypeItemsEffect = createEffect({
  handler: api.user.getDeliveryTypeItems,
});

export const getPaymentTypeItemsEffect = createEffect({
  handler: api.user.getPaymentTypeItems,
});

// USER-COMPANY-BANK
export const getUserCompanyBankInfoEffect = createEffect({
  handler: api.user.getUserCompanyBankInfo,
});

export const addUserCompanyBankInfoEffect = createEffect({
  handler: api.user.addUserCompanyBankInfo,
});

export const updateUserCompanyBankInfoEffect = createEffect({
  handler: api.user.updateUserCompanyBankInfo,
});

export const getCompanyBankCategoriesEffect = createEffect({
  handler: api.user.getCompanyBankCategories,
});

export const getCompanyBanksEffect = createEffect({
  handler: api.user.getCompanyBanks,
});

export const getCompanyBankBranchesEffect = createEffect({
  handler: api.user.getCompanyBankBranches,
});

// USER-BRANCHES
export const getUserBranchesEffect = createEffect({
  handler: api.user.getBranchesList,
});

export const addUserBranchEffect = createEffect({
  handler: api.user.addUserBranch,
});

export const updateUserBranchEffect = createEffect({
  handler: api.user.updateUserBranch,
});

export const changeUserBranchStatusEffect = createEffect({
  handler: api.user.changeUserBranchStatus,
});

export const getBranchesListEffect = createEffect({
  handler: api.user.getBranchesList,
});

// USER-EMPLOYEES
export const addUserEmployeeEffect = createEffect({
  handler: api.user.addUserEmployee,
});

export const updateUserEmployeeEffect = createEffect({
  handler: api.user.updateUserEmployee,
});

export const updateUserEmployeeStatusEffect = createEffect({
  handler: api.user.updateUserEmployeeStatus,
});

export const getEmployeesListEffect = createEffect({
  handler: api.user.getEmployeesList,
});

// CURRENT-EMPLOYEE-PAGE
export const getCurrentEmployeeEffect = createEffect({
  handler: api.user.getCurrentEmployee,
});

// ITEMS
export const getBranchesItemsEffect = createEffect({
  handler: api.user.getBranchesItems,
});

export const getFilterBranchesItemsEffect = createEffect({
  handler: api.user.getBranchesItems,
});

export const getRolesItemsEffect = createEffect({
  handler: api.user.getEmployeesRoles,
});

export const getBusinessTypeItemsEffect = createEffect({
  handler: api.user.getBusinessTypeItems,
});

export const getRegionItemsEffect = createEffect({
  handler: api.user.getRegionItems,
});

export const getDistrictItemsEffect = createEffect({
  handler: api.user.getDistrictItems,
});

export const eImzoLoginEffect = createEffect({
  handler: api.user.eImzoLogin,
});
