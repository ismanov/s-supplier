import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Button, Pagination, Table } from "antd";

import effector from "../effector";

import { ClientsReportFilter } from "../organisms/clients-report-filter";
import { formatPrice } from "helpers/format-price";
import { ExelSvg } from "svgIcons/svg-icons";
import { downloadFile } from "helpers/download-file";

const { store, events, effects } = effector;

const { Column, ColumnGroup } = Table;


export const ClientsReport = () => {
  const { $clientsReportList, $clientsReportFilterProps, $clientsReportListExcel } = useStore(store);

  const { data: $clientsReportData, loading } = $clientsReportList;
  const { content: clientsReport, totalElements: clientsReportTotal, size: clientsReportPageSize, number: clientsReportPageNumber } = $clientsReportData;

  useEffect(() => {
    effects.getClientsReportListEffect($clientsReportFilterProps);
  }, [$clientsReportFilterProps]);

  useEffect(() => {
    if ($clientsReportListExcel.data) {
      const data = $clientsReportListExcel.data;
      const urlCreator = window.URL || window.webkitURL;
      const fileUrl = urlCreator.createObjectURL(data);
      const filename = $clientsReportListExcel.filename.replace("attachment; filename=", "");

      downloadFile(fileUrl, filename);

      events.resetClientsReportListExcelEvent();
    }

  }, [$clientsReportListExcel.data]);

  const changePagination = (page) => {
    events.updateClientsReportFilterPropsEvent({
      page: page - 1
    })
  };

  const data = clientsReport.map((client, index) => {
    return {
      id: client.id,
      key: client.id,
      number: (<div className="w-s-n">{(clientsReportPageSize * clientsReportPageNumber) + index + 1}</div>),
      name: <Link to={`/clients/list/${client.id}`}>{client.name}</Link>,
      totalCount: <div className="t-a-r">{client.totalCount}</div>,
      totalNew: <div className="t-a-r">{client.totalNew}</div>,
      totalInProgress: <div className="t-a-r">{client.totalInProgress}</div>,
      totalCompleted: <div className="t-a-r">{client.totalCompleted}</div>,
      totalRejected: <div className="t-a-r">{client.totalRejected}</div>,
      total: <div className="t-a-r">{client.totalAmount ? formatPrice(client.totalAmount) : 0}</div>
    }
  });

  const onExcelDownload = () => {
    effects.getClientsReportListExcelEffect($clientsReportFilterProps);
  };

  return (
    <>
      <h1>Отчет по клиентам</h1>
      <div className="site-content__in">
        <div className="site-content__in-wr">
          <ClientsReportFilter />
          <div className="site-content__in__btns">
            <Button className="custom-button primary-button primary-button-i" loading={$clientsReportListExcel.loading} onClick={onExcelDownload}>
              Скачать
              <ExelSvg />
            </Button>
          </div>
        </div>
        <div className="site-content__in__table bordered-table">
          <Table
            loading={loading}
            dataSource={data}
            pagination={false}
            bordered
          >
            <Column title="№" dataIndex="number" key="number" className="v-a-t" />
            <Column title="Название" dataIndex="name" key="name" className="v-a-t" />
            <ColumnGroup title="Заказы" className="t-a-c">
              <Column
                title="Всего"
                dataIndex="totalCount"
                key="totalCount"
              />
              <Column
                title="Новые"
                dataIndex="totalNew"
                key="totalNew"
              />
              <Column
                title="В процессе"
                dataIndex="totalInProgress"
                key="totalInProgress"
              />
              <Column
                title="Завершенные"
                dataIndex="totalCompleted"
                key="totalCompleted"
              />
              <Column
                title="Отмененные"
                dataIndex="totalRejected"
                key="totalRejected"
              />
            </ColumnGroup>
            <Column title="Сумма" dataIndex="total" key="total" className="v-a-t" />
          </Table>
          <div className="site-content__in__table-pagination">
            <div className="site-content__in__table-total">Всего клиентов: {clientsReportTotal}</div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={$clientsReportFilterProps.page ? $clientsReportFilterProps.page + 1 : 1}
              total={clientsReportTotal}
              pageSize={clientsReportPageSize}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </div>
        </div>
      </div>
    </>
  )
};