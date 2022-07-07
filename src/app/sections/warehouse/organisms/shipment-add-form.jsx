import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  Input,
  Progress,
  Checkbox,
} from "antd";
import {
  AddPlusSvg,
  ArrowSvg,
  CloseModalSvg,
  CodeScannerSvg,
  MoveToInboxSvg,
  RemoveMinusSvg,
} from "svgIcons/svg-icons";
import moment from "moment";
import BarcodeReader from "react-barcode-reader";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { debounce } from "helpers/debounce";

import effector from "../effector";
import userEffector from "../../user/effector";
import clientEffector from "../../clients/effector";
import orderEffector from "../../orders/effector";
import mainEffector from "../../../screens/main/effector";
import { checkToCyrillic, cyrillicPattern, DATE_FORMAT } from "../../../screens/main/constants";
import Show from "ui/molecules/show";
import { checkCodesToExists, isAggregation, translateCodeRuEn } from "../../Invoices/helpers";

const { stores, effects } = effector;
const { store: userStore, effects: userEffects } = userEffector;
const { store: mainStore } = mainEffector;
const { store: clientStore, effects: clientEffects } = clientEffector;
const {
  store: orderStore,
  effects: orderEffects,
  events: orderEvents,
} = orderEffector;

const { Option } = Select;
const { TextArea } = Input;

const formModes = [
  { code: "DEFAULT", name: "Вручную" },
  { code: "ORDER", name: "По заказу" },
  { code: "SCAN", name: "Сканировать код" },
];

