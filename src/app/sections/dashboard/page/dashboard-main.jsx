import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Area } from '@ant-design/charts';

import effector from "../effector";

import { DashboardMainFilter } from "../organisms/dashboard-main-filter";
import { DashboardMainTopProducts } from "../organisms/dashboard-main-top-products";
import { DashboardMainTopBranches } from "../organisms/dashboard-main-top-branches";
import { chartConfig } from "../atoms/chart-config";

import "../styles.scss";

const { stores, effects, events } = effector;

export const DashboardMain = () => {
  const $ordersChart = useStore(stores.$ordersChart);
  const $ordersChartFilterProps = useStore(stores.$ordersChartFilterProps);

  useEffect(() => {
    // effects.getOrdersChartEffect($ordersChartFilterProps);
  }, [$ordersChartFilterProps]);

  const amountData = $ordersChart.data.map((order) => {
    return {
      item: order.date,
      value: order.totalAmount,
      totalCount: order.totalCount
    }
  });

  return (
    <>
      <h1>Главная</h1>
      <div className="dashboard-main__top">
        <div className="charts-head">Заказы</div>
        <DashboardMainFilter />
        <div className="charts-wrap">
          <Area loading={$ordersChart.loading} data={amountData.length ? amountData : [{}]} {...chartConfig} />
        </div>
      </div>
      <div className="dashboard-main__bottom">
        <DashboardMainTopProducts />
        <DashboardMainTopBranches />
      </div>
    </>
  )
};