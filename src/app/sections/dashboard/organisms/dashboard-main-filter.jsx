import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { DatePicker, Select, Button, Tooltip, Tabs } from "antd";
import moment from "moment";
import { debounce } from "helpers/debounce";

import effector from "../effector";

import { CloseModalSvg } from "svgIcons/svg-icons";

const { stores, events, effects } = effector;

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

moment.locale('ru');

const dateFormat = 'YYYY-MM-DDTHH:mm';
const dateFormat2 = 'YYYY-MM-DD';

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const DashboardMainFilter = () => {
  const $ordersChartFilterProps = useStore(stores.$ordersChartFilterProps);
  const $ordersCustomers = useStore(stores.$ordersCustomers);

  useEffect(() => {
    // effects.getOrdersCustomersEffect();
  }, []);

  const onFilterChange = (prop, val) => {
    events.updateOrdersChartFilterPropsEvent({
      [prop]: val
    })
  };

  const onTabChange = (key) => {
    const val = key === "ALL" ? undefined : key;

    onFilterChange("status", val);
  };

  const onCustomersSearch = (value) => {
    updateFilterSearch(() => {
      effects.getOrdersCustomersEffect({
        search: value
      });
    });
  };

  const onCustomerChange = (value) => {
    const customerId = value === "ALL" ? undefined : value;

    onFilterChange("customerId", customerId);
  };

  const onDateRange = (date, arr) => {
    let from;
    let to;
    if (date && date.length === 2) {
      from = `${arr[0]}`;
      to = `${arr[1]}`;
    }

    events.updateOrdersChartFilterPropsEvent({
      from: date ? moment(from).format(dateFormat) : moment().subtract(1, 'month').startOf('day').format(dateFormat),
      to: date ? moment(to).endOf('day').format(dateFormat) : moment().endOf('day').format(dateFormat)
    });
  };

  const fromDateValue = $ordersChartFilterProps.from ? moment($ordersChartFilterProps.from) : null;
  const toDateValue = $ordersChartFilterProps.to ? moment($ordersChartFilterProps.to, dateFormat2, false) : null;

  const onResetFilter = () => {
    events.resetOrdersChartFilterPropsEvent();
  };

  return (
    <>
      <div className="filter-block">
        <div className="filter-block__item">
          <div className="custom-calendar-range-picker">
            <RangePicker
              {...($ordersChartFilterProps ? {value: [fromDateValue, toDateValue]} : {})}
              onChange={onDateRange}
              format={dateFormat2}
            />
          </div>
        </div>
        <div className="filter-block__item">
          <Select
            showSearch
            className="custom-select"
            value={$ordersChartFilterProps.customerId ? $ordersChartFilterProps.customerId : "ALL"}
            onSearch={onCustomersSearch}
            onChange={onCustomerChange}
            filterOption={false}
            defaultActiveFirstOption={false}
          >
            <Option value="ALL">Все клиенты</Option>
            {$ordersCustomers.data.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
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
      <div className="m-b-15">
        <Tabs
          activeKey={$ordersChartFilterProps.status ? $ordersChartFilterProps.status : "ALL"}
          onChange={onTabChange}
        >
          <TabPane tab="Все заказы" key="ALL">
          </TabPane>
          <TabPane tab="Новые" key="NEW">
          </TabPane>
          <TabPane tab="В процессе" key="IN_PROGRESS">
          </TabPane>
          <TabPane tab="Завершенные" key="COMPLETED">
          </TabPane>
          <TabPane tab="Отмененные" key="REJECTED">
          </TabPane>
        </Tabs>
      </div>
    </>
  )
};