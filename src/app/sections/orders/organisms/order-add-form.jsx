import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import {
  AddPlusSvg,
  ArrowSvg,
  MoveToInboxSvg,
  RemoveMinusSvg,
} from "svgIcons/svg-icons";
import moment from "moment";
import { debounce } from "helpers/debounce";

import clientEffector from "../../clients/effector";
import mainEffector from "../../../screens/main/effector";
import effector from "../effector";
import * as events from "../effector/events";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import Show from "ui/molecules/show";
import { DATE_FORMAT } from "../../../screens/main/constants";

const { store: mainStore, effects: mainEffects } = mainEffector;
const { store: clientStore, effects: clientEffects } = clientEffector;
const { store, effects } = effector;

const { Option } = Select;
const { TextArea } = Input;

const updateProductSearch = debounce((action) => {
  action();
}, 400);

const initialValues = {
  products: [
    {
      id: "",
      unitId: null,
      qty: null,
      price: null,
      totalPrice: null,
      vatRate: 0,
      vatPrice: null,
      totalVatPrice: null,
    },
  ],
  orderDate: moment(),
  shipmentDate: null,
  customerId: null,
  contractNumber: "",
  contractDate: null,
  status: null,
  description: "",
};

export const OrderAddForm = () => {
  const { $unitItems, $productItems } = useStore(mainStore);
  const { $clientsItems } = useStore(clientStore);
  const { $orderItem } = useStore(store);

  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    const { state: id } = history.location;
    clientEffects.getClientsItemsEffect();
    mainEffects.getProductItemsEffect();
    if (id) {
      effects.getOrderItemEffect({ id });
    }
    return () => {
      form.resetFields();
      events.resetOrderItemEffect();
    };
  }, []);

  useEffect(() => {
    if ($orderItem.data.id) {
      const {
        customer,
        status,
        supplier,
        products,
        orderDate,
        shipmentDate,
        contractDate,
        ...data
      } = $orderItem.data;
      const values = {
        ...data,
        orderDate: moment(orderDate),
        contractDate: moment(contractDate),
        shipmentDate: moment(shipmentDate),
        customerId: customer.id,
        status: status.code,
        products: products.map((item) => ({
          ...item,
          unitId: item.unit.id,
        })),
      };
      form.setFieldsValue(values);
    }
  }, [$orderItem.data]);

  const onSearchProducts = (search) => {
    updateProductSearch(() => {
      mainEffects.getProductItemsEffect({ search });
    });
  };

  const onClientChange = (id) => {
    const client = ($clientsItems.data || []).find((item) => item.id === id)
    form.setFieldsValue({
      contractDate: client?.contractNumber && moment(client.contractDate),
      contractNumber: client?.contractNumber,
    })
  }

  const onClientSearch = (search) => {
    updateProductSearch(() => {
      clientEffects.getClientsItemsEffect({ search });
    });
  };

  const onChangeProducts = (id, currentRow) => {
    const products = form.getFieldValue("products");
    const productItem = $productItems.data.find((i) => i.id === id);
    if (productItem) {
      const vatRate = productItem.vat.amount || 0;
      products[currentRow] = {
        ...products[currentRow],
        unitId: productItem.unit.id || null,
        vatRate,
        priceWithVat: productItem.price,
      };
    }
    form.setFieldsValue({ products });
  };

  const onChangePriceOrQuantity = (fieldKey, formTotalVatPrice) => {
    const valuesArray = form.getFieldValue("products");
    const values = valuesArray[fieldKey];
    const vatRate = values.vatRate || 0;
    const qty = Number(values.qty || 0);
    const clientVatRate = 1 + vatRate / 100;
    const priceWithVat = Number(values.priceWithVat || 0);
    const totalVatPrice = formTotalVatPrice || priceWithVat * qty;
    const vatPrice = totalVatPrice - totalVatPrice / clientVatRate;
    const totalPrice = totalVatPrice - vatPrice;
    const price = totalPrice / qty;
    const data = {
      qty: Number(qty || 0),
      price: Number(price || 0).toFixed(2),
      totalPrice: Number(totalPrice || 0).toFixed(2),
      vatPrice: Number(vatPrice || 0).toFixed(2),
      totalVatPrice: Number(totalVatPrice || 0).toFixed(2),
    };
    valuesArray[fieldKey] = {
      ...valuesArray[fieldKey],
      ...data,
    };
    form.setFieldsValue({ products: valuesArray });
  };

  const duplicateFormFieldsValue = () => {
    const values = form.getFieldValue("products");
    const products = [];
    values.forEach((item) => {
      products.push({
        ...item,
        ...values[0],
      });
    });
    form.setFieldsValue({
      products,
    });
  };

  const onSubmit = (values) => {
    const { state: id } = history.location;
    const data = {
      ...values,
      status: !values.status ? { code: "NEW" } : values.status,
      id,
    };
    (id
      ? effects.updateOrderItemEffect(data)
      : effects.saveOrderItemEffect(data)
    )
      .then((response) => {
        if (response.status === 200) {
          history.goBack();
        }
      })
      .catch((error) => {
        openNotificationWithIcon("error", error.message);
      });
  };

  const saveAsDraft = () => {
    const values = form.getFieldsValue(true);
    values.status = {
      code: "DRAFT",
    };
    onSubmit(values);
  };

  const clientsOptions = ($clientsItems.data || []).map((client) => (
    <Option key={client.id} value={client.id}>
      {client.name}
    </Option>
  ));
  const unitOptions = ($unitItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name}
    </Option>
  ));
  const productsOptions = ($productItems.data || []).map((item) => (
    <Option key={`${item.name} ${item.barcode}`} value={item.id}>
      {`${item.name} ${item.capacity || ""}`}
    </Option>
  ));

  return (
    <Form
      initialValues={initialValues}
      form={form}
      name="order"
      onFinish={onSubmit}
    >
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button
            className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left"
            onClick={() => history.goBack()}
          >
            <ArrowSvg />
          </Button>
          <h1>Добавить заказ</h1>
        </div>
        <div className="content-h1-wr__right">
          <Space>
            <Button
              className="custom-button primary-button"
              htmlType="button"
              onClick={saveAsDraft}
            >
              Сохранить как черновик
            </Button>
            <Button className="custom-button primary-button" htmlType="submit">
              Сохранить
            </Button>
          </Space>
        </div>
      </div>
      <div className="site-content__in">
        <div className="site-content__in__table">
          <Row gutter={16}>
            <Col sm={4}>
              <Form.Item
                name="orderDate"
                label=""
                rules={[{ required: true, message: "Обязательное поле" }]}
              >
                <DatePicker className="w-100" allowClear />
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                name="customerId"
                label=""
                rules={[{ required: true, message: "Выберите клиента" }]}
              >
                <Select
                  className="w-100"
                  placeholder="Выберите клиента"
                  onSearch={onClientSearch}
                  onChange={onClientChange}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear
                >
                  {clientsOptions}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                name="contractNumber"
                label=""
                rules={[{ required: true, message: "Объязательная поля" }]}
              >
                <Input placeholder="Договор" />
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                name="contractDate"
                label=""
                rules={[{ required: true, message: "Обязательное поле" }]}
              >
                <DatePicker
                  className="w-100"
                  placeholder="Дата договора"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                name="shipmentDate"
                label=""
                rules={[{ required: false, message: "Обязательное поле" }]}
              >
                <DatePicker
                  className="w-100"
                  placeholder="Дата отгрузки"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.List name="products">
            {(fields, { add, remove }) => {
              const currentListValues = form.getFieldValue("products");
              return (
                <>
                  <Row>
                    <Col sm={24}>
                      <div className="ant-table-wrapper">
                        <div className="ant-table">
                          <div className="ant-table-container">
                            <div className="ant-table-content">
                              <>
                                <table style={{ tableLayout: "auto" }}>
                                  <thead className="ant-table-thead">
                                    <tr>
                                      <th className="ant-table-cell">№</th>
                                      <th className="ant-table-cell">
                                        Наименование
                                      </th>
                                      <th className="ant-table-cell">
                                        Ед. Изм.
                                      </th>
                                      <th className="ant-table-cell">
                                        Количество
                                      </th>
                                      <th className="ant-table-cell">Цена</th>
                                      <th className="ant-table-cell">Сумма</th>
                                      <th className="ant-table-cell">
                                        НДС/Прод.Цена
                                      </th>
                                      <th className="ant-table-cell">Всего</th>
                                      <th className="ant-table-cell">
                                        Действия
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="ant-table-tbody">
                                    {fields.map((field, index) => {
                                      const currentRow =
                                        currentListValues[index];
                                      return (
                                        <tr
                                          className="ant-table-row ant-table-row-level-0"
                                          key={index}
                                          align="baseline"
                                        >
                                          <td
                                            key={index}
                                            style={{ width: "25px" }}
                                            className="ant-table-cell"
                                          >
                                            {index + 1}
                                          </td>
                                          <td
                                            key={index}
                                            style={{ width: "200px" }}
                                            className="ant-table-cell"
                                          >
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[field.name, "id"]}
                                              fieldKey={[field.fieldKey, "id"]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Выберите продукт",
                                                },
                                              ]}
                                            >
                                              <Select
                                                placeholder="Выберите"
                                                allowClear
                                                onSearch={onSearchProducts}
                                                onChange={(v) =>
                                                  onChangeProducts(v, index)
                                                }
                                                showSearch
                                                filterOption={(input, option) =>
                                                  option.key
                                                    .toLowerCase()
                                                    .indexOf(
                                                      input.toLowerCase()
                                                    ) >= 0
                                                }
                                              >
                                                {productsOptions}
                                              </Select>
                                            </Form.Item>
                                          </td>
                                          <td
                                            key={index}
                                            style={{ width: "100px" }}
                                            className="ant-table-cell"
                                          >
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[field.name, "unitId"]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "unitId",
                                              ]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Выберите ед. измерения",
                                                },
                                              ]}
                                            >
                                              <Select
                                                placeholder="Выберите"
                                                allowClear
                                                showSearch
                                                filterOption={(input, option) =>
                                                  option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                      input.toLowerCase()
                                                    ) >= 0
                                                }
                                              >
                                                {unitOptions}
                                              </Select>
                                            </Form.Item>
                                          </td>
                                          <td
                                            key={index}
                                            style={{ width: "70px" }}
                                            className="ant-table-cell"
                                          >
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[field.name, "qty"]}
                                              fieldKey={[field.fieldKey, "qty"]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Обязательное поле",
                                                },
                                              ]}
                                            >
                                              <InputNumber
                                                className="w-100"
                                                onChange={() =>
                                                  onChangePriceOrQuantity(
                                                    field.fieldKey
                                                  )
                                                }
                                              />
                                            </Form.Item>
                                          </td>
                                          <td
                                            key={index}
                                            style={{ width: "130px" }}
                                            className="ant-table-cell"
                                          >
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[field.name, "price"]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "price",
                                              ]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Объязательная поля",
                                                },
                                              ]}
                                            >
                                              <InputNumber
                                                className="w-100"
                                                disabled={true}
                                                onChange={() =>
                                                  onChangePriceOrQuantity(
                                                    field.fieldKey
                                                  )
                                                }
                                              />
                                            </Form.Item>
                                          </td>
                                          <td
                                            key={index}
                                            style={{ width: "130px" }}
                                            className="ant-table-cell"
                                          >
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[field.name, "totalPrice"]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "totalPrice",
                                              ]}
                                              rules={[
                                                {
                                                  required: false,
                                                  message:
                                                    "Выберите ед. измерения",
                                                },
                                              ]}
                                            >
                                              <InputNumber
                                                className="w-100"
                                                disabled={true}
                                                onChange={() =>
                                                  onChangePriceOrQuantity(
                                                    field.fieldKey
                                                  )
                                                }
                                              />
                                            </Form.Item>
                                          </td>
                                          <td
                                            key={index}
                                            style={{ width: "130px" }}
                                            className="ant-table-cell"
                                          >
                                            <Form.Item
                                              {...field}
                                              label=""
                                              style={{ height: "1rem" }}
                                              name={[field.name, "vatRate"]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "vatRate",
                                              ]}
                                            >
                                              {currentRow &&
                                              !currentRow.withoutVat &&
                                              currentRow.vatRate ? (
                                                <div
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  НДС -{" "}
                                                  {currentRow.vatRate || 0}%
                                                </div>
                                              ) : (
                                                <div
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  Без НДС
                                                </div>
                                              )}
                                            </Form.Item>
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[field.name, "vatPrice"]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "vatPrice",
                                              ]}
                                            >
                                              <div>
                                                {(currentRow &&
                                                  currentRow.vatPrice) ||
                                                  0}{" "}
                                                сум
                                              </div>
                                            </Form.Item>
                                          </td>
                                          <td
                                            key={index}
                                            style={{ width: "130px" }}
                                            className="ant-table-cell"
                                          >
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[
                                                field.name,
                                                "totalVatPrice",
                                              ]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "totalVatPrice",
                                              ]}
                                              rules={[
                                                {
                                                  required: "",
                                                  message: "",
                                                },
                                              ]}
                                            >
                                              <InputNumber
                                                className="w-100"
                                                onChange={(value) =>
                                                  onChangePriceOrQuantity(
                                                    field.fieldKey,
                                                    value
                                                  )
                                                }
                                              />
                                            </Form.Item>
                                          </td>
                                          <td
                                            key={index}
                                            style={{ width: "60px" }}
                                            className="ant-table-cell"
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                              }}
                                            >
                                              <Show if={fields.length > 1}>
                                                <Button
                                                  type="danger"
                                                  shape="circle"
                                                  style={{
                                                    marginRight: "1rem",
                                                  }}
                                                  onClick={() =>
                                                    remove(field.name)
                                                  }
                                                  icon={<RemoveMinusSvg />}
                                                />
                                              </Show>
                                              <Show if={index === 0}>
                                                <Button
                                                  type="primary"
                                                  shape="circle"
                                                  style={{
                                                    marginRight: "1rem",
                                                  }}
                                                  onClick={
                                                    duplicateFormFieldsValue
                                                  }
                                                  icon={<MoveToInboxSvg />}
                                                />
                                              </Show>
                                              <Show
                                                if={
                                                  fields.length &&
                                                  fields.length - 1 === index
                                                }
                                              >
                                                <Button
                                                  type="primary"
                                                  shape="circle"
                                                  onClick={() =>
                                                    add({ name: "" })
                                                  }
                                                  icon={<AddPlusSvg />}
                                                />
                                              </Show>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </>
              );
            }}
          </Form.List>
          <Row>
            <Col sm={24}>
              <Form.Item
                name="description"
                label=""
                style={{ marginTop: "1rem" }}
              >
                <TextArea rows={4} placeholder="Комментарий" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    </Form>
  );
};
