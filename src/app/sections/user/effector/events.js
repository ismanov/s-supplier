import { createEvent } from "effector";

export const resetUpdateUserInfoEvent = createEvent();
export const resetUpdateUserPasswordEvent = createEvent();
export const resetAddUserBranchEvent = createEvent();
export const resetUpdateUserBranchEvent = createEvent();
export const resetChangeUserBranchStatusEvent = createEvent();
export const resetUploadUserCompanyLogoEvent = createEvent();
export const resetDeleteUserCompanyLogoEvent = createEvent();
export const resetUpdateUserCompanyInfoEvent = createEvent();
export const resetUserCompanyInfoByTinEvent = createEvent();
export const resetDistrictItemsEvent = createEvent();
export const resetAddUserCompanyBankInfoEvent = createEvent();
export const resetUpdateUserCompanyBankInfoEvent = createEvent();
export const resetCompanyBankCategoriesEvent = createEvent();
export const resetCompanyBanksEvent = createEvent();
export const resetCompanyBankBranchesEvent = createEvent();
export const updateBranchesFilterPropsEvent = createEvent();
export const resetBranchesFilterPropsEvent = createEvent();
export const resetEImzoLoginEvent = createEvent();

// USER-EMPLOYEES
export const resetAddUserEmployeeEvent = createEvent();
export const resetUpdateUserEmployeeEvent = createEvent();
export const resetUpdateUserEmployeeStatusEvent = createEvent();
export const updateEmployeesFilterPropsEvent = createEvent();
export const resetEmployeesFilterPropsEvent = createEvent();

// USER-EMPLOYEE-PAGE
export const resetCurrentEmployeeEvent = createEvent();
