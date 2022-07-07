import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Button, DatePicker, Input, Select, Tooltip } from "antd";

import effector from "../effector";
import clientEffector from "../../clients/effector";

import { debounce } from "helpers/debounce";

import { CloseModalSvg, SearchSvg } from "svgIcons/svg-icons";
import { DATE_FORMAT } from "../../../screens/main/constants";
import moment from "moment";

const { stores, events, effects } = effector;
const {
  store: clientStore,
  events: clientEvents,
  effects: clientEffects,
} = clientEffector;

const { Option } = Select;
const { RangePicker } = DatePicker;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const ShipmentListFilter = () => {
  const $shipmentFilterProps = useStore(stores.$shipmentFilterProps);
  const $wareHousesItems = useStore(stores.$wareHousesItems);
  const { $clientsItems } = useStore(clientStore);

  useEffect(() => {
    effects.getWarehouseListLookupEffect();
    clientEffects.getClientsItemsEffect();
  }, []);

  const onFilterSearchChange = (field, value) => {
    updateFilterSearch(() => {
      events.updateShipmentFilterPropsEvent({
        ...$shipmentFilterProps,
        [field]: value,
      });
    });
  };

  const onClientSearch = (search) => {
    updateFilterSearch(() => {
      clientEffects.getClientsItemsEffect({ search });
    });
  };

  const onChangeRange = (values) => {
    const from = moment(values[0]).format();
    const to = moment(values[1]).format();
    updateFilterSearch(() => {
      events.updateShipmentFilterPropsEvent({
        ...$shipmentFilterProps,
        from,
        to,
      });
    });
  };

  const fromValue = $shipmentFilterProps.from
    ? moment($shipmentFilterProps.from)
    : null;
  const toValue = $shipmentFilterProps.to
    ? moment($shipmentFilterProps.to)
    : null;

  const warehouseOptions = ($wareHousesItems.data || []).map((branch) => (
    <Option key={branch.id} value={branch.id}>
      {branch.name}
    </Option>
  ));

  const clientsOptions = ($clientsItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name}
    </Option>
  ));

  return (
    <div className="filter-block">
      <div className="filter-block__item filter-search">
        <div className="filter-search__icon">
          <SearchSvg />
        </div>
        <Input
          placeholder="Поиск"
          onChange={({ target: { value } }) =>
            onFilterSearchChange("search", value)
          }
        />
      </div>
      <div className="filter-block__item">
        <Select
          className="custom-select"
          placeholder="Выберите склад"
          value={$shipmentFilterProps.warehouseId}
          onChange={(value) => onFilterSearchChange("warehouseId", value)}
          allowClear
        >
          {warehouseOptions}
        </Select>
      </div>
      <div className="filter-block__item">
        <Select
          className="custom-select"
          placeholder="Выберите клиента"
          value={$shipmentFilterProps.customerId}
          onChange={(value) => onFilterSearchChange("customerId", value)}
          onSearch={onClientSearch}
          showSearch
          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          allowClear
        >
          {clientsOptions}
        </Select>
      </div>
      <div className="filter-block__item filter-search">
        <RangePicker
          value={[fromValue, toValue]}
          onChange={onChangeRange}
          format={DATE_FORMAT}
        />
      </div>
      <div className="filter-block__item">
        <Tooltip placement="topRight" title="Сбросить">
          <Button
            className="custom-button onlyicon success-button"
            onClick={events.resetShipmentFilterPropsEvent}
          >
            <CloseModalSvg />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