const productInitialValues = {
  id: null,
  name: "",
  qty: null,
  unitId: null,
  vatRate: null,
  vatPrice: null,
  qtyInPackage: null,
  sellingPrice: null,
  codesVisible: false,
  totalVatPrice: null,
  aggregationCodes: [],
  totalSellingPrice: null,
};
const initialValues = {
  transferDate: moment(),
  customerId: null,
  orderId: null,
  description: "",
  contractNumber: "",
  contractDate: null,
  products: [productInitialValues],
};
const updateProductSearch = debounce((action) => {
  action();
}, 400);
export const ShipmentAddForm = (props) => {
  const orderId = props.location?.state?.orderId;
  const stockInId = props.location?.state?.stockInId;
  const $wareHousesItems = useStore(stores.$wareHousesItems);
  const $stockItems = useStore(stores.$stockItems);
  const $stockItem = useStore(stores.$stockItem);
  const { $branchesItems } = useStore(userStore);
  const { $unitItems } = useStore(mainStore);
  const { $clientsItems } = useStore(clientStore);
  const { $orderItems, $orderItem } = useStore(orderStore);

  const [formMode, setFormMode] = useState(formModes[0].code);
  const [startScan, setStartScan] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    orderEffects.getOrderItemsEffect({ used: false });
    return () => {
      form.setFieldsValue(initialValues);
      orderEvents.resetOrderItemEffect();
    };
  }, []);

  useEffect(() => {
    if (!!orderId) {
      onChangeFormMode(formModes[1].code);
      form.setFieldsValue({ orderId });
      userEffects.getBranchesItemsEffect().then((response) => {
        effects.getWarehouseListLookupEffect({
          status: "ACTIVE",
          branchId: response.data[0]?.id
        }).then((response) => {
          orderEffects.getOrderItemEffect({ id: orderId, warehouseId: response.data[0]?.id });
          form.setFieldsValue({ warehouseId: response.data[0]?.id })
        })
      });
    }
  }, [orderId]);

  useEffect(() => {
    if (!!orderId) {
      onChangeFormMode(formModes[1].code);
      onChangeOrder(orderId);
      form.setFieldsValue({ orderId });
    }
  }, [orderId]);

  useEffect(() => {
    if (!!stockInId) {
      effects.getWarehouseStockItemEffect(stockInId);
    }
  }, [stockInId]);


  useEffect(() => {
    if ($stockItem.data.id) {
      const {
        data: {
          products: stockProducts,
        },
      } = $stockItem;
      const products = stockProducts.map((product) => {
        const vatRate = product.vatRate || 0;
        const clientVatRate = 1 + vatRate / 100;
        const qty = Number(product.qty || 0);
        const qtyInStock = Number(product.qty || 0);
        const totalSellingPrice = Number(product.totalSellingPrice || 0);
        const initialProductPrice = Number(product.totalSellingPrice || 0) / qty;
        const priceData = getPrice(totalSellingPrice, qty, clientVatRate);
        return {
          ...product,
          unitId: product.unit.id,
          unitName: product.unit.name,
          qtyInStock,
          qty,
          vatRate,
          withoutVat: !vatRate,
          aggregationCodes: product.aggregationCodes || [],
          markCodes: product.markCodes || [],
          ...priceData,
          initialProductPrice
        };
      });
      form.setFieldsValue({
        products
      });
    }
  }, [$stockItem.data]);

  useEffect(() => {
    if ($orderItem.data.id) {
      const {
        data: {
          products: orderProducts,
          customer,
          contractNumber,
          contractDate,
        },
      } = $orderItem;

      const products = orderProducts.map((product) => {
        const vatRate = product.vatRate || 0;
        const clientVatRate = 1 + vatRate / 100;
        const qty = Number(product.qty || 0);
        const qtyInStock = Number(product.qtyInWarehouse || 0);
        const totalSellingPrice = Number(product.totalVatPrice || 0);
        const initialProductPrice = Number(product.totalVatPrice || 0) / qty;
        const priceData = getPrice(totalSellingPrice, qty, clientVatRate);
        return {
          ...product,
          unitId: product.unit.id,
          unitName: product.unit.name,
          qtyInStock,
          qty,
          vatRate,
          withoutVat: !vatRate,
          aggregationCodes: [],
          ...priceData,
          initialProductPrice
        };
      });
      form.setFieldsValue({
        products,
        customer: customer.name,
        customerId: customer.id,
        contractDate: contractDate && moment(contractDate),
        contractNumber,
      });
    }
  }, [$orderItem.data]);

  useEffect(() => {
    // set branch if branches are no more of one & fetch warehouses, products by branchId
    let branchId;
    if ($branchesItems?.data.length === 1) {
      branchId = $branchesItems.data[0].id;
    } else {
      branchId = ($branchesItems?.data || []).find((item) => item.main)?.id
    }
    form.setFieldsValue({ branchId });
    effects.getWarehouseStockItemsEffect({ branchId });
    effects.getWarehouseListLookupEffect({ status: "ACTIVE", branchId });
  }, [$branchesItems]);

  useEffect(() => {
    //set warehouse if warehouses are no more of one
    let warehouseId;
    if ($wareHousesItems?.data.length === 1) {
      warehouseId = $wareHousesItems.data[0].id;
    } else {
      warehouseId = ($wareHousesItems?.data || []).find((item) => item.main)?.id
    }
    form.setFieldsValue({ warehouseId });
  }, [$wareHousesItems]);

  const getPrice = (totalSellingPrice, qty, clientVatRate) => {
    const sellingPrice = Number(totalSellingPrice || 0) / qty;
    const totalVatPrice = Number(totalSellingPrice - totalSellingPrice / clientVatRate || 0);
    const vatPrice = Number(totalVatPrice / qty || 0);
    const totalSellingPriceWithoutVat = !qty ? 0 : Number(totalSellingPrice - totalVatPrice || 0);
    const sellingPriceWithoutVat = !qty ? 0 : Number(totalSellingPriceWithoutVat / qty || 0);
    return {
      vatPrice: Number(vatPrice || 0).toFixed(2),
      totalVatPrice: Number(totalVatPrice || 0).toFixed(2),
      sellingPrice: Number(sellingPrice || 0).toFixed(2),
      totalSellingPrice: Number(totalSellingPrice || 0).toFixed(2),
      sellingPriceWithoutVat: Number(sellingPriceWithoutVat || 0).toFixed(2),
      totalSellingPriceWithoutVat: Number(totalSellingPriceWithoutVat || 0).toFixed(2),
    };
  }

  const onChangeBranch = (branchId) => {
    form.setFieldsValue({ branchId });
    effects.getWarehouseStockItemsEffect({ branchId });
    effects.getWarehouseListLookupEffect({ status: "ACTIVE", branchId });
  };

  const onChangeWarehouse = (warehouseId) => {
    if (!!orderId) {
      orderEffects.getOrderItemEffect({ id: orderId, warehouseId });
    }
  };

  const onChangeOrder = (id) => {
    const warehouseId = form.getFieldValue("warehouseId")
    orderEffects.getOrderItemEffect({ id, warehouseId });
  };

  const onChangeProduct = (option, fieldKey) => {
    const productData = $stockItems.data.find(
      (item) => item.id === option.value
    );
    const products = form.getFieldValue("products");
    const currentRow = products[fieldKey];
    const productValue = {
      name: option.children,
      id: option.value,
    };
    if (productData && productData.id) {
      const { unit, vat, price, qty, qtyInPackage } = productData;
      const vatRate = vat.amount || 0;
      productValue.unitId = unit.id;
      productValue.unitName = unit.name;
      productValue.qtyInStock = qty;
      productValue.qty = 0;
      productValue.vatPrice = 0;
      productValue.totalVatPrice = 0;
      productValue.totalSellingPrice = 0;
      productValue.sellingPriceWithoutVat = 0;
      productValue.totalSellingPriceWithoutVat = 0;
      productValue.qtyInPackage = qtyInPackage || null;
      productValue.totalSellingPrice = price;
      productValue.initialProductPrice = price;
      productValue.vatRate = vatRate;
      productValue.withoutVat = !vat.amount;
    }
    products[fieldKey] = {
      ...currentRow,
      ...productValue,
    };
    form.setFieldsValue({
      products,
    });
    if (formMode === "DEFAULT") {
      onChangeQtyInPackage(fieldKey)
    }
  };

  const onSearchProducts = (search) => {
    updateProductSearch(() => {
      const branchId = form.getFieldValue("branchId");
      effects.getWarehouseStockItemsEffect({ branchId, search });
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

  const onChangeFormMode = (mode) => {
    setFormMode(mode);
    setStartScan(false);
    orderEvents.resetOrderItemEffect();
    form.setFieldsValue(initialValues);
  };
  const onChangePriceOrQuantity = (fieldKey, clearProductInitialPrice = false) => {
    const valuesArray = form.getFieldValue("products");
    const values = valuesArray[fieldKey];
    const vatRate = values.vatRate || 0;
    const qty = Number(values.qty || 0);
    const clientVatRate = 1 + vatRate / 100;
    const initialProductPrice = clearProductInitialPrice ? 0 : Number(values.initialProductPrice) || 0;
    const totalSellingPrice = initialProductPrice ? initialProductPrice * qty : Number(values.totalSellingPrice || 0);
    const priceData = getPrice(totalSellingPrice, qty, clientVatRate);
    valuesArray[fieldKey] = {
      ...valuesArray[fieldKey],
      ...priceData,
      initialProductPrice,
      qty,
    };
    form.setFieldsValue({ products: valuesArray });
  };

  const duplicateFormFieldsValue = () => {
    const values = form.getFieldValue("products");
    const products = [];
    values.forEach((item, idx) => {
      products.push({
        ...item,
        ...values[0],
        aggregationCodes: [],
      });
    });
    form.setFieldsValue({
      products,
    });
  };

  const onSubmit = (values) => {
    if (
      formMode === "SCAN" &&
      values.products.find((item) => !item.aggregationCodes.length)
    ) {
      values.products = values.products.slice(0, values.products.length - 1);
    }
    const { products } = values;
    products.forEach((product, index) => {
      const marks = [];
      const aggregations = [];
      product.aggregationCodes.forEach((code) => {
        if (isAggregation(code)) {
          aggregations.push(code);
        } else {
          marks.push(code);
        }
      });
      let priceData = {};
      if (!product.totalSellingPriceWithoutVat) {
        const clientVatRate = 1 + (product.vatRate || 0) / 100;
        const totalSellingPrice = Number(product.totalSellingPrice);
        const qty = Number(product.qty)
        priceData = getPrice(totalSellingPrice, qty, clientVatRate);
      }
      product = {
        ...product,
        ...priceData,
        aggregationCodes: aggregations,
        markCodes: marks
      }
      products[index] = product
    })
    values.products = products;
    const data = {
      transferDate: moment(values.transferDate).format(),
      ...values,
    };
    effects.saveWarehouseShipmentItemEffect(data).then((response) => {
      if (response.status === 200) {
        history.push({ pathname: "/warehouse/shipment" });
      }
    });
  };

  const onScan = (code) => {
    if (checkToCyrillic(code)) {
      code = translateCodeRuEn(code)
    }
    const products = form.getFieldValue("products");
    const currentRow = products.length - 1;
    if (checkCodesToExists(products, code))
      return openNotificationWithIcon("warning", "Код уже добавлен!");
    effects
      .getWarehouseStockItemsEffect({ aggregationCode: code })
      .then(({ data }) => {
        const product = data[0];
        if (product) {
          const { unit, vat, price, aggregationOrMarkQty, id, name } = product;
          const vatRate = Number(vat.amount || 0);
          const qty = Number(aggregationOrMarkQty || 0);
          const clientVatRate = 1 + vatRate / 100;
          const sellingPrice = Number(price || 0);
          const initialProductPrice = Number(price || 0);
          const totalSellingPrice = Number(sellingPrice * qty || 0);
          const priceData = getPrice(totalSellingPrice, qty, clientVatRate);
          products[currentRow] = {
            ...product[currentRow],
            ...priceData,
            initialProductPrice,
            id,
            name,
            unitId: unit.id,
            qtyInStock: qty,
            qty: qty,
            vatRate,
            withoutVat: !vatRate,
          };
        }
        products[currentRow].aggregationCodes = [code];
        products.push({ id: null, aggregationCodes: [] });
        form.setFieldsValue({
          products,
        });
      });
  };

  const onScanForOrder = (newCode, currentRow) => {
    if (checkToCyrillic(newCode)) {
      newCode = translateCodeRuEn(newCode)
    }
    const values = form.getFieldsValue(true);
    const { products } = values;
    let { qty, qtyInPackage } = products[currentRow];
    qtyInPackage = !qtyInPackage ? 1 : qtyInPackage;
    if (checkCodesToExists(products, newCode))
      return openNotificationWithIcon("warning", "Код уже добавлен!");
    const aggregationCodes = [...products[currentRow].aggregationCodes];
    let scanLimit = qty
    aggregationCodes.forEach((code) => {
      if (isAggregation(code)) {
        scanLimit = scanLimit - qtyInPackage;
      } else {
        scanLimit = scanLimit - 1;
      }
    });
    if (aggregationCodes.length && scanLimit === 0) {
      return openNotificationWithIcon(
        "success",
        "Отсканировано необходимое количество товаров для этой строки"
      );
    }
    if (scanLimit < qtyInPackage && isAggregation(newCode)) {
      return openNotificationWithIcon(
        "success",
        "Отсканировано необходимое количество агрегации для этой строки"
      );
    }
    aggregationCodes.push(newCode);
    products[currentRow] = {
      ...products[currentRow],
      aggregationCodes,
      qtyInPackage,
      scanLimit,
      qty
    };
    form.setFieldsValue({ products });
  };

  const onScanForDefault = (newCode, currentRow) => {
    if (checkToCyrillic(newCode)) {
      newCode = translateCodeRuEn(newCode)
    }
    const values = form.getFieldsValue(true);
    const { products } = values;
    let { qtyInPackage, qty = 0 } = products[currentRow];
    qtyInPackage = !qtyInPackage ? 1 : qtyInPackage
    if (checkCodesToExists(products, newCode))
      return openNotificationWithIcon("warning", "Код уже добавлен!");
    const aggregationCodes = [...products[currentRow].aggregationCodes];
    aggregationCodes.push(newCode);
    const data = {
      aggregationCodes,
      qty: !isAggregation(newCode) ? qty + 1 : qty + qtyInPackage,
      qtyInPackage
    }
    products[currentRow] = {
      ...products[currentRow],
      ...data,
    };
    form.setFieldsValue({ products });
    onChangePriceOrQuantity(currentRow);
  }

  const onDeleteCodeByRow = (code, currentRow) => {
    const products = form.getFieldValue("products");
    const values = products[currentRow];
    const aggregationCodes = values.aggregationCodes.filter(
      (item) => item !== code
    );
    if (formMode === "DEFAULT") {
      products[currentRow] = {
        ...products[currentRow],
        qty: aggregationCodes.length * values.qtyInPackage
      }
    }
    products[currentRow] = {
      ...products[currentRow],
      aggregationCodes,
    };
    form.setFieldsValue({ products });
    isDefault && onChangePriceOrQuantity(currentRow);
  };

  const onChangeQtyInPackage = (currentRow) => {
    if (!isDefault) return;
    const products = form.getFieldValue("products");
    const values = products[currentRow];
    const aggregationCodes = [];
    const notAggregationCodes = [];
    values.aggregationCodes.forEach((item) => {
      if (isAggregation(item)) {
        aggregationCodes.push(item)
      } else {
        notAggregationCodes.push(item)
      }
    })

    products[currentRow] = {
      ...products[currentRow],
      qty: (aggregationCodes.length * values.qtyInPackage) + notAggregationCodes.length || products[currentRow]?.qty,
    };
    form.setFieldsValue({ products });
    onChangePriceOrQuantity(currentRow);
  }

  const setCodesRowVisible = (currentRow, open) => {
    const products = form.getFieldValue("products");
    products.forEach((row) => {
      row.codesVisible = false;
    });
    products[currentRow] = {
      ...products[currentRow],
      codesVisible: open,
    };
    form.setFieldsValue({ products });
    setStartScan(open);
  };

  const clientsOptions = ($clientsItems.data || []).map((client) => (
    <Option key={client.id} value={client.id}>
      {client.name}
    </Option>
  ));
  const branchOptions = ($branchesItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name}
    </Option>
  ));
  const warehouseOptions = ($wareHousesItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name}
    </Option>
  ));
  const unitOptions = ($unitItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name}
    </Option>
  ));
  const productsOptions = ($stockItems.data || []).map((item) => (
    <Option key={`${item.name} ${item.barcode}`} value={item.id}>
      {`${item.name} ${item.capacity || ""}`}
    </Option>
  ));
  const orderOptions = ($orderItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name}
    </Option>
  ));

  const isOrder = formMode === "ORDER";
  const isScan = formMode === "SCAN";
  const isDefault = formMode === "DEFAULT"

  return (
    <Form
      form={form}
      initialValues={initialValues}
      name="warehouse-income"
      onFinish={onSubmit}
    >
      <Show if={isScan && startScan}>
        <BarcodeReader onScan={onScan} timeBeforeScanTest={300}/>
      </Show>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button
            className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left"
            onClick={() => history.goBack()}
          >
            <ArrowSvg/>
          </Button>
          <h1>Отгрузка товара</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button className="custom-button primary-button" htmlType="submit">
            Сохранить
          </Button>
        </div>
      </div>
      <div className="site-content__in">
        <div className="site-content__in__table">
          <Row gutter={16}>
            <Col sm={4}>
              <Select
                className="w-100"
                placeholder=""
                value={formMode}
                onChange={onChangeFormMode}
                disabled={startScan}
              >
                {formModes.map((item) => (
                  <Option value={item.code} key={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Show if={isOrder}>
              <Col sm={4}>
                <Form.Item
                  name="orderId"
                  label=""
                  rules={[{ required: isOrder, message: "Обязательное поле" }]}
                >
                  <Select
                    className="w-100"
                    placeholder="Выберите заказ"
                    disabled={startScan}
                    showSearch
                    onChange={onChangeOrder}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    allowClear
                  >
                    {orderOptions}
                  </Select>
                </Form.Item>
              </Col>
            </Show>
            <Show if={isScan}>
              <Col sm={4}>
                <Button
                  className={`w-100 custom-button ${
                    startScan ? "success-button" : "primary-button"
                  }`}
                  onClick={() => setStartScan(!startScan)}
                >
                  {startScan ? "Завершить сканирование" : "Начать сканирование"}
                </Button>
              </Col>
            </Show>
            <Col sm={4}>
              <Form.Item
                name="transferDate"
                label=""
                rules={[{ required: false, message: "Обязательное поле" }]}
              >
                <DatePicker
                  className="w-100"
                  format={DATE_FORMAT}
                  disabled={startScan}
                />
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                style={!isOrder ? { display: "none" } : {}}
                name="customer"
                label=""
              >
                <Input disabled={isOrder}/>
              </Form.Item>
              <Form.Item
                style={isOrder ? { display: "none" } : {}}
                name="customerId"
                label=""
                rules={[{ required: true, message: "Выберите клиента" }]}
              >
                <Select
                  className="w-100"
                  disabled={isOrder || startScan}
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
                rules={[{ required: true, message: "Обязательное поле" }]}
              >
                <Input disabled={startScan} placeholder="Договор"/>
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
                  format={DATE_FORMAT}
                  disabled={startScan}
                  placeholder="Дата договора"
                />
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                name="warehouseId"
                label=""
                rules={[{ required: true, message: "Обязательное поле" }]}
              >
                <Select
                  className="w-100"
                  disabled={startScan}
                  onChange={onChangeWarehouse}
                  placeholder="Выберите склад"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {warehouseOptions}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                name="branchId"
                label=""
                rules={[{ required: true, message: "Обязательное поле" }]}
              >
                <Select
                  className="w-100"
                  onChange={onChangeBranch}
                  disabled={startScan}
                  placeholder="Выберите филиал"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {branchOptions}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.List name="products">
            {(fields, { add, remove }) => {
              const currentListValues = form.getFieldValue("products");
              const orderId = form.getFieldValue("orderId");
              return (
                <>
                  <Row>
                    <Col sm={24}>
                      <div className="ant-table-wrapper">
                        <div className="ant-table">
                          <div className="ant-table-container">
                            <div className="ant-table-content">
                              <>
                                <table style={{ tableLayout: "fixed" }}>
                                  <col span="1"/>
                                  <thead className="ant-table-thead">
                                  <tr>
                                    <th
                                      className="ant-table-cell"
                                      style={{ width: 25 }}
                                    >
                                      №
                                    </th>
                                    <Show if={(isOrder && orderId) || isDefault}>
                                      <th
                                        className="ant-table-cell"
                                        style={{ width: "42px" }}
                                      />
                                    </Show>
                                    <Show if={isScan}>
                                      <th className="ant-table-cell">Код</th>
                                    </Show>
                                    <th
                                      className="ant-table-cell"
                                      style={{ width: "250px" }}
                                    >
                                      Наименование
                                    </th>
                                    <Show if={(isOrder && orderId) || isDefault}>
                                      <th
                                        className="ant-table-cell"
                                        style={{ width: "120px" }}
                                      >
                                        Кол-во в упак.
                                      </th>
                                    </Show>
                                    <th
                                      className="ant-table-cell"
                                      style={{ width: "130px" }}
                                    >
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
                                    <th
                                      className="ant-table-cell"
                                      style={{ width: "100px" }}
                                    >
                                      Действия
                                    </th>
                                  </tr>
                                  </thead>
                                  <tbody className="ant-table-tbody">
                                  {fields.map((field, index) => {
                                    const currentRow =
                                      currentListValues[index];
                                    let {
                                      aggregationCodes = [],
                                      codesVisible,
                                      withoutVat = true,
                                      vatRate = 0,
                                      totalVatPrice = 0,
                                      qty = 0,
                                      qtyInPackage,
                                      unitName = "",
                                    } = currentRow;
                                    let scanLimitOfOrder = qty;
                                    if (isOrder) {
                                      aggregationCodes.forEach((code) => {
                                        if (isAggregation(code)) {
                                          scanLimitOfOrder = scanLimitOfOrder - qtyInPackage;
                                        } else {
                                          scanLimitOfOrder = scanLimitOfOrder - 1;
                                        }
                                      })

                                    }
                                    return (
                                      <>
                                        <tr
                                          className="ant-table-row ant-table-row-level-0"

                                          align="baseline"
                                        >
                                          <td className="ant-table-cell">
                                            {index + 1}
                                          </td>
                                          <Show if={(isOrder && orderId) || isDefault}>
                                            <td>
                                              <div
                                                className="table-scan-icon"
                                                onClick={() =>
                                                  setCodesRowVisible(
                                                    index,
                                                    !codesVisible
                                                  )
                                                }
                                              >
                                                <CodeScannerSvg/>
                                              </div>
                                            </td>
                                          </Show>
                                          <Show if={isScan}>
                                            <td className="ant-table-cell">
                                              <Form.Item
                                                {...field}
                                                label=""
                                                name={[
                                                  field.name,
                                                  "aggregationCodes",
                                                ]}
                                                fieldKey={[
                                                  field.fieldKey,
                                                  "aggregationCodes",
                                                ]}
                                                rules={[
                                                  {
                                                    required: false,
                                                    message:
                                                      "Отсканируйте код",
                                                  },
                                                ]}
                                              >
                                                <Input
                                                  placeholder="Отсканируйте код"
                                                  disabled={true}
                                                />
                                              </Form.Item>
                                            </td>
                                          </Show>
                                          <td className="ant-table-cell">
                                            <Form.Item
                                              style={
                                                !isOrder
                                                  ? { display: "none" }
                                                  : {}
                                              }
                                              {...field}
                                              label=""
                                              name={[field.name, "name"]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "name",
                                              ]}
                                              rules={[
                                                {
                                                  required: false,
                                                  message: "Выберите продукт",
                                                },
                                              ]}
                                            >
                                              <Input
                                                disabled={
                                                  isOrder || startScan
                                                }
                                                placeholder="Наименование"
                                              />
                                            </Form.Item>
                                            <Form.Item
                                              style={
                                                isOrder
                                                  ? { display: "none" }
                                                  : {}
                                              }
                                              {...field}
                                              label=""
                                              name={[field.name, "id"]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "id",
                                              ]}
                                              rules={[
                                                {
                                                  required: false,
                                                  message: "Выберите продукт",
                                                },
                                              ]}
                                            >
                                              <Select
                                                placeholder="Выберите"
                                                loading={$stockItems.loading}
                                                allowClear={
                                                  !$stockItems.loading
                                                }
                                                disabled={
                                                  isOrder || startScan
                                                }
                                                onSearch={onSearchProducts}
                                                onFocus={() =>
                                                  onSearchProducts("")
                                                }
                                                onChange={(value, option) =>
                                                  onChangeProduct(
                                                    option,
                                                    index
                                                  )
                                                }
                                                showSearch
                                                filterOption={(
                                                  input,
                                                  option
                                                ) =>
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
                                          <Show if={(isOrder && orderId) || isDefault}>
                                            <td className="ant-table-cell">
                                              <Form.Item
                                                {...field}
                                                label=""
                                                name={[
                                                  field.name,
                                                  "qtyInPackage",
                                                ]}
                                                fieldKey={[
                                                  field.fieldKey,
                                                  "qtyInPackage",
                                                ]}
                                                rules={[
                                                  {
                                                    required: false,
                                                    message:
                                                      "Укажите количество в упаковке",
                                                  },
                                                ]}
                                              >
                                                <InputNumber
                                                  className="w-100"
                                                  disabled={startScan}
                                                  onChange={() =>
                                                    onChangeQtyInPackage(
                                                      field.fieldKey
                                                    )
                                                  }
                                                />
                                              </Form.Item>
                                            </td>
                                          </Show>
                                          <td className="ant-table-cell">
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
                                                  required: false,
                                                  message:
                                                    "Выберите ед. измерения",
                                                },
                                              ]}
                                            >
                                              <Select
                                                placeholder="Выберите"
                                                allowClear
                                                disabled={
                                                  isOrder || startScan
                                                }
                                                showSearch
                                                filterOption={(
                                                  input,
                                                  option
                                                ) =>
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
                                          <td className="ant-table-cell">
                                            <div
                                              style={{
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Form.Item
                                                {...field}
                                                label=""
                                                name={[field.name, "qty"]}
                                                fieldKey={[
                                                  field.fieldKey,
                                                  "qty",
                                                ]}
                                                rules={[
                                                  {
                                                    required: false,
                                                    message:
                                                      "Выберите ед. измерения",
                                                  },
                                                  ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                      const values =
                                                        getFieldValue(
                                                          "products"
                                                        )[index];
                                                      if (
                                                        !value ||
                                                        values.qtyInStock >=
                                                        value
                                                      ) {
                                                        return Promise.resolve();
                                                      }
                                                      return Promise.reject(
                                                        new Error(
                                                          `Ост. на скл.: ${
                                                            values.qtyInStock ||
                                                            0
                                                          }`
                                                        )
                                                      );
                                                    },
                                                  }),
                                                ]}
                                              >
                                                <InputNumber
                                                  className="w-100"
                                                  disabled={startScan}
                                                  onChange={() =>
                                                    onChangePriceOrQuantity(
                                                      field.fieldKey
                                                    )
                                                  }
                                                />
                                              </Form.Item>
                                              <Show
                                                if={
                                                  isOrder &&
                                                  aggregationCodes.length > 0
                                                }
                                              >
                                                <Progress
                                                  className="m-l-10"
                                                  type="circle"
                                                  percent={
                                                    Math.floor((qty - scanLimitOfOrder) / qty * 100)
                                                  }
                                                  width={35}
                                                />
                                              </Show>
                                            </div>
                                          </td>
                                          <td className="ant-table-cell">
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[
                                                field.name,
                                                "sellingPriceWithoutVat",
                                              ]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "sellingPriceWithoutVat",
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
                                          <td className="ant-table-cell">
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[
                                                field.name,
                                                "totalSellingPriceWithoutVat",
                                              ]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "totalSellingPriceWithoutVat",
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
                                          <td className="ant-table-cell">
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
                                              {!withoutVat && vatRate ? (
                                                <div
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  НДС - {vatRate || 0}%
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
                                              name={[field.name, "totalVatPrice"]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "vatPrice",
                                              ]}
                                            >
                                              <div>{totalVatPrice} сум</div>
                                            </Form.Item>
                                          </td>
                                          <td className="ant-table-cell">
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[
                                                field.name,
                                                "totalSellingPrice",
                                              ]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "totalSellingPrice",
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
                                                disabled={startScan}
                                                onChange={(value) =>
                                                  onChangePriceOrQuantity(
                                                    field.fieldKey,
                                                    true
                                                  )
                                                }
                                              />
                                            </Form.Item>
                                          </td>
                                          <td className="ant-table-cell">
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
                                                  icon={<RemoveMinusSvg/>}
                                                />
                                              </Show>
                                              <Show
                                                if={
                                                  !startScan &&
                                                  isScan &&
                                                  index === 0
                                                }
                                              >
                                                <Button
                                                  type="primary"
                                                  shape="circle"
                                                  style={{
                                                    marginRight: "1rem",
                                                  }}
                                                  onClick={
                                                    duplicateFormFieldsValue
                                                  }
                                                  icon={<MoveToInboxSvg/>}
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
                                                    add(productInitialValues)
                                                  }
                                                  icon={<AddPlusSvg/>}
                                                />
                                              </Show>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr
                                          style={
                                            codesVisible
                                              ? {}
                                              : { display: "none" }
                                          }
                                        >
                                          <td colSpan={isScan ? 10 : 9}>
                                            <Row gutter={16}>
                                              <Col span={12}>
                                                <Show if={isOrder && codesVisible}>
                                                  <BarcodeReader
                                                    onScan={(code) =>
                                                      onScanForOrder(
                                                        code,
                                                        index
                                                      )
                                                    }
                                                    timeBeforeScanTest={300}
                                                  />
                                                </Show>
                                                <Show if={isDefault && codesVisible}>
                                                  <BarcodeReader
                                                    onScan={(code) =>
                                                      onScanForDefault(
                                                        code,
                                                        index
                                                      )
                                                    }
                                                    timeBeforeScanTest={300}
                                                  />
                                                </Show>
                                                <Show
                                                  if={
                                                    !aggregationCodes.length
                                                  }
                                                >
                                                  <div className="stock-scan-list-empty">
                                                    <CodeScannerSvg size={50}/>
                                                    <span>
                                                        Отсканируйте товар
                                                      </span>
                                                  </div>
                                                </Show>
                                                <Show
                                                  if={aggregationCodes.length}
                                                >
                                                  <div style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    marginBottom: "0.5rem",
                                                    marginRight: "2.5rem"
                                                  }}>
                                                    <div>Сканированные коды</div>
                                                    <div>Кол-во в упак.</div>
                                                  </div>
                                                  {aggregationCodes.map(
                                                    (code, index) => (
                                                      <div
                                                        key={code}
                                                        className="stock-scan-list"
                                                      >
                                                        <div
                                                          style={{
                                                            width: "2rem",
                                                          }}
                                                          className="m-r-10"
                                                        >
                                                          {index + 1}:
                                                        </div>
                                                        <div
                                                          style={{
                                                            width: "100%",
                                                          }}
                                                        >
                                                          {code}
                                                        </div>
                                                        <Show if={isDefault || isOrder}>
                                                          <div
                                                            style={{ marginRight: "1rem" }}>{isAggregation(code) ? qtyInPackage : 1}</div>
                                                        </Show>
                                                        <div
                                                          style={{
                                                            width: "2rem",
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={() =>
                                                            onDeleteCodeByRow(
                                                              code,
                                                              field.fieldKey
                                                            )
                                                          }
                                                        >
                                                          <CloseModalSvg/>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                </Show>
                                              </Col>
                                              <Col span={12}>
                                                <div className="stock-scan-list-info">
                                                  <Show if={!isDefault}>
                                                    <div>Осталось</div>
                                                    <h1>
                                                      {scanLimitOfOrder}
                                                    </h1>
                                                  </Show>
                                                  <Show if={isDefault}>
                                                    <div>К отгрузке</div>
                                                    <h1>
                                                      {qty}
                                                    </h1>
                                                  </Show>
                                                  <div>{unitName || ""}</div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </td>
                                        </tr>
                                        <div/>
                                      </>
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
                <TextArea
                  rows={4}
                  disabled={startScan}
                  placeholder="Комментарий"
                />
              </Form.Item>

              <Form.Item
                name="createInvoice"
                label=""
                valuePropName="checked"
                style={{ marginTop: "1rem" }}
              >
                <Checkbox>Выписать счет-фактуру</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    </Form>
  );
};
