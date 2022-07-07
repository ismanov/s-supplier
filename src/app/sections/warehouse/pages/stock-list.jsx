import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Link, NavLink } from "react-router-dom";
import { Button, Pagination, Popconfirm, Popover, Table } from "antd";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import effector from "../effector";

import { ArrowSvg, SettingsSvg } from "svgIcons/svg-icons";
import { StockListFilter } from "../organisms/stock-list-filter";
import moment from "moment";
import { DATE_FORMAT } from "../../../screens/main/constants";
import Show from "ui/molecules/show";

const { stores, events, effects } = effector;

const columns = [
  {
    key: 1,
    title: "№",
    dataIndex: "number",
    width: 50,
  },
  {
    key: 2,
    title: "Номер ",
    dataIndex: "stockNumber",
  },
  {
    key: 3,
    title: "Дата прихода",
    dataIndex: "date",
  },
  {
    key: 4,
    title: "Поставщик",
    dataIndex: "supplier",
  },
  {
    key: 5,
    title: "Склад",
    dataIndex: "warehouse",
  },
  {
    key: 6,
    title: "Филиал",
    dataIndex: "branch",
  },
  {
    key: 7,
    title: "Счет-фактура",
    dataIndex: "facturaNumber",
  },
  {
    key: 8,
    title: "Количество",
    dataIndex: "totalQty",
  },
  {
    key: 9,
    title: "Себестоимость",
    dataIndex: "totalPrice",
  },
  {
    title: " ",
    dataIndex: "action",
  },
];

export const StockList = (props) => {
  const $stockList = useStore(stores.$stockList);
  const $deleteStockInItem = useStore(stores.$deleteStockInItem);
  const $stockFilterProps = useStore(stores.$stockFilterProps);

  const { data: stockData, loading } = $stockList;
  const {
    content: stockList,
    totalElements: stockTotal,
    size: stockPageSize,
    number: stockPageNumber,
  } = stockData;
  const { match } = props;

  useEffect(() => {
    effects.getWarehouseStockListEffect({
      ...$stockFilterProps,
      from: moment($stockFilterProps.from).format(),
      to: moment($stockFilterProps.to).format(),
    });
  }, [$stockFilterProps]);

  useEffect(() => {
    if ($deleteStockInItem.success) {
      openNotificationWithIcon("success", "Товар удален");
      effects.getWarehouseStockListEffect({
        ...$stockFilterProps,
        from: moment($stockFilterProps.from).format(),
        to: moment($stockFilterProps.to).format(),
      });
      events.resetDeleteStockInItemEvent();
    }
  }, [$deleteStockInItem.success]);

  const changePagination = (page) => {
    events.updateStockFilterPropsEvent({
      page: page - 1,
    });
  };

  const data = stockList.map((product, index) => {
    return {
      id: product.id,
      key: product.id,
      stockNumber: (
        <Link to={`${match.path}/${product.id}`}>{product.stockNumber}</Link>
      ),
      facturaNumber: (
        <Show if={product.facturaNumber}>
          <NavLink
            to={{
              pathname: `/invoices/incoming/${product.facturaId}`,
            }}
            exact
          >
            {product.facturaNumber || ""}
          </NavLink>
        </Show>
      ),
      number: (
        <div className="w-s-n">
          {stockPageSize * stockPageNumber + index + 1}
        </div>
      ),
      date: moment(product.transferDate).format(DATE_FORMAT) || "",
      supplier: product.supplier.name || "",
      branch: (product.branch && product.branch.name) || "",
      warehouse: product.warehouse.name || "",
      totalQty: product.totalQty || "",
      totalPrice: product.totalPrice || "",
      action: (
        <Popover
          placement="bottomRight"
          trigger="click"
          content={
            <div>
              <div className="custom__popover__item">
                <Popconfirm
                  title="Вы уверены что хотите удалить?"
                  onConfirm={() => effects.deleteStockInItemEffect(product.id)}
                  okText="Да"
                  cancelText="Нет"
                  danger={true}
                  type="link"
                >
                  <Button
                    loading={$deleteStockInItem.loading}
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    Удалить
                  </Button>
                </Popconfirm>
              </div>
            </div>
          }
        >
          <Button className="custom-button onlyicon b-r-30">
            <SettingsSvg />
          </Button>
        </Popover>
      ),
    };
  });

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
          <h1>Приход товара</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button
            className="custom-button primary-button"
            onClick={() => props.history.push("stock/add")}
          >
            Добавить
          </Button>
        </div>
      </div>
      <div className="site-content__in">
        <StockListFilter />
        <div className="site-content__in__table">
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <div className="site-content__in__table-pagination">
            <div className="site-content__in__table-total">
              Всего приходов: {stockTotal}
            </div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={$stockFilterProps.page ? $stockFilterProps.page + 1 : 1}
              total={stockTotal}
              pageSize={stockPageSize}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};
