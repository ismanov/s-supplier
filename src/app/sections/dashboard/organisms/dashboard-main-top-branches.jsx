import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Spin } from "antd";

import effector from "../effector";

import { formatPriceProduct } from "helpers/format-price";

const { stores, effects, events } = effector;

export const DashboardMainTopBranches = () => {
  const $ordersTopBranches = useStore(stores.$ordersTopBranches);

  useEffect(() => {
    // effects.getOrdersTopBranchesEffect();
  }, []);

  const products = $ordersTopBranches.data.map((product, index) => {
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
      {$ordersTopBranches.loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>}
      <div className="dashboard-main__bottom__item-title">
        <div className="s1">ТОП Филиалов</div>
      </div>
      <div className="dashboard-main__bottom__item-list">
        {products}
      </div>
    </div>
  )
};