import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Pagination, Table } from "antd";

import effectorUser from "../../../screens/main/effector";
import effector from "../effector";

import { ClientOrdersFilter } from "../organisms/client-orders-filter";

import Moment from "react-moment";
import { formatPrice } from "helpers/format-price";

const { store: storeUser } = effectorUser;
const { store, events, effects } = effector;

const columns = [
  {
    title: '№',
    dataIndex: 'number',
    width: 50
  },
  {
    title: 'Номер',
    dataIndex: 'orderNumber',
  },
  {
    title: 'Филиал',
    dataIndex: 'branch',
  },
  {
    title: 'Дата',
    dataIndex: 'orderDate'
  },
  {
    title: 'Сумма',
    dataIndex: 'total',
  },
  {
    title: 'Статус',
    dataIndex: "status"
  }
];

export const ClientOrders = ({ clientId }) => {
  const { $currentUser } = useStore(storeUser);
  const { $clientOrders, $clientOrdersFilterProps } = useStore(store);

  const { data: ordersData, loading } = $clientOrders;
  const { content: orders, totalElements: ordersTotal, size: ordersPageSize, number: ordersPageNumber } = ordersData;

  useEffect(() => {
    effects.getClientOrdersEffect({
      ...$clientOrdersFilterProps,
      customerId: clientId,
      supplierId: $currentUser.data.companyId
    })
  }, [$clientOrdersFilterProps]);

  const data = orders.map((order, index) => {
    return {
      id: order.id,
      key: order.id,
      number: (<div className="w-s-n">{(ordersPageSize * ordersPageNumber) + index + 1}</div>),
      orderNumber: <Link to={`/orders/list/${order.id}`}>{order.number}</Link>,
      branch: order.branch.name,
      orderDate: <Moment format="DD.MM.YYYY" date={order.orderDate} />,
      total: formatPrice(order.total),
      status: order.status.nameRu
    }
  });

  const changePagination = (page) => {
    events.updateClientOrdersFilterPropsEvent({
      page: page - 1
    })
  };

  return (
    <div>
      <ClientOrdersFilter />
      <div className="site-content__in__table">
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={false}
        />
        <div className="site-content__in__table-pagination">
          <div className="site-content__in__table-total">Всего заказов: {ordersTotal}</div>
          <Pagination
            disabled={loading}
            onChange={changePagination}
            current={$clientOrdersFilterProps.page ? $clientOrdersFilterProps.page + 1 : 1}
            total={ordersTotal}
            pageSize={ordersPageSize}
            showSizeChanger={false}
            hideOnSinglePage={true}
          />
        </div>
      </div>
    </div>
  )
};
