import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Select, Button } from "antd";

import effector from "../effector";

import { debounce } from "helpers/debounce";
import { SaveSvg } from "svgIcons/svg-icons";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const { store, events, effects } = effector;

const { Option } = Select;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const CatalogSingleFilter = () => {
  const $catalogBranches = useStore(store.$catalogBranches);
  const $categoriesSingle = useStore(store.$categoriesSingle);
  const $categoriesSingleFilterProps = useStore(
    store.$categoriesSingleFilterProps
  );
  const $selectedCategoriesSingle = useStore(store.$selectedCategoriesSingle);
  const $saveCategoriesSingleToBranch = useStore(
    store.$saveCategoriesSingleToBranch
  );

  useEffect(() => {
    // effects.getCatalogBranchesEffect({
    //   orderBy: "id",
    //   size: 10,
    // });
    effects.getCatalogBranchesEffect();
  }, []);

  useEffect(() => {
    if ($saveCategoriesSingleToBranch.success) {
      openNotificationWithIcon("success", "Категории добавлены");
      events.resetSaveCategoriesSingleToBranchEvent();
    }
  }, [$saveCategoriesSingleToBranch.success]);

  useEffect(() => {
    if (
      $catalogBranches.data?.length &&
      !Object.keys($categoriesSingleFilterProps).length
    ) {
      events.updateCategoriesSingleFilterPropsEvent({
        branchId: $catalogBranches.data[0].id,
      });
    }
  }, [$catalogBranches.data]);

  const onBranchesChange = (prop, value) => {
    events.updateCategoriesSingleFilterPropsEvent({
      [prop]: value,
    });

    events.resetSelectedCategoriesSingleEvent();
  };

  const onBranchesSearch = (value) => {
    updateFilterSearch(() => {
      effects.getCatalogBranchesEffect({
        orderBy: "id",
        search: value,
      });
    });
  };

  const getCheckedItems = (
    menu,
    enabledArr = [],
    disabledArr = [],
    level = 1
  ) => {
    (Array.isArray(menu) ? menu : []).forEach((item) => {
      if ($selectedCategoriesSingle.includes(item.id) && !item.enabled) {
        enabledArr.push({ id: item.id, name: item.name });
      }

      if (!$selectedCategoriesSingle.includes(item.id) && item.enabled) {
        disabledArr.push(item.id);
      }

      if (item.children) {
        getCheckedItems(item.children, enabledArr, disabledArr);
      }
    });

    if (level) {
      return {
        disabledCategories: disabledArr,
        enabledCategories: enabledArr,
      };
    }
  };

  const onSaveCategoriesSingleToBranch = () => {
    const categoriesFields = getCheckedItems($categoriesSingle.data);

    effects.saveCategoriesSingleToBranchEffect({
      branchId: $categoriesSingleFilterProps.branchId,
      ...categoriesFields,
    });
  };

  return (
    <div className="catalog-single__row">
      <div className="catalog__filter">
        <div className="catalog__filter__item">
          <Select
            showSearch
            className="custom-select"
            placeholder="Выберите филиал"
            value={
              $catalogBranches.data?.length
                ? $categoriesSingleFilterProps.branchId
                : undefined
            }
            onSearch={onBranchesSearch}
            onChange={(branchId) => onBranchesChange("branchId", branchId)}
            filterOption={false}
            defaultActiveFirstOption={false}
          >
            {$catalogBranches.data?.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="catalog-single__action">
        <Button
          loading={$saveCategoriesSingleToBranch.loading}
          onClick={onSaveCategoriesSingleToBranch}
          className="custom-button primary-button onlyicon"
        >
          <SaveSvg />
        </Button>
      </div>
    </div>
  );
};
