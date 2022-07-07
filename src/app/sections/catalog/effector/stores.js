import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PageableList } from "helpers/pagelist";
import { dataStoreCreator, infoStoreCreator } from "../../../helpers/effectorStoreCreator";

// CATALOG ALL
export const $catalogBranches = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getCatalogBranchesEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getCatalogBranchesEffect.finally, (prevStore, response) => {
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
  .reset(events.resetCatalogBranchesEvent);

// Categories-all
export const $categories = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getCategoriesEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getCategoriesEffect.finally, (prevStore, response) => {
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
  .reset(events.resetCategoriesEvent);

export const $addCategory = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.addCategoryEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.addCategoryEffect.finally, (prevStore, response) => {
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
  .reset(events.resetAddCategoryEvent);

export const $updateCategory = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.updateCategoryEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updateCategoryEffect.finally, (prevStore, response) => {
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
  .reset(events.resetUpdateCategoryEvent);

export const $deleteCategory = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.deleteCategoryEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.deleteCategoryEffect.finally, (prevStore, response) => {
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
  .reset(events.resetDeleteCategoryEvent);

export const $downloadAllCategoriesExcel = createStore({
  loading: false,
  data: null,
  error: null,
})
  .on(
    effects.downloadAllCategoriesExcelEffect.pending,
    (prevStore, pending) => {
      return {
        ...prevStore,
        loading: pending,
      };
    }
  )
  .on(
    effects.downloadAllCategoriesExcelEffect.finally,
    (prevStore, response) => {
      if (response.error) {
        return {
          ...prevStore,
          data: null,
          error: response.error.response,
        };
      } else {
        return {
          ...prevStore,
          data: response.result.data,
          error: null,
        };
      }
    }
  )
  .reset(events.resetDownloadAllCategoriesExcelEvent);

export const $downloadCategoriesExcel = createStore({
  loading: false,
  data: null,
  error: null,
})
  .on(effects.downloadCategoriesExcelEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.downloadCategoriesExcelEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: null,
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

export const $uploadProductListExcel = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.uploadProductListExcelEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.uploadProductListExcelEffect.finally, (prevStore, response) => {
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
  .reset(events.resetUploadProductListExcelEvent);

export const $categoriesFilterProps = createStore({})
  .on(events.updateCategoriesFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props,
    };
  })
  .reset(events.resetCategoriesFilterPropsEvent);

export const $categoriesSearch = createStore(null)
  .on(events.updateCategoriesSearchEvent, (prevStore, props) => {
    return props;
  })
  .reset(events.resetCategoriesSearchEvent);

// Products
export const $productList = createStore({
  loading: false,
  data: new PageableList(),
  categoryId: null,
  error: null,
})
  .on(effects.getProductListEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getProductListEffect.finally, (prevStore, response) => {
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
        categoryId: response.params.categoryId,
        error: null,
      };
    }
  })
  .reset(events.resetProductListEvent);

export const $productInfo = createStore({})
  .on(effects.getProductInfoEffect, (prevStore, response) => {
    return {
      ...prevStore,
      [response.id]: {
        loading: true,
        data: {},
        error: null,
      },
    };
  })
  .on(effects.getProductInfoEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        [response.params.id]: {
          loading: false,
          data: {},
          error: response.error.response,
        },
      };
    } else {
      return {
        ...prevStore,
        [response.params.id]: {
          loading: false,
          data: response.result.data,
          error: null,
        },
      };
    }
  })
  .reset(events.resetProductInfoEvent);

export const $productListFilterProps = createStore({ size: 10 })
  .on(events.updateProductListFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props,
    };
  })
  .reset(events.resetProductListFilterPropsEvent);

export const $updateProductsBatch = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.updateProductsBatchEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updateProductsBatchEffect.finally, (prevStore, response) => {
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
  .reset(events.resetUpdateProductsBatchEvent);

export const $productsBatch = createStore([])
  .on(events.addProductsBatchEvent, (prevStore, props) => {
    return [...props];
  })
  .reset(events.resetProductsBatchEvent);

export const $addProduct = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.addProductEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.addProductEffect.finally, (prevStore, response) => {
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
  .reset(events.resetAddProductEvent);

export const $updateProduct = createStore({})
  .on(effects.updateProductEffect, (prevStore, params) => {
    return {
      ...prevStore,
      [params.id]: {
        loading: true,
        success: false,
        error: null,
      },
    };
  })
  .on(effects.updateProductEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        [response.params.id]: {
          loading: false,
          success: false,
          error: response.error.response,
        },
      };
    } else {
      return {
        ...prevStore,
        [response.params.id]: {
          loading: false,
          success: true,
          error: null,
        },
      };
    }
  })
  .reset(events.resetUpdateProductEvent);

export const $updateDetailsProduct = createStore({})
  .on(effects.updateDetailsProductEffect, (prevStore, params) => {
    return {
      ...prevStore,
      [params.id]: {
        loading: true,
        success: false,
        error: null,
      },
    };
  })
  .on(effects.updateDetailsProductEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        [response.params.id]: {
          loading: false,
          success: false,
          error: response.error.response,
        },
      };
    } else {
      return {
        ...prevStore,
        [response.params.id]: {
          loading: false,
          success: true,
          error: null,
        },
      };
    }
  })
  .reset(events.resetUpdateDetailsProductEvent);

export const $deleteProduct = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(effects.deleteProductEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.deleteProductEffect.finally, (prevStore, response) => {
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
  .reset(events.resetDeleteProductEvent);

export const $unitItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getUnitItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getUnitItemsEffect.finally, (prevStore, response) => {
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

export const $vatItems = createStore({ loading: false, data: [], error: null })
  .on(effects.getVatItemsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getVatItemsEffect.finally, (prevStore, response) => {
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

// CATALOG-SINGLE

// Categories-single
export const $categoriesSingle = createStore({
  loading: false,
  data: [],
  error: null,
})
  .on(effects.getCategoriesSingleEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getCategoriesSingleEffect.finally, (prevStore, response) => {
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

export const $categoriesSingleFilterProps = createStore({})
  .on(events.updateCategoriesSingleFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props,
    };
  })
  .reset(events.resetCategoriesSingleFilterPropsEvent);

export const $selectedCategoriesSingle = createStore([])
  .on(events.updateSelectedCategoriesSingleEvent, (prevStore, props) => {
    return props;
  })
  .reset(events.resetSelectedCategoriesSingleEvent);

export const $saveCategoriesSingleToBranch = createStore({
  loading: false,
  success: false,
  error: null,
})
  .on(
    effects.saveCategoriesSingleToBranchEffect.pending,
    (prevStore, pending) => {
      return {
        ...prevStore,
        loading: pending,
      };
    }
  )
  .on(
    effects.saveCategoriesSingleToBranchEffect.finally,
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
  .reset(events.resetSaveCategoriesSingleToBranchEvent);

export const $categoriesList = dataStoreCreator(
  effects,
  "getCategoriesListEffect"
).reset(events.resetCategoriesListEvent);

// add product modal items >>>>>>>>>>>>>>>

export const $productTypeItems = dataStoreCreator(
  effects,
  "getProductTypeItemsEffect",
  []
).reset(events.resetProductTypeItemsEvent);

export const $companyCatalogItems = dataStoreCreator(
  effects,
  "getCompanyCatalogItemsEffect",
  []
).reset(events.resetCompanyCatalogItemsEvent);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<


// SYNC CATALOG

export const $syncCatalog = infoStoreCreator(effects, 'syncCatalogEffect')