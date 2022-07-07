import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Link, NavLink } from "react-router-dom";
import { Button, Pagination, Popconfirm, Popover, Table } from "antd";

import effector from "../effector";

import { ArrowSvg, SettingsSvg } from "svgIcons/svg-icons";
import moment from "moment";
import { DATE_FORMAT } from "../../../screens/main/constants";
import { ShipmentListFilter } from "../organisms/shipment-list-filter";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
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
    title: "Дата отгрузки",
    dataIndex: "date",
  },
  {
    key: 4,
    title: "Клиент",
    dataIndex: "customer",
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
    title: "Заказ",
    dataIndex: "order",
  },
  {
    key: 7,
    title: "Счет фактура",
    dataIndex: "invoiceNumber",
  },
  {
    key: 8,
    title: "Количество",
    dataIndex: "totalQty",
  },
  {
    key: 9,
    title: "Итого",
    dataIndex: "totalPrice",
  },
  {
    key: "action",
    title: "Действия",
    dataIndex: "action",
  },
];

export const ShipmentList = (props) => {
  const $shipmentList = useStore(stores.$shipmentList);
  const $deleteStockOutItem = useStore(stores.$deleteStockOutItem);
  const $shipmentFilterProps = useStore(stores.$shipmentFilterProps);
  const $createInvoice = useStore(stores.$createInvoice);

  const { data: shipmentData, loading } = $shipmentList;
  const {
    content: shipmentList,
    totalElements: stockTotal,
    size: stockPageSize,
    number: stockPageNumber,
  } = shipmentData;
  const { match } = props;

  useEffect(() => {
    if ($createInvoice.data?.id) {
      openNotificationWithIcon("success", "Счет-фактура выписан");
      // effects.getWarehouseShipmentListEffect({
      //   ...$shipmentFilterProps,
      //   from: moment($shipmentFilterProps.from).format(),
      //   to: moment($shipmentFilterProps.to).format(),
      // });
      props.history.push("/invoices/outgoing/" + $createInvoice.data.id);

      events.resetCreateInvoiceEvent();
    }
  }, [$createInvoice.data]);

  useEffect(() => {
    effects.getWarehouseShipmentListEffect({
      ...$shipmentFilterProps,
      from: moment($shipmentFilterProps.from).format(),
      to: moment($shipmentFilterProps.to).format(),
    });
  }, [$shipmentFilterProps]);

  useEffect(() => {
    if ($deleteStockOutItem.success) {
      openNotificationWithIcon("success", "Товар удален");
      effects.getWarehouseShipmentListEffect({
        ...$shipmentFilterProps,
        from: moment($shipmentFilterProps.from).format(),
        to: moment($shipmentFilterProps.to).format(),
      });
      events.resetDeleteStockOutItemEvent();
    }
  }, [$deleteStockOutItem.success]);

  const changePagination = (page) => {
    events.updateShipmentFilterPropsEvent({
      page: page - 1,
    });
  };

  const data = shipmentList.map((product, index) => {
    return {
      id: product.id,
      key: product.id,
      stockNumber: (
        <Link to={`${match.path}/${product.id}`}>{product.stockNumber}</Link>
      ),
      facturaNumber: product.facturaNumber || "",
      number: (
        <div className="w-s-n">
          {stockPageSize * stockPageNumber + index + 1}
        </div>
      ),
      date: moment(product.transferDate).format(DATE_FORMAT) || "",
      customer: product.customer.name || "",
      branch: (product.branch && product.branch.name) || "",
      order: (
        <NavLink
          to={{
            pathname: `/warehouse/orders/view/${product.order?.id}`,
          }}
          exact
        >
          {product.order?.name || ""}
        </NavLink>
      ),
      invoiceNumber: (
        <NavLink
          to={{
            pathname: `/invoices/outgoing/${product.invoice?.id}`,
          }}
          exact
        >
          {product.invoice?.name || ""}
        </NavLink>
      ),
      warehouse: product.warehouse.name || "",
      totalQty: product.totalQty || "",
      totalPrice: product.totalPrice || "",
      action: (
        <Show if={!product.invoice}>
          <Popover
            overlayClassName="custom__popover"
            placement="bottomRight"
            trigger="click"
            content={
              <>
                <div className="custom__popover__item">
                  <Button
                    className="custom-button primary-button"
                    onClick={() =>
                      effects.createInvoiceEffect({
                        stockId: product.id,
                      })
                    }
                  >
                    Выписать СФ
                  </Button>
                </div>
                <div className="custom__popover__item">
                  <Popconfirm
                    title="Вы уверены что хотите удалить?"
                    onConfirm={() =>
                      effects.deleteStockOutItemEffect(product.id)
                    }
                    okText="Да"
                    cancelText="Нет"
                    danger={true}
                    type="link"
                  >
                    <Button
                      loading={$deleteStockOutItem.loading}
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      Удалить
                    </Button>
                  </Popconfirm>
                </div>
              </>
            }
          >
            <Button className="custom-button onlyicon b-r-30">
              <SettingsSvg />
            </Button>
          </Popover>
        </Show>
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
          <h1>Отгрузка товара</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button
            className="custom-button primary-button"
            onClick={() => props.history.push("shipment/add")}
          >
            Добавить
          </Button>
        </div>
      </div>
      <div className="site-content__in">
        <ShipmentListFilter />
        <div className="site-content__in__table">
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <div className="site-content__in__table-pagination">
            <div className="site-content__in__table-total">
              Всего отгрузок: {stockTotal}
            </div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={
                $shipmentFilterProps.page ? $shipmentFilterProps.page + 1 : 1
              }
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
