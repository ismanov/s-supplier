import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Button, Input, Select, Tooltip } from "antd";

import ordersEffector from "../../orders/effector";
import effector from "../effector";

import { debounce } from "helpers/debounce";

import { CloseModalSvg, SearchSvg } from "svgIcons/svg-icons";

const { store: ordersStore, effects: ordersEffects } = ordersEffector;
const { store, effects, events } = effector;

const { Option } = Select;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const ClientOrdersFilter = () => {
  const { $orderStatusItems } = useStore(ordersStore);
  const { $clientOrdersFilterProps, $clientOrderSubStatusItems } = useStore(store);

  const [ searchValue, setSearchValue ] = useState($clientOrdersFilterProps.search);

  useEffect(() => {
    ordersEffects.getOrderStatusItemsEffect()
  }, []);

  const onFilterSearchChange = (e) => {
    const value = e.target.value;

    setSearchValue(value);
    updateFilterSearch(() => {
      events.updateClientOrdersFilterPropsEvent({
        page: 0,
        search: value
      });
    });
  };

  const onStatusChange = (groupStatus) => {
    if (groupStatus) {
      effects.getClientOrderSubStatusItemsEffect(groupStatus);
    } else {
      events.resetClientOrderSubStatusItemsEvent();
    }

    events.updateClientOrdersFilterPropsEvent({
      page: 0,
      groupStatus
    });
  };

  const onSubStatusChange = (status) => {
    events.updateClientOrdersFilterPropsEvent({
      page: 0,
      status: status === "ALL" ? undefined : status
    });
  };

  const getSubStatusValue = () => {
    let value = undefined;
    const { status, groupStatus } = $clientOrdersFilterProps;
    const subItems = $clientOrderSubStatusItems.data;

    if (status) {
      value = status;
    } else if (groupStatus) {
      if (subItems.length === 1) {
        value = subItems[0].code;
      } else {
        value = "ALL";
      }
    }

    return value;
  };

  const onResetFilter = () => {
    setSearchValue("");
    events.resetClientOrdersFilterPropsEvent();
  };

  return (
    <div className="filter-block">
      <div className="filter-block__item filter-search">
        <div className="filter-search__icon">
          <SearchSvg />
        </div>
        <Input
          placeholder='Поиск по заказам'
          value={searchValue}
          onChange={onFilterSearchChange}
        />
      </div>
      <div className="filter-block__item">
        <Select
          className="custom-select"
          placeholder='Выберите статус'
          value={$clientOrdersFilterProps.groupStatus}
          onChange={onStatusChange}
          allowClear
        >
          {$orderStatusItems.data.map((item) => <Option value={item.code} key={item.code}>{item.nameRu}</Option>)}
        </Select>
      </div>
      <div className="filter-block__item">
        <Select
          disabled={!$clientOrdersFilterProps.groupStatus || $clientOrderSubStatusItems.data.length < 2}
          loading={$clientOrderSubStatusItems.loading}
          className="custom-select"
          placeholder='Выберите под-статус'
          value={getSubStatusValue()}
          onChange={onSubStatusChange}
          allowClear
        >
          <Option value="ALL">Все</Option>
          {$clientOrderSubStatusItems.data.map((item) => <Option value={item.code} key={item.code}>{item.nameRu}</Option>)}
        </Select>
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