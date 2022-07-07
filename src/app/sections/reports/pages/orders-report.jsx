import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Button, Pagination, Table } from "antd";
import Moment from "react-moment";

import effector from "../effector";

import { OrdersReportFilter } from "../organisms/orders-report-filter";
import { formatPrice } from "helpers/format-price";
import { ExelSvg } from "svgIcons/svg-icons";
import { downloadFile } from "helpers/download-file";

const { store, events, effects } = effector;

const columns = [
  {
    title: '№',
    dataIndex: 'number',
    width: 50
  },
  {
    title: "Заказ",
    dataIndex: "orderNumber"
  },
  {
    title: 'Кол-во товаров',
    dataIndex: 'count',
  },
  {
    title: "Сумма",
    dataIndex: "total"
  },
  {
    title: "Дата",
    dataIndex: "orderDate"
  },
  {
    title: "Статус",
    dataIndex: "status"
  }
];

export const OrdersReport = () => {
  const { $ordersReportList, $ordersReportFilterProps, $ordersReportListExcel } = useStore(store);

  const { data: ordersReportData, loading } = $ordersReportList;
  const { content: ordersReport, totalElements: ordersReportTotal, size: ordersReportPageSize, number: ordersReportPageNumber } = ordersReportData;

  useEffect(() => {
    effects.getOrdersReportListEffect($ordersReportFilterProps);
  }, [$ordersReportFilterProps]);

  useEffect(() => {
    if ($ordersReportListExcel.data) {
      const data = $ordersReportListExcel.data;
      const urlCreator = window.URL || window.webkitURL;
      const fileUrl = urlCreator.createObjectURL(data);
      const filename = $ordersReportListExcel.filename.replace("attachment; filename=", "");

      downloadFile(fileUrl, filename);

      events.resetOrdersReportListExcelEvent();
    }

  }, [$ordersReportListExcel.data]);

  const changePagination = (page) => {
    events.updateOrdersReportFilterPropsEvent({
      page: page - 1
    })
  };

  const data = ordersReport.map((order, index) => {
    return {
      id: order.id,
      key: order.id,
      number: (<div className="w-s-n">{(ordersReportPageSize * ordersReportPageNumber) + index + 1}</div>),
      orderNumber: <Link to={`/orders/list/${order.id}`}>{order.orderNumber}</Link>,
      count: order.productCount,
      total: order.totalAmount ? formatPrice(order.totalAmount) : "",
      orderDate: <Moment format="DD.MM.YYYY" date={order.orderDate} />,
      status: order.status
    }
  });

  const onExcelDownload = () => {
    effects.getOrdersReportListExcelEffect($ordersReportFilterProps);
  };

  return (
    <>
      <h1>Отчет по заказам</h1>
      <div className="site-content__in">
        <div className="site-content__in-wr">
          <OrdersReportFilter />
          <div className="site-content__in__btns">
            <Button className="custom-button primary-button primary-button-i" loading={$ordersReportListExcel.loading} onClick={onExcelDownload}>
              Скачать
              <ExelSvg />
            </Button>
          </div>
        </div>
        <div className="site-content__in__table">
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <div className="site-content__in__table-pagination">
            <div className="site-content__in__table-total">Всего заказов: {ordersReportTotal}</div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={$ordersReportFilterProps.page ? $ordersReportFilterProps.page + 1 : 1}
              total={ordersReportTotal}
              pageSize={ordersReportPageSize}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </div>
        </div>
      </div>
    </>
  )
};