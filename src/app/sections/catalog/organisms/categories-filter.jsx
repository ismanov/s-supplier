import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Input, Select, Button, Tooltip } from "antd";

import effector from "../effector";

import { debounce } from "helpers/debounce";
import { SearchSvg, HintSvg } from "svgIcons/svg-icons";

const { store, events, effects } = effector;

const { Option } = Select;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const CategoriesFilter = () => {
  const $catalogBranches = useStore(store.$catalogBranches);
  const $categoriesFilterProps = useStore(store.$categoriesFilterProps);
  const $categoriesSearch = useStore(store.$categoriesSearch);

  const [branchSearchValue, setBranchSearchValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if ($categoriesSearch === null) {
      setSearchValue("");
    }
  }, [$categoriesSearch]);

  useEffect(() => {
    if (
      $catalogBranches.data?.length &&
      !Object.keys($categoriesFilterProps).length
    ) {
      events.updateCategoriesFilterPropsEvent({
        branchId: $catalogBranches.data[0].id,
      });
    }
  }, [$catalogBranches.data]);

  useEffect(() => {
    effects.getCatalogBranchesEffect({
      orderBy: "id",
      size: 10,
    });

    return () => {
      events.resetCatalogBranchesEvent();
    };
  }, []);

  const onBranchesChange = (prop, value) => {
    const data = {
      [prop]: value,
    };

    events.updateCategoriesFilterPropsEvent(data);
    events.resetProductListEvent();
  };

  const onBranchesSelect = () => {
    if (branchSearchValue) {
      setBranchSearchValue("");

      effects.getCatalogBranchesEffect({
        orderBy: "id",
        size: 10,
      });
    }
  };

  const onBranchesSearch = (value) => {
    updateFilterSearch(() => {
      setBranchSearchValue(value);

      effects.getCatalogBranchesEffect({
        orderBy: "id",
        search: value,
        size: 10,
      });
    });
  };

  const onFilterSearchChange = (e) => {
    const value = e.target.value;

    setSearchValue(value);
    updateFilterSearch(() => {
      events.updateCategoriesSearchEvent(value);
    });
  };

  return (
    <div className="catalog__filter-row">
      <div className="catalog__filter">
        <div className="catalog__filter__item with-tooltip">
          <Tooltip
            trigger="click"
            placement="topRight"
            title="Воспользуйтесь функционалом поиска если нужный филиал не отображается в списке, для этого введите минимум 3 символа"
          >
            <Button className="hint-btn">
              <HintSvg />
            </Button>
          </Tooltip>
          <Select
            showSearch
            className="custom-select"
            placeholder="Выберите филиал"
            value={$categoriesFilterProps.branchId}
            onSearch={onBranchesSearch}
            onSelect={onBranchesSelect}
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
        <div className="catalog__filter__item filter-search">
          <div className="filter-search__icon">
            <SearchSvg />
          </div>
          <Input
            placeholder="Поиск по категориям"
            value={searchValue}
            onChange={onFilterSearchChange}
          />
        </div>
      </div>
    </div>
  );
};
