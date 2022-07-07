import React, { useEffect } from "react";
import { Button, Pagination, Table, Typography } from "antd";
import { ArrowSvg } from "svgIcons/svg-icons";
import { StockReportListFilter } from "../organisms/stock-balance-list-filter";
import effector from "../effector";
import { useStore } from "effector-react";
import moment from "moment";
import { debounce } from "helpers/debounce";

const { Text } = Typography;
const { stores, effects, events } = effector;
const columns = [
  {
    key: 1,
    title: "№",
    dataIndex: "number",
    width: 50,
  },
  {
    key: "name",
    title: "Наименование",
    dataIndex: "name",
  },
  {
    key: "unitName",
    title: "Ед. изм.",
    dataIndex: "unitName",
  },
  {
    key: "qty",
    title: "Кол-во",
    dataIndex: "qty",
  },
  {
    key: "costPriceWrap",
    title: "Ст. поставки с НДС",
    dataIndex: "costPriceWrap",
    children: [
      {
        key: "purchasePrice",
        title: "на 1 шт.",
        dataIndex: "purchasePrice",
      },
      {
        key: "totalPurchasePrice",
        title: "Всего",
        dataIndex: "totalPurchasePrice",
      },
    ],
  },
  {
    key: "salesPriceWrap",
    title: "Продажная цена, сум",
    dataIndex: "salesPriceWrap",
    children: [
      {
        key: "sellingPrice",
        title: "на 1 шт.",
        dataIndex: "sellingPrice",
      },
      {
        key: "totalSellingPrice",
        title: "Сумма",
        dataIndex: "totalSellingPrice",
      },
    ],
  },
  {
    key: "potentialProfit",
    title: "Потенциальная прибыль, сум",
    dataIndex: "potentialProfit",
  },
  {
    key: "potentialProfitPercent",
    title: "Наценка, %",
    dataIndex: "potentialProfitPercent",
  },
];

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const StockBalance = (props) => {
  const $stockReportList = useStore(stores.$stockReportList);
  const $reportGrandTotal = useStore(stores.$reportGrandTotal);
  const $stockReportFilterProps = useStore(stores.$stockReportFilterProps);
  const { data, loading } = $stockReportList;

  useEffect(() => {
    const id = setTimeout(() => {
      effects.getWarehouseStockReportListEffect({
        ...$stockReportFilterProps,
        date: moment($stockReportFilterProps.date).format(),
      });
      effects.getReportGrandTotalEffect({
        ...$stockReportFilterProps,
        date: moment($stockReportFilterProps.date).format(),
      });
    }, 500);
    return () => clearTimeout(id);
  }, [$stockReportFilterProps]);
  const dataSource = (data.content || []).map((item, idx) => {
    return {
      ...item,
      number:
        (($stockReportFilterProps.page ? $stockReportFilterProps.page + 1 : 1) -
          1) *
          20 +
        idx +
        1,
    };
  });

  const onFilterSearchChange = (field, value) => {
    events.updateStockReportFilterPropsEvent({
      ...$stockReportFilterProps,
      [field]: value,
    });
  };

  return (
    <>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button
            className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left"
            onClick={() => props.history.goBack()}
          >
            <ArrowSvg />
          </Button>
          <h1>Общие остатки</h1>
        </div>
      </div>
      <div className="site-content__in">
        <StockReportListFilter />
        <div className="site-content__in__table">
          <Table
            className="custom-table"
            loading={loading}
            dataSource={dataSource}
            columns={columns}
            bordered
            summary={(pageData) => {
              return (
                <>
                  <Table.Summary.Row className="table-footer-total-title">
                    <Table.Summary.Cell rowSpan={5} colSpan={2}>
                      Итого:
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>
                        {(
                          $reportGrandTotal.data[0]?.unit || 0
                        ).toLocaleString()}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>{$reportGrandTotal.data[0]?.qty}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell colSpan={2}>
                      <Text>
                        {(
                          Math.floor(
                            ($reportGrandTotal.data[0]?.totalPurchasePrice ||
                              0) * 100
                          ) / 100
                        ).toLocaleString()}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell colSpan={2}>
                      <Text>
                        {(
                          Math.floor(
                            ($reportGrandTotal.data[0]?.totalSellingPrice ||
                              0) * 100
                          ) / 100
                        ).toLocaleString()}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>
                        {(
                          Math.floor(
                            ($reportGrandTotal.data[0]?.potentialProfit || 0) *
                              100
                          ) / 100
                        ).toLocaleString()}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>
                        {($reportGrandTotal.data[0]?.totalPurchasePrice
                          ? Math.floor(
                              (((($reportGrandTotal.data[0]
                                ?.totalSellingPrice || 0) /
                                $reportGrandTotal.data[0]?.totalPurchasePrice) *
                                100) /
                                100 -
                                1) *
                                100 *
                                100
                            ) / 100
                          : "∞"
                        ).toLocaleString("ru")}
                        %
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  {$reportGrandTotal.data.slice(1).map((item, index) => {
                    return (
                      <Table.Summary.Row
                        key={index}
                        className="table-footer-total-title"
                      >
                        <Table.Summary.Cell>
                          <Text>{item?.unit}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text>{(item?.qty || 0).toLocaleString("ru")}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell colSpan={2}>
                          <Text>
                            {(
                              Math.floor(
                                (item?.totalPurchasePrice || 0) * 100
                              ) / 100
                            ).toLocaleString()}
                          </Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell colSpan={2}>
                          <Text>
                            {(
                              Math.floor((item?.totalSellingPrice || 0) * 100) /
                              100
                            ).toLocaleString()}
                          </Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text>
                            {(
                              Math.floor((item?.potentialProfit || 0) * 100) /
                              100
                            ).toLocaleString()}
                          </Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text>
                            {(item?.totalPurchasePrice
                              ? Math.floor(
                                  ((((item?.totalSellingPrice || 0) /
                                    item?.totalPurchasePrice) *
                                    100) /
                                    100 -
                                    1) *
                                    100 *
                                    100
                                ) / 100
                              : "∞"
                            ).toLocaleString("ru")}
                            %
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  })}
                </>
              );
            }}
            size="small"
            pagination={{
              disabled: false,
              onChange: (page, size) => {
                onFilterSearchChange("page", page - 1);
              },
              current: $stockReportFilterProps.page
                ? $stockReportFilterProps.page + 1
                : 1,
              total: data.totalElements,
              pageSize: 20,
              loading: loading,
              showSizeChanger: false,
              hideOnSinglePage: true,
            }}
          />
        </div>
      </div>
    </>
  );
};
