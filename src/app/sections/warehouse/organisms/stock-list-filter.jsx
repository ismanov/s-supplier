import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Button, DatePicker, Input, Select, Tooltip } from "antd";

import effector from "../effector";
import userEffector from "../../user/effector";

import { debounce } from "helpers/debounce";

import { CloseModalSvg, SearchSvg } from "svgIcons/svg-icons";
import { DATE_FORMAT } from "../../../screens/main/constants";
import moment from "moment";

const { stores, events, effects } = effector;
const { store: userStore, effects: userEffects } = userEffector;

const { Option } = Select;
const { RangePicker } = DatePicker;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const StockListFilter = () => {
  const $stockFilterProps = useStore(stores.$stockFilterProps);
  const $wareHousesItems = useStore(stores.$wareHousesItems);
  const $suppliersItems = useStore(stores.$suppliersItems);
  const { $branchesItems } = useStore(userStore);

  useEffect(() => {
    effects.getWarehouseListLookupEffect();
    userEffects.getBranchesItemsEffect();
    effects.getSuppliersItemsEffect();
  }, [])

  const onFilterSearchChange = (field, value) => {
    if (field === "branchId") effects.getWarehouseListLookupEffect({ branchId: value })
    updateFilterSearch(() => {
      events.updateStockFilterPropsEvent({
        ...$stockFilterProps,
        [field]: value
      })
    });
  };

  const onSupplierSearch = (search) => {
    updateFilterSearch(() => {
      effects.getSuppliersItemsEffect({ search });
    });
  };

  const onChangeRange = (values) => {
    const from = moment(values[0]).format();
    const to = moment(values[1]).format();
    updateFilterSearch(() => {
      events.updateStockFilterPropsEvent({
        ...$stockFilterProps,
        from,
        to
      })
    });
  }

  const fromValue = $stockFilterProps.from ? moment($stockFilterProps.from) : null;
  const toValue = $stockFilterProps.to ? moment($stockFilterProps.to) : null;

  const warehouseOptions = ($wareHousesItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>{item.name}</Option>
  ));

  const branchOptions = ($branchesItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>{item.name}</Option>
  ));

  const clientsOptions = ($suppliersItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name}
    </Option>
  ));
  return (
    <div className="filter-block">
      <div className="filter-block__item filter-search">
        <div className="filter-search__icon">
          <SearchSvg/>
        </div>
        <Input
          placeholder="Поиск"
          value={$stockFilterProps.search}
          onChange={({ target: { value } }) => onFilterSearchChange("search", value)}
        />
      </div>
      <div className="filter-block__item filter-search">
        <Select
          className="custom-select"
          placeholder="Выберите склад"
          value={$stockFilterProps.warehouseId}
          onChange={(value) => onFilterSearchChange("warehouseId", value)}
          allowClear
        >
          {warehouseOptions}
        </Select>
      </div>
      <div className="filter-block__item filter-search">
        <Select
          className="custom-select"
          placeholder="Выберите филиал"
          value={$stockFilterProps.branchId}
          onChange={(value) => onFilterSearchChange("branchId", value)}
          allowClear
        >
          {branchOptions}
        </Select>
      </div>
      <div className="filter-block__item filter-search">
        <Select
          className="custom-select"
          placeholder="Выберите поставщика"
          value={$stockFilterProps.supplierId}
          onChange={(value) => onFilterSearchChange("supplierId", value)}
          showSearch
          onSearch={onSupplierSearch}
          filterOption={(
            input,
            option
          ) =>
            option.children
              .toLowerCase()
              .indexOf(
                input.toLowerCase()
              ) >= 0
          }
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
          <Button className="custom-button onlyicon success-button" onClick={events.resetStockFilterPropsEvent}>
            <CloseModalSvg/>
          </Button>
        </Tooltip>
      </div>
    </div>
  )
};