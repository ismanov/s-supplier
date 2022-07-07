import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Pagination, Table } from "antd";

import effector from "../effector";

import { ClientsListFilter } from "../organisms/clients-list-filter";

import { formatPrice, formatPriceProduct } from "helpers/format-price";

const { store, events, effects } = effector;

const columns = [
  {
    title: '№',
    dataIndex: 'number',
    width: 50
  },
  {
    title: 'Клиент',
    dataIndex: 'name',
  },
  {
    title: 'ИНН',
    dataIndex: 'tin',
  },
  {
    title: 'Кол-во заказов',
    dataIndex: 'totalOrder',
  },
  {
    title: 'Сумма',
    dataIndex: 'totalAmountOrder',
  }
];

export const ClientsList = () => {
  const { $clientsList, $clientsFilterProps } = useStore(store);

  const { data: clientsData, loading } = $clientsList;
  const { content: clients, totalElements: clientsTotal, size: clientsPageSize, number: clientsPageNumber } = clientsData;

  useEffect(() => {
    effects.getClientsListEffect({
      ...$clientsFilterProps,
      orderBy: "id"
    });
  }, [$clientsFilterProps]);
  

  const changePagination = (page) => {
    events.updateClientsFilterPropsEvent({
      page: page - 1
    })
  };

  const data = clients.map((client, index) => {
    return {
      id: client.id,
      key: client.id,
      number: (<div className="w-s-n">{(clientsPageSize * clientsPageNumber) + index + 1}</div>),
      name: <Link to={`/clients/list/${client.id}`}>{client.name}</Link>,
      tin: client.tin,
      totalOrder: formatPriceProduct(client.totalOrder),
      totalAmountOrder: formatPrice(client.totalAmountOrder)
    }
  });

  return (
    <>
      <h1>Мои клиенты</h1>
      <div className="site-content__in">
        <ClientsListFilter />
        <div className="site-content__in__table">
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <div className="site-content__in__table-pagination">
            <div className="site-content__in__table-total">Всего клиентов: {clientsTotal}</div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={$clientsFilterProps.page ? $clientsFilterProps.page + 1 : 1}
              total={clientsTotal}
              pageSize={clientsPageSize}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </div>
        </div>
      </div>
    </>
  )
};