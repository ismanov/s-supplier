import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Button, DatePicker, Input, Select, Tooltip } from "antd";

import effector from "../effector";

import { debounce } from "helpers/debounce";

import { RANGE_DATE_FORMAT, RANGE_DATE_TIME_FORMAT } from "../../../screens/main/constants";
import { CloseModalSvg, SearchSvg } from "svgIcons/svg-icons";
import moment from "moment";

const { store, events, effects } = effector;

const { Option } = Select;
const { RangePicker } = DatePicker;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const AggregationListFilter = () => {
  const $aggregationsFilterProps = useStore(store.$aggregationsFilterProps);
  const $aggregationProductsFilterItems = useStore(store.$aggregationProductsFilterItems);
  const $aggregationStatusesItems = useStore(store.$aggregationStatusesItems);

  const [ searchValue, setSearchValue ] = useState($aggregationsFilterProps.search);

  useEffect(() => {
    if (!$aggregationProductsFilterItems.data.length) {
      effects.getAggregationProductsFilterItemsEffect();
    }

    effects.getAggregationStatusesItemsEffect();
  }, []);

  const onFilterChange = (prop, value) => {
    events.updateAggregationsFilterPropsEvent({
      page: 0,
      [prop]: value
    });
  };

  const onFilterSearchChange = (e) => {
    const value = e.target.value;

    setSearchValue(value);
    updateFilterSearch(() => {
      onFilterChange("search", value);
    });
  };


  const onProductSearch = (value) => {
    updateFilterSearch(() => {
      effects.getAggregationProductsFilterItemsEffect({
        search: value,
      });
    });
  };

  const onResetFilter = () => {
    setSearchValue("");
    events.resetAggregationsFilterPropsEvent();
  };

  const onDateRange = (date, arr) => {
    let from;
    let to;
    if (date && date.length === 2) {
      from = `${arr[0]}`;
      to = `${arr[1]}`;
    }

    events.updateAggregationsFilterPropsEvent({
      page: 0,
      from: date ? moment(from).format(RANGE_DATE_TIME_FORMAT) : null,
      to: date ? moment(to).endOf('day').format(RANGE_DATE_TIME_FORMAT) : null
    })
  };

  const fromDateValue = $aggregationsFilterProps.from ? moment($aggregationsFilterProps.from) : null;
  const toDateValue = $aggregationsFilterProps.to ? moment($aggregationsFilterProps.to, RANGE_DATE_FORMAT, false) : null;

  return (
    <div className="filter-block">
      <div className="filter-block__item filter-search">
        <div className="filter-search__icon">
          <SearchSvg/>
        </div>
        <Input
          placeholder='Поиск'
          value={searchValue}
          onChange={onFilterSearchChange}
        />
      </div>
      <div className="filter-block__item">
        <Select
          showSearch
          allowClear
          className="custom-select"
          placeholder="Выберите товар"
          value={$aggregationsFilterProps.productId}
          onSearch={onProductSearch}
          onChange={(productId) => onFilterChange("productId", productId)}
          filterOption={false}
          defaultActiveFirstOption={false}
        >
          {$aggregationProductsFilterItems.data.map((item) => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="filter-block__item">
        <Select
          allowClear
          className="custom-select"
          placeholder="Выберите статус"
          value={$aggregationsFilterProps.status}
          onChange={(status) => onFilterChange("status", status)}
          dropdownMatchSelectWidth={false}
        >
          {$aggregationStatusesItems.data.map((item) => (
            <Option value={item.code} key={item.code}>
              {item.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="filter-block__item">
        <div className="custom-calendar-range-picker">
          <RangePicker
            {...($aggregationsFilterProps ? {value: [fromDateValue, toDateValue]} : {})}
            onChange={onDateRange}
            format={RANGE_DATE_FORMAT}
          />
        </div>
      </div>
      <div className="filter-block__item">
        <Tooltip placement="topRight" title="Сбросить">
          <Button className="custom-button onlyicon success-button" onClick={onResetFilter}>
            <CloseModalSvg/>
          </Button>
        </Tooltip>
      </div>
    </div>
  )
};