import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Button, Pagination, Table } from "antd";

import effector from "../effector";

import { ArrowSvg } from "svgIcons/svg-icons";

const { stores, events, effects } = effector;

export const AggregationPrint = (props) => {
  const $incomeList = useStore(stores.$incomeList);
  const $incomeFilterProps = useStore(stores.$incomeFilterProps);

  const { data: incomeData, loading } = $incomeList;
  const { content: incomeList, totalElements: incomeTotal, size: incomePageSize, number: incomePageNumber } = incomeData;

  useEffect(() => {
    effects.getWarehouseStockListEffect({
      ...$incomeFilterProps,
      orderBy: "id"
    });
  }, [$incomeFilterProps]);

  return (
    <>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left" onClick={() => props.history.goBack()}>
            <ArrowSvg />
          </Button>
          <h1>print</h1>
        </div>
      </div>
      <div className="site-content__in">
        aggregation print
      </div>
    </>
  )
};