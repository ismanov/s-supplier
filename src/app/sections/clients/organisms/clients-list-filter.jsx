import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Button, Input, Select, Tooltip } from "antd";

import effector from "../effector";

import { debounce } from "helpers/debounce";

import { CloseModalSvg, SearchSvg } from "svgIcons/svg-icons";

const { store, events, effects } = effector;

const { Option } = Select;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const ClientsListFilter = () => {
  const { $clientsFilterProps } = useStore(store);

  const [ searchValue, setSearchValue ] = useState($clientsFilterProps.search);

  const onFilterSearchChange = (e) => {
    const value = e.target.value;

    setSearchValue(value);
    updateFilterSearch(() => {
      events.updateClientsFilterPropsEvent({
        page: 0,
        search: value
      });
    });
  };

  const onFilterChange = (prop, value) => {
    events.updateClientsFilterPropsEvent({
      page: 0,
      [prop]: value
    });
  };

  const onResetFilter = () => {
    setSearchValue("");
    events.resetClientsFilterPropsEvent();
  };

  return (
    <div className="filter-block">
      <div className="filter-block__item filter-search">
        <div className="filter-search__icon">
          <SearchSvg />
        </div>
        <Input
          placeholder='Поиск по клиентам'
          value={searchValue}
          onChange={onFilterSearchChange}
        />
      </div>
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