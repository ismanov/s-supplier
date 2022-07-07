import { httpDelete, httpGet, httpPost, httpPut } from "../init";

// USER-CURRENT
export const getCurrentUser = () =>
  httpGet({
    url: "/api/cabinet/v1/account/current",
  });

export const updateUser = ({ id, ...data }) =>
  httpPut({
    url: `/api/cabinet/v1/employees/${id}`,
    data,
  });

// USER-INFO
export const getUserInfo = () =>
  httpGet({
    url: "/api/cabinet/v1/employees/owner",
  });

export const updateUserInfo = (data) =>
  httpPut({
    url: `/api/cabinet/v1/employees/owner/${data.id}`,
    data,
  });

// USER-SECURITY
export const updateUserPassword = (data) =>
  httpPut({
    url: `/api/cabinet/v1/employees/${data.id}/password`,
    data,
  });

// USER-COMPANY
export const getUserCompanyInfo = () =>
  httpGet({
    url: "/api/cabinet/v1/companies",
  });

export const getUserCompanyInfoByTin = (tin) =>
  httpGet({
    url: `/api/cabinet/v1/companies/check/${tin}`,
  });

export const updateUserCompanyInfo = (data) =>
  httpPut({
    url: `/api/cabinet/v1/companies/${data.id}`,
    data,
  });

export const uploadUserCompanyLogo = (data) =>
  httpPost({
    url: "/api/cabinet/v1/companies/upload/logo",
    data: data.file,
  });

export const deleteUserCompanyLogo = () =>
  httpDelete({
    url: `/api/cabinet/v1/companies/logo`,
  });

export const getActivityTypeItems = () =>
  httpGet({
    url: `/api/cabinet/v1/activity-types/lookup`,
  });

export const getDeliveryTypeItems = (params) =>
  httpGet({
    url: `/api/suppliers/delivery-types`,
    params,
  });

export const getPaymentTypeItems = (params) =>
  httpGet({
    url: "/api/suppliers/payment-types",
    params,
  });

// USER-COMPANY-BANK
export const getUserCompanyBankInfo = () =>
  httpGet({
    url: "/api/cabinet/v1/company-banks",
  });

export const addUserCompanyBankInfo = (data) =>
  httpPost({
    url: "/api/cabinet/v1/company-banks",
    data,
  });

export const updateUserCompanyBankInfo = (data) =>
  httpPut({
    url: `/api/cabinet/v1/company-banks/${data.id}`,
    data,
  });

export const getCompanyBankCategories = (params) =>
  httpGet({
    url: "/api/cabinet/v1/banks/categories/lookup",
    params,
  });

export const getCompanyBanks = (params) =>
  httpGet({
    url: "/api/cabinet/v1/banks/lookup",
    params,
  });

export const getCompanyBankBranches = (params) =>
  httpGet({
    url: "/api/cabinet/v1/banks/lookup",
    params,
  });

// USER-BRANCHES
export const addUserBranch = (data) =>
  httpPost({
    url: "/api/cabinet/v1/branches",
    data,
  });

export const updateUserBranch = (data) =>
  httpPut({
    url: `/api/cabinet/v1/branches/${data.id}`,
    data,
  });

export const changeUserBranchStatus = (data) =>
  httpPut({
    url: "/api/cabinet/v1/branches/status",
    data,
  });

export const getBranchesList = (params) =>
  httpGet({
    url: "/api/cabinet/v1/branches",
    params,
  });

// USER-EMPLOYEES
export const addUserEmployee = (data) =>
  httpPost({
    url: "/api/cabinet/v1/employees",
    data,
  });

export const updateUserEmployee = ({ id, ...data }) =>
  httpPut({
    url: `/api/cabinet/v1/employees/${id}`,
    data,
  });

export const updateUserEmployeeStatus = ({ id, ...data }) =>
  httpPut({
    url: `/api/cabinet/v1/employees/${id}/change-status`,
    data,
  });

export const getEmployeesList = (params) =>
  httpGet({
    url: "/api/cabinet/v1/employees",
    params,
  });

export const getEmployeesRoles = () =>
  httpGet({
    url: "/api/cabinet/v1/employees/roles",
  });

// CURRENT-EMPLOYEE-PAGE
export const getCurrentEmployee = (id) =>
  httpGet({
    url: `/api/cabinet/v1/employees/${id}`,
  });

// ITEMS
export const getBranchesItems = (params) =>
  httpGet({
    url: "/api/cabinet/v1/branches/lookup",
    params,
  });

export const getRolesItems = () =>
  httpGet({
    url: "/api/users/supplier-roles",
  });

export const getBusinessTypeItems = () =>
  httpGet({
    url: "/api/cabinet/v1/companies/business-types",
  });

export const getRegionItems = () =>
  httpGet({
    url: "/api/cabinet/v1/regions/items",
  });

export const getDistrictItems = (id) =>
  httpGet({
    url: `/api/cabinet/v1/districts/items/${id}`,
  });

//UNITS

export const getUnitItems = () =>
  httpGet({
    url: `/api/cabinet/v1/units/items`,
  });

//PRODUCTS

export const getProductItems = (params) =>
  httpGet({
    url: `/api/cabinet/v1/products/lookup`,
    params,
  });

// get  access token with e-imzo key
export const eImzoLogin = (data) =>
  httpPost({
    url: "/api/cabinet/v1/account/login/e-imzo",
    data,
  });
