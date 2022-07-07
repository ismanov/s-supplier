import React, { useEffect } from "react";
import { Button, Table, Form, Row, Col, Typography } from "antd";
import { ArrowSvg } from "svgIcons/svg-icons";
import effector from "../effector";
import { useStore } from "effector-react";
import moment from "moment";
import { DATE_FORMAT, ORDER_STATUSES } from "../../../screens/main/constants";
import { NavLink } from "react-router-dom";
import Show from "ui/molecules/show";

const { store, effects, events } = effector;
const { Text } = Typography;

const columns = [
  {
    key: "number",
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
    key: "unit",
    title: "Ед. Изм",
    dataIndex: "unit",
  },
  {
    key: "qty",
    title: "Количество",
    dataIndex: "qty",
  },
  {
    key: "price",
    title: "Цена",
    dataIndex: "price",
  },
  {
    key: "totalPrice",
    title: "Сумма",
    dataIndex: "totalPrice",
  },
  {
    key: "vatData",
    title: "НДС/Прод.Цена",
    dataIndex: "vatData",
  },
  {
    key: "totalVatPrice",
    title: "Всего",
    dataIndex: "totalVatPrice",
  },
];

export const OrderView = (props) => {
  const { $orderItem } = useStore(store);
  const {
    match: {
      params: { id },
    },
  } = props;

  useEffect(() => {
    id && effects.getOrderItemEffect({ id });
    return () => {
      events.resetOrderItemEffect();
    };
  }, []);

  const onChangeStatus = (values) => {
    effects.updateOrderStatusEffect(values).then((response) => {
      if (response.status === 200) {
        id && effects.getOrderItemEffect({ id });
      }
    });
  };

  const { data, loading } = $orderItem;
  const dataSource = (data.products || []).map((product, index) => (
    {
      ...product,
      number: index + 1,
      name: `${product.name} ${product.capacity || ""}`,
      unit: product.unit.name,
      price: (product.price || 0).toFixed(2),
      totalPrice: (product.totalPrice || 0).toFixed(2),
      totalVatPrice: (product.totalVatPrice || 0).toFixed(2),
      vatPrice: (product.vatPrice || 0).toFixed(2),
      vatData: product.vatRate ? (
        <>
          <div style={{ fontSize: "12px" }}>{`НДС ${product.vatRate} %`}</div>
          <div>{`${product.vatPrice} сум`}</div>
        </>
      ) : (
        <>
          <div style={{ fontSize: "12px" }}>Без НДС</div>
          <div>0 сум</div>
        </>
      ),
    }
  ));

  const {
    orderNumber,
    orderDate,
    shipmentDate,
    contractDate,
    customer = { name: "" },
    contractNumber = "",
    description,
    id: orderId = null,
    status = { code: "" },
    stock,
  } = data;
  const canShip =
    (id && !stock && status.code === ORDER_STATUSES.NEW) ||
    status.code === ORDER_STATUSES.APPROVED;

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
          <h1>{orderNumber ?? "Заказ не найден"}</h1>
        </div>
        <div className="content-h1-wr__right">
          <Show if={["DRAFT", "NEW"].includes(String(status?.code))}>
            <Button
              style={{ marginRight: 15 }}
              type="ghost"
              onClick={() =>
                props.history.push({
                  pathname: "/warehouse/orders/add",
                  state: orderId,
                })
              }
            >
              Редактировать
            </Button>
          </Show>
          <Show if={status.code === "NEW"}>
            <Button
              danger
              type="primary"
              style={{ marginRight: 15 }}
              onClick={() =>
                onChangeStatus({ status: "REJECTED", id: orderId })
              }
            >
              Отклонить
            </Button>
          </Show>
          <Show if={status.code === "NEW"}>
            <Button
              style={{ marginRight: 15 }}
              type="primary"
              onClick={() =>
                onChangeStatus({ status: "APPROVED", id: orderId })
              }
            >
              Одобрить
            </Button>
          </Show>
          <Show if={status.code === "APPROVED"}>
            <Button
              style={{ marginRight: 15 }}
              type="primary"
              onClick={() =>
                onChangeStatus({ status: "IN_PROGRESS", id: orderId })
              }
            >
              В процессе
            </Button>
          </Show>
          <Show if={canShip}>
            <NavLink
              to={{
                pathname: "/warehouse/shipment/add",
                state: {
                  orderId,
                },
              }}
              exact
            >
              <Button>Отгрузить</Button>
            </NavLink>
          </Show>
        </div>
      </div>
      <div className="site-content__in">
        <Row gutter={16}>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Дата заказа"
            >
              <div className="f-w-b">
                {moment(orderDate).format(DATE_FORMAT)}
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
              label="Дата Договора"
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
              label="Дата отгрузки"
            >
              <div className="f-w-b">
                {shipmentDate && moment(shipmentDate).format(DATE_FORMAT)}
              </div>
            </Form.Item>
          </Col>
        </Row>
        <div className="site-content__in__table">
          <Table
            className="custom-table"
            loading={loading}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered={true}
            summary={(pageData) => {
              let grandQty = 0;
              let grandVatPrice = 0;
              let grandPrice = 0;
              let grandTotalPrice = 0;
              let grandTotalVatPrice = 0;

              pageData.forEach(
                ({ qty, price, totalPrice, totalVatPrice, vatPrice }) => {
                  grandVatPrice += Number(vatPrice || 0);
                  grandQty += Number(qty || 0);
                  grandPrice += Number(price || 0);
                  grandTotalPrice += Number(totalPrice || 0);
                  grandTotalVatPrice += Number(totalVatPrice || 0);
                }
              );

              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell
                    className="table-footer-total-title"
                    colSpan={3}
                  >
                    <Text strong>Итого:</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>{grandQty}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>{Number(grandPrice || 0).toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>{Number(grandTotalPrice || 0).toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>{Number(grandVatPrice || 0).toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>{Number(grandTotalVatPrice || 0).toFixed(2)}</Text>
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
