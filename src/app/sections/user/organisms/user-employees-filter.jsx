import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Button, Input, Select, Tooltip } from "antd";

import effectorMain from "../../../screens/main/effector";
import effector from "../effector";

import { debounce } from "helpers/debounce";

import { CloseModalSvg, SearchSvg } from "svgIcons/svg-icons";

const { store: mainStore } = effectorMain;
const { store, events, effects } = effector;

const { Option } = Select;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const UserEmployeesFilter = () => {
  const { $currentUser } = useStore(mainStore);
  const { $employeesFilterProps, $filterBranchesItems } = useStore(store);

  const [ searchValue, setSearchValue ] = useState($employeesFilterProps.search);

  
  useEffect(() => {
    effects.getFilterBranchesItemsEffect();
  }, []);
  
  const onFilterSearchChange = (e) => {
    const value = e.target.value;

    setSearchValue(value);
    updateFilterSearch(() => {
      events.updateEmployeesFilterPropsEvent({
        page: 0,
        search: value
      });
    });
  };

  const onFilterChange = (prop, value) => {
    events.updateEmployeesFilterPropsEvent({
      page: 0,
      [prop]: value
    });
  };

  const onBranchesSearch = (value) => {
    updateFilterSearch(() => {
      effects.getFilterBranchesItemsEffect({
        search: value
      });
    });
  };

  const onResetFilter = () => {
    setSearchValue("");
    events.resetEmployeesFilterPropsEvent();
  };

  return (
    <div className="filter-block">
      <div className="filter-block__item filter-search">
        <div className="filter-search__icon">
          <SearchSvg />
        </div>
        <Input
          placeholder='Поиск по пользователям'
          value={searchValue}
          onChange={onFilterSearchChange}
        />
      </div>
      {$currentUser.data.roles.includes("ROLE_BUSINESS_OWNER") &&
        <div className="filter-block__item">
          <Select
            showSearch
            loading={$filterBranchesItems.loading}
            className="custom-select"
            placeholder='Выберите филиал'
            onSearch={onBranchesSearch}
            value={($filterBranchesItems.data || []).length && $employeesFilterProps.branchId ? $employeesFilterProps.branchId : undefined}
            onChange={(branchId) => onFilterChange("branchId", branchId)}
            allowClear
          >
            {($filterBranchesItems.data || []).map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
          </Select>
        </div>
      }
      <div className="filter-block__item">
        <Tooltip placement="topRight" title="Сбросить">
          <Button className="custom-button onlyicon success-button" onClick={onResetFilter}>
            <CloseModalSvg />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
};