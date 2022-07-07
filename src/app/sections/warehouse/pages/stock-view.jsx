import React, { useEffect } from "react";
import { Button, Table, Form, Row, Col, Typography } from "antd";
import { ArrowSvg } from "svgIcons/svg-icons";
import effector from "../effector";
import { useStore } from "effector-react";
import moment from "moment";
import { DATE_FORMAT } from "../../../screens/main/constants";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

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
    key: 12,
    title: "Код",
    dataIndex: "code",
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
    key: "purchasePriceWithoutVat",
    title: "Цена",
    dataIndex: "purchasePriceWithoutVat",
  },
  {
    key: "totalPurchasePriceWithoutVat",
    title: "Ст. поставки",
    dataIndex: "totalPurchasePriceWithoutVat",
  },
  {
    key: 5,
    title: "Ст. поставки",
    dataIndex: "totalPurchasePrice",
  },
  {
    key: "markup",
    title: "Наценка",
    dataIndex: "markup",
    children: [
      {
        key: "markupPercent",
        title: "Процент",
        dataIndex: "markupPercent",
      },
      {
        key: "markupPrice",
        title: "Сумма",
        dataIndex: "markupPrice",
      },
    ],
  },
  {
    key: 6,
    title: "НДС",
    dataIndex: "vatData",
  },
  {
    key: 7,
    title: "Продажная цена",
    dataIndex: "totalSellingPrice",
  },
];

export const StockView = (props) => {
  const $stockItem = useStore(stores.$stockItem);
  const $deleteStockInItem = useStore(stores.$deleteStockInItem);
  const {
    match: {
      params: { id },
    },
  } = props;

  useEffect(() => {
    id && effects.getWarehouseStockItemEffect(id);
    return () => {
      events.resetWarehouseStockItemEvent();
    };
  }, []);

  useEffect(() => {
    if ($deleteStockInItem.success) {
      openNotificationWithIcon("success", "Товар удален");
      events.resetDeleteStockInItemEvent();
      props.history.goBack();
    }
  }, [$deleteStockInItem.success]);

  const { data, loading } = $stockItem;
  const dataSource = (data.products || []).map((product, index) => ({
    number: index + 1,
    code: product.aggregationCodes.length ? product.aggregationCodes.join(",\n") : "",
    name: `${product.name} ${product.capacity || ""}`,
    unit: product.unit.name,
    qty: product.qty,
    markupPercent: (product.markupPercent || 0),
    markupPrice: (product.markupPrice || 0).toFixed(2),
    purchasePriceWithoutVat: (product.purchasePriceWithoutVat || 0).toFixed(2),
    totalPurchasePriceWithoutVat: (product.totalPurchasePriceWithoutVat || 0).toFixed(2),
    totalPurchasePrice: (product.totalPurchasePrice || 0).toFixed(2),
    totalSellingPrice: (product.totalSellingPrice || 0).toFixed(2),
    totalVatPrice: (product.totalVatPrice || 0).toFixed(2),
    vatData: product.vatRate ? (
      <>
        <div style={{ fontSize: "12px" }}>{`НДС ${product.vatRate} %`}</div>
        <div>{`${product.totalVatPrice} сум`}</div>
      </>
    ) : (
      <>
        <div style={{ fontSize: "12px" }}>Без НДС</div>
        <div>0 сум</div>
      </>
    ),
  }));
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
          <h1>{data.stockNumber ?? "Приход не найден"}</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button
            type="primary"
            danger
            loading={$deleteStockInItem.loading}
            onClick={() => effects.deleteStockInItemEffect(id)}
          >
            Удалить
          </Button>
        </div>
      </div>
      <div className="site-content__in">
        <Row gutter={16}>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Дата прихода"
            >
              <div className="f-w-b">
                {data.transferDate &&
                  moment(data.transferDate).format(DATE_FORMAT)}
              </div>
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Накладная №"
            >
              <div className="f-w-b">{data.consignmentNumber}</div>
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Поставщик"
            >
              <div className="f-w-b">{data.supplier && data.supplier.name}</div>
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Склад"
            >
              <div className="f-w-b">
                {data.warehouse && data.warehouse.name}
              </div>
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Филиал"
            >
              <div className="f-w-b">{data.branch && data.branch.name}</div>
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item
              labelCol={{ sm: { span: 24 } }}
              labelAlign="left"
              label="Номер фактуры"
            >
              <div className="f-w-b">{data.facturaNumber}</div>
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
              let grandQty = 0;
              let grandTotalSellingPrice = 0;
              let grandTotalPurchasePrice = 0;
              let grandTotalVatPrice = 0;
              let grandPurchasePriceWithoutVat = 0;
              let grandTotalPurchasePriceWithoutVat = 0;
              let grandMarkupPrice = 0;

              pageData.forEach(({
                                  qty,
                                  totalSellingPrice,
                                  totalPurchasePrice,
                                  totalVatPrice,
                                  markupPrice,
                                  purchasePriceWithoutVat,
                                  totalPurchasePriceWithoutVat
                                }) => {
                grandQty += Number(qty);
                grandTotalSellingPrice += Number(totalSellingPrice);
                grandTotalPurchasePrice += Number(totalPurchasePrice);
                grandTotalVatPrice += Number(totalVatPrice);
                grandPurchasePriceWithoutVat += Number(purchasePriceWithoutVat);
                grandTotalPurchasePriceWithoutVat += Number(totalPurchasePriceWithoutVat);
                grandMarkupPrice += Number(markupPrice);
              });

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      className="table-footer-total-title"
                      colSpan={4}
                    >
                      <Text strong>Итого:</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text strong>{grandQty}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text strong>{grandPurchasePriceWithoutVat}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text strong>{grandTotalPurchasePriceWithoutVat}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text strong>{grandTotalPurchasePrice}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text strong/>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text strong>{grandMarkupPrice}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text strong>{grandTotalVatPrice}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text strong>{grandTotalSellingPrice}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
          <Row gutter={16}>
            <Col>
              <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
                Комментарий:
              </div>
              <div className="f-w-b">{data.description}</div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
