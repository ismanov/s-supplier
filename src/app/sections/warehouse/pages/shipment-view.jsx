import React, { useEffect } from "react";
import { Button, Table, Form, Row, Col, Typography } from "antd";
import { ArrowSvg } from "svgIcons/svg-icons";
import effector from "../effector";
import { useStore } from "effector-react";
import moment from "moment";
import { DATE_FORMAT } from "../../../screens/main/constants";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import Show from "ui/molecules/show";
import { NavLink } from "react-router-dom";

const { stores, effects, events } = effector;
const { Text } = Typography;

const columns = [
  {
    key: 1,
    title: "№",
    dataIndex: "number",
    width: 50,
  },
  {
    key: "vatBarCode",
    title: "Код",
    dataIndex: "vatBarCode",
    width: 230,
  },
  {
    key: 2,
    title: "Наименование",
    dataIndex: "name",
  },
  {
    key: 3,
    title: "Ед. Изм",
    dataIndex: "unit",
  },
  {
    key: 4,
    title: "Количество",
    dataIndex: "qty",
  },
  {
    key: 5,
    title: "Цена",
    dataIndex: "sellingPriceWithoutVat",
  },
  {
    key: 321,
    title: "Сумма",
    dataIndex: "totalSellingPriceWithoutVat",
  },
  {
    key: 6,
    title: "НДС/Прод.Цена",
    dataIndex: "vatData",
  },
  {
    key: 7,
    title: "Всего",
    dataIndex: "totalSellingPrice",
  },
];

export const ShipmentView = (props) => {
  const $shipmentItem = useStore(stores.$shipmentItem);
  const $deleteStockOutItem = useStore(stores.$deleteStockOutItem);
  const $createInvoice = useStore(stores.$createInvoice);
  const {
    match: {
      params: { id },
    },
  } = props;

  useEffect(() => {
    id && effects.getWarehouseShipmentItemEffect(id);
    return () => {
      events.resetShipmentItemEvent();
      events.resetCreateInvoiceEvent();
    };
  }, []);

  useEffect(() => {
    if ($createInvoice.data?.id) {
      openNotificationWithIcon("success", "Счет-фактура выписан");
      //id && effects.getWarehouseShipmentItemEffect(id);
      events.resetCreateInvoiceEvent();
      props.history.push("/invoices/outgoing/" + $createInvoice.data.id);
    }
  }, [$createInvoice.data]);

  useEffect(() => {
    if ($deleteStockOutItem.success) {
      openNotificationWithIcon("success", "Товар удален");
      events.resetDeleteStockOutItemEvent();
      props.history.goBack();
    }
  }, [$deleteStockOutItem.success]);

  const { data, loading } = $shipmentItem;
  const dataSource = (data.products || []).map((product, index) => {
    const aggregations = [];
    const marks = [];
    product.aggregationCodes.forEach((code) => {
      aggregations.push(code);
    });
    product.markCodes.forEach((code) => {
      marks.push(code);
    });
    return {
      number: index + 1,
      vatBarCode: [...aggregations, ...marks].join("\n") || "",
      name: `${product.name} ${product.capacity || ""}`,
      unit: product.unit.name,
      qty: product.qty,
      totalSellingPrice: Number(product.totalSellingPrice || 0).toFixed(2),
      totalVatPrice: Number(product.totalVatPrice || 0).toFixed(2),
      totalSellingPriceWithoutVat: Number(product.totalSellingPriceWithoutVat || 0).toFixed(2),
      sellingPriceWithoutVat: Number(product.sellingPriceWithoutVat || 0).toFixed(2),
      vatData: product.vatRate ? (
        <>
          <div style={{fontSize: "12px"}}>{`НДС ${product.vatRate} %`}</div>
          <div>{`${(product.totalVatPrice).toFixed(2)} сум`}</div>
        </>
      ) : (
        <>
          <div style={{ fontSize: "12px" }}>Без НДС</div>
          <div>0 сум</div>
        </>
      ),
    };
  });

  const {
    stockNumber,
    transferDate,
    customer = { name: "" },
    warehouse = { name: "" },
    contractNumber,
    contractDate = null,
    invoice,
    branch = { name: "" },
    description,
  } = data;

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
          <h1>{stockNumber ?? "Отгрузка не найдена"}</h1>
        </div>
        <div className="content-h1-wr__right">
          <Show if={!invoice}>
            <Button
              danger
              type="primary"
              loading={$deleteStockOutItem.loading}
              style={{ marginRight: 15 }}
              onClick={() => effects.deleteStockOutItemEffect(id)}
            >
              Удалить
            </Button>
            <Button
              type="primary"
              onClick={() =>
                effects.createInvoiceEffect({
                  stockId: data.id,
                })
              }
            >
              Выписать счет-фактуру
            </Button>
          </Show>
        </div>
      </div>
      <div className="site-content__in">
        <Row gutter={16}>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Дата отгрузки"
            >
              <div className="f-w-b">
                {moment(transferDate).format(DATE_FORMAT)}
              </div>
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Клиент"
            >
              <div className="f-w-b">{customer.name}</div>
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Договор"
            >
              <div className="f-w-b">{contractNumber}</div>
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Дата договора"
            >
              <div className="f-w-b">
                {contractDate && moment(contractDate).format(DATE_FORMAT)}
              </div>
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Склад"
            >
              <div className="f-w-b">{warehouse && warehouse.name}</div>
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Филиал"
            >
              <div className="f-w-b">{branch && branch.name}</div>
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Счет-фактура"
            >
              <NavLink
                to={{
                  pathname: `/invoices/outgoing/${invoice?.id}`,
                }}
                exact
              >
                {invoice?.name || ""}
              </NavLink>
            </Form.Item>
          </Col>
        </Row>
        <div className="site-content__in__table">
          <Table
            className="custom-table"
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered={true}
            summary={(pageData) => {
              let totalQty = 0;
              let grandTotalSellingPrice = 0;
              let grandTotalVatPrice = 0;
              let grandTotalSellingPriceWithoutVat = 0;
              let grandSellingPriceWithoutVat = 0;

              pageData.forEach(
                ({
                  qty,
                  totalSellingPrice,
                  totalVatPrice,
                  totalSellingPriceWithoutVat,
                  sellingPriceWithoutVat,
                }) => {
                  totalQty += Number(qty);
                  grandTotalSellingPrice += Number(totalSellingPrice);
                  grandTotalVatPrice += Number(totalVatPrice);
                  grandTotalSellingPriceWithoutVat += Number(totalSellingPriceWithoutVat);
                  grandSellingPriceWithoutVat += Number(sellingPriceWithoutVat);
                }
              );

              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell
                    className="table-footer-total-title"
                    colSpan={4}
                  >
                    <Text strong>Итого:</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>{totalQty}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>{Number(grandSellingPriceWithoutVat || 0).toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>{Number(grandTotalSellingPriceWithoutVat || 0).toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>
                      {Number(grandTotalVatPrice || 0).toFixed(2)}
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>
                      {Number(grandTotalSellingPrice || 0).toFixed(2)}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />
          <Row gutter={16}>
            <Col>
              <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
                Комментарий:
              </div>
              <div className="f-w-b">{description}</div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
