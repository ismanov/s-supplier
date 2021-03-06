import React, { useState } from "react";
import { useStore } from "effector-react";
import { Input, DatePicker, Select, Button, Tooltip } from "antd";
import moment from "moment";

import effector from "../effector";

import { debounce } from "helpers/debounce";

import { CloseModalSvg, SearchSvg } from "svgIcons/svg-icons";

const { store, events, effects } = effector;

const { Option } = Select;

const { RangePicker } = DatePicker;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

moment.locale('ru');

const dateFormat = 'YYYY-MM-DDTHH:mm';
const dateFormat2 = 'YYYY-MM-DD';

export const ClientsReportFilter = () => {
  const { $clientsReportFilterProps } = useStore(store);

  const [ searchValue, setSearchValue ] = useState($clientsReportFilterProps.search);

  const onDateRange = (date, arr) => {
    let from;
    let to;
    if (date && date.length === 2) {
      from = `${arr[0]}`;
      to = `${arr[1]}`;
    }

    events.updateClientsReportFilterPropsEvent({
      page: 0,
      from: date ? moment(from).format(dateFormat) : null,
      to: date ? moment(to).endOf('day').format(dateFormat) : null
    });
  };

  const onFilterSearchChange = (e) => {
    const value = e.target.value;

    setSearchValue(value);
    updateFilterSearch(() => {
      events.updateClientsReportFilterPropsEvent({
        page: 0,
        search: value
      });
    });
  };

  const fromDateValue = $clientsReportFilterProps.from ? moment($clientsReportFilterProps.from) : null;
  const toDateValue = $clientsReportFilterProps.to ? moment($clientsReportFilterProps.to, dateFormat2, false) : null;

  const onResetFilter = () => {
    setSearchValue("");
    events.resetClientsReportFilterPropsEvent();
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
        <div className="custom-calendar-range-picker">
          <RangePicker
            {...($clientsReportFilterProps ? {value: [fromDateValue, toDateValue]} : {})}
            onChange={onDateRange}
            format={dateFormat2}
          />
        </div>
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