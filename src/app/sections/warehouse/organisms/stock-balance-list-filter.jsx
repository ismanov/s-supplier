import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Button, DatePicker, Input, Select, Tooltip } from "antd";

import effector from "../effector";

import { debounce } from "helpers/debounce";

import { CloseModalSvg, SearchSvg } from "svgIcons/svg-icons";

const { stores, events, effects } = effector;

const { Option } = Select;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const StockReportListFilter = () => {
  const $stockReportFilterProps = useStore(stores.$stockReportFilterProps);
  const $wareHousesItems = useStore(stores.$wareHousesItems);

  const onFilterSearchChange = (field, value) => {
    events.updateStockReportFilterPropsEvent({
      ...$stockReportFilterProps,
      [field]: value,
    });
  };

  const warehouseOptions = ($wareHousesItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name}
    </Option>
  ));
  const tempOptions = [
    { id: 1, name: "item 1" },
    { id: 2, name: "item 2" },
  ];
  return (
    <div className="filter-block">
      <div className="filter-block__item filter-search">
        <div className="filter-search__icon">
          <SearchSvg />
        </div>
        <Input
          placeholder="Название товара"
          value={$stockReportFilterProps.name}
          onChange={({ target: { value } }) =>
            onFilterSearchChange("search", value)
          }
        />
      </div>
      <div className="filter-block__item">
        <Select
          className="custom-select"
          placeholder="Выберите категории"
          value={$stockReportFilterProps.categoryId}
          onChange={(value) => onFilterSearchChange("categoryId", value)}
          allowClear
        >
          {warehouseOptions}
        </Select>
      </div>
      <div className="filter-block__item">
        <Select
          className="custom-select"
          placeholder="Выберите склад"
          value={$stockReportFilterProps.warehouseId}
          onChange={(value) => onFilterSearchChange("warehouseId", value)}
          allowClear
        >
          {warehouseOptions}
        </Select>
      </div>
      <div className="filter-block__item">
        <Select
          className="custom-select"
          placeholder="Выберите поставщика"
          value={$stockReportFilterProps.supplierId}
          onChange={(value) => onFilterSearchChange("supplierId", value)}
          allowClear
        >
          {tempOptions.map((branch) => (
            <Option key={branch.id} value={branch.id}>
              {branch.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="filter-block__item">
        <Tooltip placement="topRight" title="Сбросить">
          <Button
            className="custom-button onlyicon success-button"
            onClick={events.resetStockReportFilterPropsEvent}
          >
            <CloseModalSvg />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
