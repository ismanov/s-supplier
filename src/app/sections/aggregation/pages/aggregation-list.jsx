import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Button, Pagination, Table } from "antd";

import effector from "../effector";

import { ArrowSvg } from "svgIcons/svg-icons";
import { AggregationListFilter } from "../organisms/aggregation-list-filter";
import Moment from "react-moment";

const { store, events, effects } = effector;

const columns = [
  {
    title: '№',
    dataIndex: 'number',
    width: 50
  },
  {
    title: 'Код маркировки GS 128',
    dataIndex: 'printCode',
  },
  {
    title: 'Наименование продукта',
    dataIndex: 'productName',
  },
  {
    title: "Вид упаковки",
    dataIndex: "unit",
  },
  {
    title: "Кол-во бутылок в упаковке",
    dataIndex: "quantity",
  },
  {
    title: 'Дата агрегации',
    dataIndex: 'aggregationDate',
  },
  {
    title: "Статус",
    dataIndex: "status",
  },
];

export const AggregationList = (props) => {
  const { match, location } = props;
  const batchId = match.params.batchId;

  const $aggregationsList = useStore(store.$aggregationsList);
  const $aggregationsFilterProps = useStore(store.$aggregationsFilterProps);

  const { data: aggregationsData, loading } = $aggregationsList;
  const { content: aggregationsList, totalElements: aggregationsTotal, size: aggregationsPageSize, number: aggregationsPageNumber } = aggregationsData;

  useEffect(() => {
    effects.getAggregationsListEffect({
      batchId,
      ...$aggregationsFilterProps
    });
  }, [$aggregationsFilterProps, location.pathname]);

  const changePagination = (page) => {
    events.updateAggregationsFilterPropsEvent({
      page: page - 1
    })
  };

  const data = aggregationsList.map((aggregation, index) => {
    return {
      id: aggregation.id,
      key: aggregation.id,
      number: (<div className="w-s-n">{(aggregationsPageSize * aggregationsPageNumber) + index + 1}</div>),
      printCode: <Link to={`${match.path}/${aggregation.id}`}>{aggregation.printCode}</Link>,
      productName: aggregation.productName,
      unit: aggregation.unitName,
      quantity: aggregation.quantity,
      aggregationDate: <Moment format="DD.MM.YYYY" date={aggregation.aggregationDate} />,
      status: aggregation.statusName
    }
  });

  return (
    <>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left" onClick={() => props.history.goBack()}>
            <ArrowSvg />
          </Button>
          <h1>{batchId ? "Заказ КА > Коды агрегации" : "Коды агрегации"}</h1>
        </div>
        <div className="content-h1-wr__right">
          {!batchId &&
            <Button className="custom-button primary-button" onClick={() => props.history.push(`${match.path}/add`)}>
              Агрегировать
            </Button>
          }
        </div>
      </div>
      <div className="site-content__in">
        <AggregationListFilter />
        <div className="site-content__in__table">
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <div className="site-content__in__table-pagination">
            <div className="site-content__in__table-total">Кол-во кодов агрегации: {aggregationsTotal}</div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={$aggregationsFilterProps.page ? $aggregationsFilterProps.page + 1 : 1}
              total={aggregationsTotal}
              pageSize={aggregationsPageSize}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </div>
        </div>
      </div>
    </>
  )
};