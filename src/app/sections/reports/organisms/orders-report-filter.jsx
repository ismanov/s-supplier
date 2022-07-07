import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Input, DatePicker, Select, Button, Tooltip } from "antd";
import moment from "moment";

import effector from "../effector";

import { debounce } from "helpers/debounce";

import { CloseModalSvg, SearchSvg, SettingsSvg } from "svgIcons/svg-icons";

const { store, events, effects } = effector;

const { Option } = Select;

const { RangePicker } = DatePicker;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

moment.locale('ru');

const dateFormat = 'YYYY-MM-DDTHH:mm';
const dateFormat2 = 'YYYY-MM-DD';

export const OrdersReportFilter = () => {
  const { $ordersReportFilterProps, $orderReportsStatusItems, $orderReportSubStatusItems } = useStore(store);

  const [ searchValue, setSearchValue ] = useState($ordersReportFilterProps.search);

  useEffect(() => {
    effects.getOrderReportsStatusItemsEffect();
  }, []);

  const onDateRange = (date, arr) => {
    let from;
    let to;
    if (date && date.length === 2) {
      from = `${arr[0]}`;
      to = `${arr[1]}`;
    }

    events.updateOrdersReportFilterPropsEvent({
      page: 0,
      from: date ? moment(from).format(dateFormat) : null,
      to: date ? moment(to).endOf('day').format(dateFormat) : null
    });
  };

  const onFilterSearchChange = (e) => {
    const value = e.target.value;

    setSearchValue(value);
    updateFilterSearch(() => {
      events.updateOrdersReportFilterPropsEvent({
        page: 0,
        search: value
      });
    });
  };

  const fromDateValue = $ordersReportFilterProps.from ? moment($ordersReportFilterProps.from) : null;
  const toDateValue = $ordersReportFilterProps.to ? moment($ordersReportFilterProps.to, dateFormat2, false) : null;

  const onStatusChange = (groupStatus) => {
    if (groupStatus) {
      effects.getOrderReportSubStatusItemsEffect(groupStatus);
    } else {
      events.resetOrderReportSubStatusItemsEvent();
    }

    events.updateOrdersReportFilterPropsEvent({
      page: 0,
      groupStatus,
      status: undefined
    });
  };

  const onSubStatusChange = (status) => {
    events.updateOrdersReportFilterPropsEvent({
      page: 0,
      status: status === "ALL" ? undefined : status
    });
  };

  const getSubStatusValue = () => {
    let value = undefined;
    const { status, groupStatus } = $ordersReportFilterProps;
    const subItems = $orderReportSubStatusItems.data;

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
    events.resetOrdersReportFilterPropsEvent();
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
        <div className="custom-calendar-range-picker">
          <RangePicker
            {...($ordersReportFilterProps ? {value: [fromDateValue, toDateValue]} : {})}
            onChange={onDateRange}
            format={dateFormat2}
          />
        </div>
      </div>
      <div className="filter-block__item">
        <Select
          className="custom-select"
          placeholder='Выберите статус'
          value={$ordersReportFilterProps.groupStatus}
          onChange={onStatusChange}
          allowClear
        >
          {$orderReportsStatusItems.data.map((item) => <Option value={item.code} key={item.code}>{item.nameRu}</Option>)}
        </Select>
      </div>
      <div className="filter-block__item">
        <Select
          disabled={!$ordersReportFilterProps.groupStatus || $orderReportSubStatusItems.data.length < 2}
          loading={$orderReportSubStatusItems.loading}
          className="custom-select"
          placeholder='Выберите под-статус'
          value={getSubStatusValue()}
          onChange={onSubStatusChange}
          allowClear
        >
          <Option value="ALL">Все</Option>
          {$orderReportSubStatusItems.data.map((item) => <Option value={item.code} key={item.code}>{item.nameRu}</Option>)}
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