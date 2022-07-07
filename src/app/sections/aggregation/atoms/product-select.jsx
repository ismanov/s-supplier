import React, { useEffect } from "react";
import { Select } from "antd";

import { debounce } from "helpers/debounce";

const withDebounce = debounce((action) => {
  action();
}, 400);


export const ProductSelect = (props) => {
  const { returnItem, onChange, showSearch = true, getProductsItems, productsItems, ...restProps } = props;

  useEffect(() => {
    getProductsItems()
  }, []);

  const onSearch = (search) => {
    if (search.length >= 3 || search.length === 0) {
      withDebounce(() => {
        getProductsItems({ search });
      });
    }
  };

  const onChangeProduct = (productId, option) => {
    if (returnItem) {
      const product = productId && productsItems.data.find((item) => item.id === productId);

      onChange(productId, option, product);
    } else {
      onChange(productId, option);
    }
  };

  return (
    <Select
      showSearch
      loading={productsItems.loading}
      placeholder="Выберите продукцию"
      onSearch={onSearch}
      onChange={onChange && onChangeProduct}
      filterOption={false}
      defaultActiveFirstOption={false}
      allowClear={true}
      {...restProps}
    >
      {productsItems.data.map((item) => (
        <Select.Option value={item.id} key={item.id}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
};