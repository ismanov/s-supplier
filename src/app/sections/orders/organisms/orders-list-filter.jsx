import React, {useState, useEffect} from "react";
import {useStore} from "effector-react";
import {Input, DatePicker, Select, Button, Tooltip} from "antd";
import moment from "moment";

import effector from "../effector";
import clientEffector from "../../clients/effector";

import {debounce} from "helpers/debounce";

import {CloseModalSvg, SearchSvg} from "svgIcons/svg-icons";
import {DATE_FORMAT} from "../../../screens/main/constants";

const {store, events, effects} = effector;
const {store: clientStore, effects: clientEffects} = clientEffector;
const {Option} = Select;

const {RangePicker} = DatePicker;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

moment.locale("ru");

export const OrdersListFilter = () => {
  const {$ordersFilterProps, $orderStatusItems} = useStore(store);
  const {$clientsItems} = useStore(clientStore);
  const [searchValue, setSearchValue] = useState($ordersFilterProps.search);

  useEffect(() => {
    clientEffects.getClientsItemsEffect()
    effects.getOrderStatusItemsEffect();
  }, []);

  const onClientSearch = (search) => {
    updateFilterSearch(() => {
      clientEffects.getClientsItemsEffect({ search });
    });
  };

  const onDateRange = (values) => {
    const from = moment(values[0]).format();
    const to = moment(values[1]).format();

    events.updateOrdersFilterPropsEvent({
      page: 0,
      from,
      to
    });
  };

  const onFilterSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    updateFilterSearch(() => {
      events.updateOrdersFilterPropsEvent({
        page: 0,
        search: value
      });
    });
  };

  const fromDateValue = $ordersFilterProps.from ? moment($ordersFilterProps.from) : null;
  const toDateValue = $ordersFilterProps.to ? moment($ordersFilterProps.to) : null;

  const onChangeFilter = (field, value) => {
    events.updateOrdersFilterPropsEvent({
      page: 0,
      [field]: value
    });
  };

  const onResetFilter = () => {
    setSearchValue("");
    events.resetOrdersFilterPropsEvent();
  };

  const statusOptions = ($orderStatusItems.data || []).map((item) => (
    <Option value={item.code} key={item.code}>{item.name}</Option>
  ))
  const clientsOptions = ($clientsItems.data || []).map((client) => (
    <Option key={client.id} value={client.id}>{client.name}</Option>
  ));

  return (
    <div className="filter-block">
      <div className="filter-block__item filter-search">
        <div className="filter-search__icon">
          <SearchSvg/>
        </div>
        <Input
          placeholder="Поиск по заказам"
          value={searchValue}
          onChange={onFilterSearchChange}
        />
      </div>
      <div className="filter-block__item">
        <div className="custom-calendar-range-picker">
          <RangePicker
            {...($ordersFilterProps ? {value: [fromDateValue, toDateValue]} : {})}
            onChange={onDateRange}
            format={DATE_FORMAT}
          />
        </div>
      </div>

      <div className="filter-block__item">
        <Select
          className="custom-select"
          placeholder="Выберите клиента"
          onSearch={onClientSearch}
          showSearch
          onChange={(value) => onChangeFilter("customerId", value)}
          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          allowClear
        >
          {clientsOptions}
        </Select>
      </div>
      <div className="filter-block__item">
        <Select
          className="custom-select"
          placeholder="Выберите статус"
          value={$ordersFilterProps.status}
          onChange={(value) => onChangeFilter("status", value)}
          allowClear
        >
          {statusOptions}
        </Select>
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