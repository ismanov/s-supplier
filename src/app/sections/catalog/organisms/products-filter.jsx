import React, {useState} from "react";
import { useStore } from "effector-react";
import { Button, Input } from "antd";

import effector from "../effector";

import { SearchSvg } from "svgIcons/svg-icons";
import { UpdateProductsBatchModal } from "./update-products-batch-modal";
import { debounce } from "helpers/debounce";

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

const { store, events, effects } = effector;

export const ProductsFilter = () => {
  const $productsBatch = useStore(store.$productsBatch);
  const $productListFilterProps = useStore(store.$productListFilterProps);

  const [ productsBatchEditProps, setProductsBatchEditProps ] = useState({
    visible: false,
    shouldRender: false
  });

  const [ searchValue, setSearchValue ] = useState($productListFilterProps.search);

  const onFilterSearchChange = (e) => {
    const value = e.target.value;

    setSearchValue(value);
    updateFilterSearch(() => {
      events.updateProductListFilterPropsEvent({
        page: 0,
        search: value
      });
    });
  };

  const onUpdateProductsBatch = () => {
    setProductsBatchEditProps({ visible: true, shouldRender: true })
  };

  return (
    <div className="catalog__filter-row">
      <div className="catalog__filter">
        <div className="catalog__filter__item filter-search">
          <div className="filter-search__icon">
            <SearchSvg />
          </div>
          <Input
            disabled={!$productListFilterProps.categoryId}
            placeholder='Поиск по товарам'
            value={searchValue}
            onChange={onFilterSearchChange}
          />
        </div>
      </div>
      {$productsBatch.length > 0 &&
        <div className="products__batch">
          Выбрано товаров: {$productsBatch.length}
          <Button
            htmlType="submit"
            className="custom-button primary-button m-l-15"
            disabled={$productsBatch.length < 2}
            onClick={onUpdateProductsBatch}
          >
            Редактировать
          </Button>
        </div>
      }
      {productsBatchEditProps.shouldRender && <UpdateProductsBatchModal
        modalProps={productsBatchEditProps} setModalProps={setProductsBatchEditProps}
      />}
    </div>
  )
};