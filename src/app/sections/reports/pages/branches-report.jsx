import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Button, Table } from "antd";

import effector from "../effector";

import { BranchesReportFilter } from "../organisms/branches-report-filter";
import { formatPrice } from "helpers/format-price";
import { ExelSvg } from "svgIcons/svg-icons";
import { downloadFile } from "helpers/download-file";

const { store, events, effects } = effector;

const { Column, ColumnGroup } = Table;


export const BranchesReport = () => {
  const { $branchesReportList, $branchesReportFilterProps, $branchesReportListExcel } = useStore(store);

  const { data: branchesReport, loading } = $branchesReportList;

  useEffect(() => {
    effects.getBranchesReportListEffect($branchesReportFilterProps);
  }, [$branchesReportFilterProps]);

  useEffect(() => {
    if ($branchesReportListExcel.data) {
      const data = $branchesReportListExcel.data;
      const urlCreator = window.URL || window.webkitURL;
      const fileUrl = urlCreator.createObjectURL(data);

      const filename = $branchesReportListExcel.filename.replace("attachment; filename=", "");

      downloadFile(fileUrl, filename);

      events.resetBranchesReportListExcelEvent();
    }

  }, [$branchesReportListExcel.data]);

  const data = branchesReport.map((branch, index) => {
    return {
      id: branch.id,
      key: branch.id,
      number: (<div className="w-s-n">{index + 1}</div>),
      name: branch.name,
      totalCount: <div className="t-a-r">{branch.totalCount}</div>,
      totalNew: <div className="t-a-r">{branch.totalNew}</div>,
      totalInProgress: <div className="t-a-r">{branch.totalInProgress}</div>,
      totalCompleted: <div className="t-a-r">{branch.totalCompleted}</div>,
      totalRejected: <div className="t-a-r">{branch.totalRejected}</div>,
      total: <div className="t-a-r">{branch.totalAmount ? formatPrice(branch.totalAmount) : 0}</div>
    }
  });

  const onExcelDownload = () => {
    effects.getBranchesReportListExcelEffect($branchesReportFilterProps);
  };

  return (
    <>
      <h1>Отчет по филиалам</h1>
      <div className="site-content__in">
        <div className="site-content__in-wr">
          <BranchesReportFilter />
          <div className="site-content__in__btns">
            <Button className="custom-button primary-button primary-button-i" loading={$branchesReportListExcel.loading} onClick={onExcelDownload}>
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
            <div className="site-content__in__table-total">Всего филиалов: {branchesReport.length}</div>
          </div>
        </div>
      </div>
    </>
  )
};