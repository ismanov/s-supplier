import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Radio, Spin } from "antd";

import effector from "../effector";

import { formatPriceProduct } from "helpers/format-price";

const { stores, effects, events } = effector;

export const DashboardMainTopProducts = () => {
  const $ordersTopProducts = useStore(stores.$ordersTopProducts);
  const $ordersTopProductsFilterProps = useStore(stores.$ordersTopProductsFilterProps);

  useEffect(() => {
    // effects.getOrdersTopProductsEffect($ordersTopProductsFilterProps.type);
  }, [$ordersTopProductsFilterProps]);

  const onTypeChange = (e) => {
    const type = e.target.value;

    events.updateOrdersTopProductsFilterPropsEvent({
      type
    })
  };

  const products = $ordersTopProducts.data.map((product, index) => {
    return (
      <div className="dashboard-main__bottom__item-list__item" key={product.id}>
        <div className="dashboard-main__bottom__item-list__item-left">
          <div className="dashboard-main__bottom__item-list__item-left-number">
            {index + 1}
          </div>
          <div className="dashboard-main__bottom__item-list__item-left-name">
            {product.name}
          </div>
        </div>
        <div className="dashboard-main__bottom__item-list__item-right">
          {product.totalCount > 0 ?
            product.totalCount
           :
            `${formatPriceProduct(product.totalSales)} сум`
          }
        </div>
      </div>
    )
  });

  return (
    <div className="dashboard-main__bottom__item">
      {$ordersTopProducts.loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>}
      <div className="dashboard-main__bottom__item-title">
        <div className="s1">Лидеры продаж</div>
        <div>
          <Radio.Group onChange={onTypeChange} value={$ordersTopProductsFilterProps.type}>
            <Radio value="AMOUNT">По заказам</Radio>
            <Radio value="COUNT">По кол-ву</Radio>
          </Radio.Group>
        </div>
      </div>
      <div className="dashboard-main__bottom__item-list">
        {products}
      </div>
    </div>
  )
};