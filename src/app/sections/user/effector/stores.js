import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PageableList } from "helpers/pagelist";

// USER-INFO
export const $userInfo = createStore({ loading: false, data: {}, error: null })
  .on(effects.getUserInfoEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getUserInfoEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: {},
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $updateUserInfo = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.updateUserInfoEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updateUserInfoEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetUpdateUserInfoEvent);

// USER-SECURITY
export const $updateUserPassword = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.updateUserPasswordEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updateUserPasswordEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetUpdateUserPasswordEvent);

// USER-COMPANY
export const $userCompanyInfo = createStore({
  loading: false,
  data: {},
  error: null,
})
  .on(effects.getUserCompanyInfoEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getUserCompanyInfoEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: {},
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .on(effects.deleteUserCompanyLogoEffect.done, (prevStore) => {
    return {
      ...prevStore,
      data: {
        ...prevStore.data,
        logo: null,
      },
    };
  })
  .on(effects.uploadUserCompanyLogoEffect.done, (prevStore, response) => {
    return {
      ...prevStore,
      data: {
        ...prevStore.data,
        logo: {
          ...response.result.data,
        },
      },
    };
  });

export const $userCompanyInfoByTin = createStore({
  loading: false,
  data: {},
  error: null,
})
  .on(effects.getUserCompanyInfoByTinEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getUserCompanyInfoByTinEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: {},
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetUserCompanyInfoByTinEvent);

export const $updateUserCompanyInfo = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.updateUserCompanyInfoEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updateUserCompanyInfoEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetUpdateUserCompanyInfoEvent);

export const $uploadUserCompanyLogo = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.uploadUserCompanyLogoEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.uploadUserCompanyLogoEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetUploadUserCompanyLogoEvent);

export const $deleteUserCompanyLogo = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.deleteUserCompanyLogoEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.deleteUserCompanyLogoEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetDeleteUserCompanyLogoEvent);

export const $activityTypeItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getActivityTypeItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getActivityTypeItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
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

export const $deliveryTypeItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getDeliveryTypeItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getDeliveryTypeItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
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

export const $paymentTypeItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getPaymentTypeItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getPaymentTypeItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
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

// USER-COMPANY-BANK
export const $userCompanyBankInfo = createStore({
  loading: false,
  data: {},
  error: null,
})
  .on(effects.getUserCompanyBankInfoEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getUserCompanyBankInfoEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: {},
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $addUserCompanyBankInfo = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.addUserCompanyBankInfoEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.addUserCompanyBankInfoEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetAddUserCompanyBankInfoEvent);

export const $updateUserCompanyBankInfo = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.updateUserCompanyBankInfoEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(
    effects.updateUserCompanyBankInfoEffect.finally,
    (prevStore, response) => {
      if (response.error) {
        return {
          ...prevStore,
          success: false,
          error: response.error.response.data,
        };
      } else {
        return {
          ...prevStore,
          success: true,
          error: null,
        };
      }
    }
  )
  .reset(events.resetUpdateUserCompanyBankInfoEvent);

export const $companyBankCategories = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getCompanyBankCategoriesEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getCompanyBankCategoriesEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data.content,
        error: null,
      };
    }
  })
  .reset(events.resetCompanyBankCategoriesEvent);

export const $companyBanks = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getCompanyBanksEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getCompanyBanksEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetCompanyBanksEvent);

export const $companyBankBranches = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getCompanyBankBranchesEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getCompanyBankBranchesEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetCompanyBankBranchesEvent);

// USER-BRANCHES
export const $userBranches = createStore({
  loading: false,
  data: new PageableList(),
  error: null,
})
  .on(effects.getUserBranchesEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getUserBranchesEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: new PageableList(),
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $addUserBranch = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.addUserBranchEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.addUserBranchEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetAddUserBranchEvent);

export const $updateUserBranch = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.updateUserBranchEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updateUserBranchEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetUpdateUserBranchEvent);

export const $changeUserBranchStatus = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.changeUserBranchStatusEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.changeUserBranchStatusEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetChangeUserBranchStatusEvent);

export const $branchesList = createStore({
  loading: false,
  data: new PageableList(),
  error: null,
})
  .on(effects.getBranchesListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getBranchesListEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: new PageableList(),
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $branchesFilterProps = createStore({})
  .on(events.updateBranchesFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props,
    };
  })
  .reset(events.resetBranchesFilterPropsEvent);

// USER-EMPLOYEES
export const $addUserEmployee = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.addUserEmployeeEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.addUserEmployeeEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetAddUserEmployeeEvent);

export const $updateUserEmployee = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.updateUserEmployeeEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updateUserEmployeeEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetUpdateUserEmployeeEvent);

export const $updateUserEmployeeStatus = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.updateUserEmployeeStatusEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updateUserEmployeeStatusEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data,
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null,
      };
    }
  })
  .reset(events.resetUpdateUserEmployeeStatusEvent);

export const $employeesList = createStore({
  loading: false,
  data: new PageableList(),
  error: null,
})
  .on(effects.getEmployeesListEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getEmployeesListEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: new PageableList(),
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $employeesFilterProps = createStore({})
  .on(events.updateEmployeesFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props,
    };
  })
  .reset(events.resetEmployeesFilterPropsEvent);

// CURRENT-EMPLOYEE-PAGE
export const $currentEmployee = createStore({
  loading: false,
  data: null,
  error: null,
})
  .on(effects.getCurrentEmployeeEffect.pending, (prevState, pending) => {
    return {
      ...prevState,
      loading: pending,
    };
  })
  .on(effects.getCurrentEmployeeEffect.finally, (prevState, response) => {
    if (response.error) {
      return {
        ...prevState,
        data: null,
        error: response.error.response,
      };
    } else {
      return {
        ...prevState,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetCurrentEmployeeEvent);

// ITEMS
export const $branchesItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getBranchesItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getBranchesItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $filterBranchesItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getFilterBranchesItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getFilterBranchesItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data.content,
        error: null,
      };
    }
  });

export const $rolesItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getRolesItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getRolesItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $businessTypeItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getBusinessTypeItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getBusinessTypeItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $regionItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getRegionItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getRegionItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  });

export const $districtItems = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getDistrictItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getDistrictItemsEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: [],
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetDistrictItemsEvent);

export const $eImzoLogin = createStore({
  loading: false,
  data: undefined,
  error: null,
})
  .on(effects.eImzoLoginEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.eImzoLoginEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: undefined,
        error: response.error.response,
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data,
        error: null,
      };
    }
  })
  .reset(events.resetEImzoLoginEvent);
