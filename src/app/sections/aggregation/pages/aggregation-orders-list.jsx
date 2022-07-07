import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Button, Pagination, Table } from "antd";
import moment from "moment";

import effector from "../effector";

import { ArrowSvg, ArrowGoOutlined } from "svgIcons/svg-icons";
import { formatPriceProduct } from "helpers/format-price";
import { AddAggregationOrderModal } from "../organisms/add-aggregation-order-modal";
import { AggregationOrdersListFilter } from "../organisms/aggregation-orders-list-filter";

const { store, events, effects } = effector;

const columns = [
  {
    title: "№",
    dataIndex: "num",
    width: 80,
  },
  {
    title: "Номер заказа",
    dataIndex: "orderNumber",
  },
  {
    title: "Количество КА",
    dataIndex: "quantity",
  },
  {
    title: "Использовано",
    dataIndex: "used",
  },
  {
    title: "Не использовано",
    dataIndex: "notUsed",
  },
  {
    title: "Описание",
    dataIndex: "description",
  },
  {
    title: "Дата заказа",
    dataIndex: "createdDate",
  },
  {
    title: "",
    dataIndex: "actions",
  },
];


export const AggregationOrdersList = (props) => {
  const { match, history } = props;

  const $aggregationOrdersList = useStore(store.$aggregationOrdersList);
  const $aggregationsOrdersFilterProps = useStore(store.$aggregationsOrdersFilterProps);

  const { data: aggregationOrdersData, loading } = $aggregationOrdersList;
  const {
    content: aggregationOrders,
    number: aggregationOrdersPage,
    size: aggregationOrdersSize,
    totalElements: aggregationOrdersTotal,
  } = aggregationOrdersData;

  const [addOrderModalVisible, setAddOrderModalVisible] = useState({
    visible: false,
    shouldRender: false
  });

  const getAggregationOrders = () => {
    effects.getAggregationOrdersListEffect($aggregationsOrdersFilterProps);
  };

  useEffect(() => {
    getAggregationOrders();
  }, [$aggregationsOrdersFilterProps]);


  const changePagination = (page) => {
    events.updateAggregationsOrdersFilterPropsEvent({
      page: page - 1
    })
  };

  const onAddOrderClick = () => {
    setAddOrderModalVisible({ visible: true, shouldRender: true });
  };

  const data = aggregationOrders.map((item, index) => {
    return {
      key: item.id,
      num: <div className="w-s-n">{aggregationOrdersSize * aggregationOrdersPage + index + 1}</div>,
      orderNumber: <Link to={`${match.url}/${item.id}`}>{item.number || <ArrowGoOutlined />}</Link>,
      quantity: <Link to={`${match.url}/${item.id}`}>{formatPriceProduct(item.quantity)}</Link>,
      used: formatPriceProduct(item.used),
      notUsed: formatPriceProduct(item.quantity - item.used),
      description: item.description,
      createdDate: item.createdDate ? moment(item.createdDate).format("DD.MM.YYYY HH:mm") : "-",
      actions: (
        <Button className="custom-button add-button" onClick={() => history.push(`${match.url}/${item.id}/print`)}>
          На печать
        </Button>
      ),
    };
  });

  return (
    <>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left" onClick={() => props.history.goBack()}>
            <ArrowSvg />
          </Button>
          <h1>Заказ КА</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button className="custom-button primary-button" onClick={onAddOrderClick}>
            Заказать
          </Button>
        </div>
      </div>
      <div className="site-content__in">
        <AggregationOrdersListFilter />
        <div className="site-content__in__table">
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <div className="site-content__in__table-pagination">
            <div className="site-content__in__table-total">Кол-во заказов: {aggregationOrdersTotal}</div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={$aggregationsOrdersFilterProps.page ? $aggregationsOrdersFilterProps.page + 1 : 1}
              total={aggregationOrdersTotal}
              pageSize={aggregationOrdersSize}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </div>
        </div>
        {addOrderModalVisible.shouldRender && <AddAggregationOrderModal
          modalProps={addOrderModalVisible} setModalProps={setAddOrderModalVisible} callBack={getAggregationOrders}
        />}
      </div>
    </>
  );
};