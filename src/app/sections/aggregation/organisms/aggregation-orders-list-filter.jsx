import React, { useState } from "react";
import { useStore } from "effector-react";
import { Button, DatePicker, Input, Tooltip } from "antd";

import effector from "../effector";

import { debounce } from "helpers/debounce";

import { RANGE_DATE_FORMAT, RANGE_DATE_TIME_FORMAT } from "../../../screens/main/constants";
import { CloseModalSvg, SearchSvg } from "svgIcons/svg-icons";
import moment from "moment";

const { store, events, effects } = effector;


const { RangePicker } = DatePicker;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const AggregationOrdersListFilter = () => {
  const $aggregationsOrdersFilterProps = useStore(store.$aggregationsOrdersFilterProps);

  const [ searchValue, setSearchValue ] = useState($aggregationsOrdersFilterProps.search);

  const onFilterChange = (prop, value) => {
    events.updateAggregationsOrdersFilterPropsEvent({
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

  const onResetFilter = () => {
    setSearchValue("");
    events.resetAggregationsOrdersFilterPropsEvent();
  };

  const onDateRange = (date, arr) => {
    let from;
    let to;
    if (date && date.length === 2) {
      from = `${arr[0]}`;
      to = `${arr[1]}`;
    }

    events.updateAggregationsOrdersFilterPropsEvent({
      page: 0,
      from: date ? moment(from).format(RANGE_DATE_TIME_FORMAT) : null,
      to: date ? moment(to).endOf('day').format(RANGE_DATE_TIME_FORMAT) : null
    })
  };

  const fromDateValue = $aggregationsOrdersFilterProps.from ? moment($aggregationsOrdersFilterProps.from) : null;
  const toDateValue = $aggregationsOrdersFilterProps.to ? moment($aggregationsOrdersFilterProps.to, RANGE_DATE_FORMAT, false) : null;

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
        <div className="custom-calendar-range-picker">
          <RangePicker
            {...($aggregationsOrdersFilterProps ? {value: [fromDateValue, toDateValue]} : {})}
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