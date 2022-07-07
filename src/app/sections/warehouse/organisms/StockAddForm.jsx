import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { useHistory } from "react-router-dom";

import effector from "../effector";
import userEffector from "../../user/effector";
import mainEffector from "../../../screens/main/effector";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import {
  AddPlusSvg,
  ArrowSvg,
  MoveToInboxSvg,
  RemoveMinusSvg,
} from "svgIcons/svg-icons";
import moment from "moment";
import BarcodeReader from "react-barcode-reader";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { debounce } from "helpers/debounce";
import Show from "ui/molecules/show";
import { checkToCyrillic } from "../../../screens/main/constants";
import { checkCodesToExists, translateCodeRuEn } from "../../Invoices/helpers";

const { stores, effects } = effector;
const { store: userStore, effects: userEffects } = userEffector;
const { store: mainStore, effects: mainEffects } = mainEffector;
const { Option } = Select;
const { TextArea } = Input;

const formModes = [
  { code: "DEFAULT", name: "Вручную" },
  { code: "INVOICE", name: "По счет-фактуры" },
  { code: "SCAN", name: "Сканировать код" },
];

const calculateMarkup = (data, changeBy) => {
  const { totalPurchasePrice, markupPrice, markupPercent, totalSellingPrice } =
    data;

  if (totalPurchasePrice) {
    switch (changeBy) {
      case "totalPurchasePrice":
        return {
          ...data,
          markupPrice: Number(totalSellingPrice - totalPurchasePrice).toFixed(2),
          markupPercent: Number(
            ((100 * (totalSellingPrice - totalPurchasePrice)) / totalPurchasePrice).toFixed(2)
          ),
        };
      case "markupPercent":
        return {
          ...data,
          totalSellingPrice: Number(
            (
              (totalPurchasePrice +
                (markupPercent * totalPurchasePrice) / 100)
            ).toFixed(2)
          ),
          markupPrice: Number(
            ((totalPurchasePrice * markupPercent) / 100).toFixed(2)
          ),
        };
      case "markupPrice":
        return {
          ...data,
          totalSellingPrice: Number(
            ((markupPrice + totalPurchasePrice)).toFixed(2)
          ),
          markupPercent: Number(
            ((100 * markupPrice) / totalPurchasePrice).toFixed(2)
          ),
        };
      case "totalSellingPrice":
        return {
          ...data,
          markupPercent: Number(
            ((totalSellingPrice / totalPurchasePrice - 1) * 100).toFixed(
              2
            )
          ),
          markupPrice: Number(
            (totalSellingPrice - totalPurchasePrice).toFixed(2)
          ),
        };
      default:
        break;
    }
  }
  return { ...data };
};

const mainInitialValues = {
  warehouseId: null,
  supplier: null,
  xfileId: null,
  facturaNumber: null,
  totalPrice: null,
  facturaId: null,
};

const initialValues = {
  transferDate: moment(),
  consignmentNumber: "",
  branchId: null,
  description: "",
  products: [
    {
      name: "",
      aggregationCodes: [],
    },
  ],
};

const updateProductSearch = debounce((action) => {
  action();
}, 400);

export const StockAddForm = (props) => {
  const invoiceId = props.location?.state?.invoiceId;
  const $invoiceList = useStore(stores.$invoiceList);
  const $wareHousesItems = useStore(stores.$wareHousesItems);
  const $suppliersItems = useStore(stores.$suppliersItems);
  const { $userCompanyInfo, $branchesItems } = useStore(userStore);
  const { $unitItems, $productItems } = useStore(mainStore);

  const [formMode, setFormMode] = useState(formModes[0].code);
  const [invoiceValue, setInvoiceValue] = useState(null);
  const [startScan, setStartScan] = useState(false);
  const [formMainValues, setFormMainValues] = useState(mainInitialValues);
  const [stockInOut, setStockInOut] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    userEffects.getUserCompanyInfoEffect();
    userEffects.getBranchesItemsEffect();
    mainEffects.getProductItemsEffect();
    effects.getSuppliersItemsEffect();
    return () => {
      form.resetFields();
    };
  }, []);

  useEffect(() => {
    const { tin } = $userCompanyInfo.data;
    if (tin) {
      effects.getInvoiceListEffect(tin);
    }
  }, [$userCompanyInfo.data.tin]);

  useEffect(() => {
    if (!!invoiceId) {
      onChangeFormMode(formModes[1].code);
      onChangeInvoice(invoiceId);
    }
  }, [invoiceId]);

  useEffect(() => {
    // set branch if branches are no more of one & fetch warehouses, products by branchId
    let branchId;
    if ($branchesItems?.data.length === 1) {
      branchId = $branchesItems.data[0].id;
    } else {
      branchId = ($branchesItems?.data || []).find((item) => item.main)?.id
    }
    form.setFieldsValue({ branchId });
    mainEffects.getProductItemsEffect({ branchId });
    effects.getWarehouseListLookupEffect({ branchId });
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

  const onChangeBranch = (branchId) => {
    form.setFieldsValue({ branchId });
    mainEffects.getProductItemsEffect({ branchId });
    effects.getWarehouseListLookupEffect({ branchId });
  };

  const onSearchProducts = (search) => {
    updateProductSearch(() => {
      const branchId = form.getFieldValue("branchId");
      mainEffects.getProductItemsEffect({ branchId, search });
    });
  };

  const onSupplierSearch = (search) => {
    updateProductSearch(() => {
      effects.getSuppliersItemsEffect({ search });
    });
  };

  const onChangeInvoice = (id) => {
    setInvoiceValue(id);
    effects.getInvoiceItemEffect(id).then(({ data }) => {
      if (data && data.facturaDTO) {
        const {
          id,
          total,
          number,
          sellerTin,
          facturaDTO: {
            FacturaId,
            Seller: { Name, Account, BankId, Oked },
            ProductList: { Products },
          },
        } = data;
        const products = Products.map(
          ({
             Name: ProductName,
             OrdNo,
             CatalogCode,
             MeasureId,
             Count,
             VatRate,
             VatSum,
             WithoutVat,
             Marks,
             DeliverySumWithVat,
             DeliverySum,
           }) => {
            return {
              sorder: OrdNo,
              vatBarCode: CatalogCode,
              aggregationCodes: Array.isArray(Marks?.IdentTransUpak)
                ? Marks.IdentTransUpak
                : [],
              markCodes: Marks?.KIZ || undefined,
              name: ProductName,
              id: null,
              measureId: MeasureId,
              qty: Count,
              vatRate: VatRate,
              withoutVat: WithoutVat,
              purchasePrice: DeliverySumWithVat / Count,
              totalPurchasePrice: DeliverySumWithVat,

              purchasePriceWithoutVat: DeliverySum / Count,
              totalPurchasePriceWithoutVat: DeliverySum,

              vatPrice: VatSum / Count,
              totalVatPrice: VatSum,

              sellingPrice: (DeliverySumWithVat) / Count,
              totalSellingPrice: DeliverySumWithVat,

              sellingPriceWithoutVat: DeliverySum / Count,
              totalSellingPriceWithoutVat: DeliverySum,

              markupPrice: null,
              markupPercent: null,
            };
          }
        );
        setFormMainValues({
          xfileId: id,
          facturaNumber: number,
          totalPrice: total,
          facturaId: FacturaId,
          supplier: {
            tin: sellerTin,
            name: Name,
            bank: {
              mfo: BankId,
              accountNumber: Account,
              oked: Oked,
            },
          },
        });
        form.setFieldsValue({ products });
      }
    });
  };

  const onChangeFormMainValues = (field, value) => {
    setFormMainValues({
      ...formMainValues,
      [field]: value,
    });
  };

  const onChangeFormMode = (mode) => {
    setFormMode(mode);
    setStartScan(false);
    setInvoiceValue(null);
    form.setFieldsValue({ products: [{ name: "", aggregationCodes: [] }] });
  };

  const onChangeProduct = (option, fieldKey) => {
    const productData = $productItems.data.find(
      (item) => item.id === option.value
    );
    const products = form.getFieldValue("products");
    const currentRow = products[fieldKey];
    const productValue = {
      name: option.children,
      id: option.value,
    };
    if (productData && productData.id) {
      const { unit, vat, price } = productData;
      const measure = ($unitItems.data || []).find(
        (item) => item.id === unit.id
      );
      productValue.measureId = measure.measureId;
      productValue.totalPurchasePrice =
        formMode === "INVOICE" ? price || null : null;
      productValue.vatRate = vat.amount || 0;
      productValue.withoutVat = !vat.amount;
      productValue.initialProductPrice = price;
      productValue.totalSellingPrice = price;
      productValue.sellingPrice = price;
    }
    products[fieldKey] = {
      ...currentRow,
      ...productValue,
    };
    form.setFieldsValue({
      products,
    });
    onChangeProductPrice("totalSellingPrice", fieldKey)
  };

  const onChangeProductPrice = (field, fieldKey, clearProductInitialPrice = false) => {
    const valuesArray = form.getFieldValue("products");
    const values = valuesArray[fieldKey];
    const vatRate = values.vatRate || 0;
    const qty = values.qty || 0;
    const clientNdsPercent = 1 + vatRate / 100;
    const totalPurchasePrice = Number(values.totalPurchasePrice || 0);
    const purchasePrice = Number(values.totalPurchasePrice / qty || 1);
    const markupPrice = Number(values.markupPrice || 0);
    const markupPercent = Number(values.markupPercent || 0);
    const initialProductPrice = clearProductInitialPrice ? 0 : Number(values.initialProductPrice || 0);
    const totalSellingPrice = initialProductPrice ? initialProductPrice * qty : Number(values.totalSellingPrice || 0);
    const sellingPrice = Number(totalSellingPrice / qty || 0).toFixed(2);

    const totalPurchasePriceWithoutVat = !qty ? 0 : Number(totalPurchasePrice - (totalPurchasePrice - totalPurchasePrice / clientNdsPercent) || 0).toFixed(2);
    const purchasePriceWithoutVat = !qty ? 0 : Number(totalPurchasePriceWithoutVat / qty).toFixed(2);
    const data = {
      qty,
      purchasePrice,
      totalPurchasePrice,
      sellingPrice,
      markupPrice,
      markupPercent,
      totalSellingPrice,
      purchasePriceWithoutVat,
      totalPurchasePriceWithoutVat,
    };

    const priceFields = calculateMarkup(data, field);
    priceFields.sellingPrice =
      priceFields.totalSellingPrice / (qty || 1);
    const totalVatPrice = Number(
      priceFields.totalSellingPrice - priceFields.totalSellingPrice / clientNdsPercent
    ).toFixed(2);
    const vatPrice = Number(totalVatPrice / qty || 1).toFixed(2);
    const totalSellingPriceWithoutVat = Number(priceFields.totalSellingPrice - (priceFields.totalSellingPrice - priceFields.totalSellingPrice / clientNdsPercent) || 0).toFixed(2);
    const sellingPriceWithoutVat = Number(totalSellingPriceWithoutVat / qty || 1).toFixed(2)
    valuesArray[fieldKey] = {
      ...valuesArray[fieldKey],
      ...priceFields,
      initialProductPrice,
      totalVatPrice,
      vatPrice,
      totalSellingPriceWithoutVat,
      sellingPriceWithoutVat
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
        aggregationCodes: item.aggregationCodes,
      });
    });
    form.setFieldsValue({
      products,
    });
  };

  const onSubmit = (values) => {
    if (
      formMode === "SCAN" &&
      !values.products[values.products.length - 1].aggregationCodes.length
    ) {
      values.products = values.products.slice(0, values.products.length - 1);
    }

    const data = {
      ...formMainValues,
      ...values,
      warehouseId: values.warehouseId,
      description: values.description,
      branchId: values.branchId,
      transferDate: moment(values.transferDate).utc().format(),
      supplier:
        typeof values.supplier === "number"
          ? { id: values.supplier }
          : formMainValues.supplier,
    };
    effects.saveWarehouseStockItemEffect(data).then((response) => {
      if (response.status === 200) {
        if (stockInOut) {
          const stockInId = response.data
          history.push({
            pathname: "/warehouse/shipment/add",
            state: { stockInId },
          })
          return;
        }
        form.resetFields();
        history.goBack();
      }
    });
  };

  const onScan = (code) => {
    if (checkToCyrillic(code)) {
      code = translateCodeRuEn(code);
    }
    const products = form.getFieldValue("products");
    if (checkCodesToExists(products, code))
      return openNotificationWithIcon("warning", "Код уже добавлен!");
    products[products.length - 1].aggregationCodes.push(code);
    products.push({ name: "", aggregationCodes: [] });
    form.setFieldsValue({ products });
  };

  const invoiceOptions = (
    ($invoiceList.data && $invoiceList.data.items) ||
    []
  ).map((invoice) => (
    <Option
      key={invoice.id}
      value={invoice.id}
    >{`СЧ №: ${invoice.number}, ИНН - ${invoice.sellerTin}`}</Option>
  ));
  const warehouseOptions = ($wareHousesItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name}
    </Option>
  ));
  const unitOptions = ($unitItems.data || []).map((item) => (
    <Option key={item.measureId} value={item.measureId}>
      {item.name}
    </Option>
  ));
  const branchOptions = ($branchesItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name}
    </Option>
  ));
  const productsOptions = ($productItems.data || []).map((item) => (
    <Option key={`${item.name} ${item.barcode}`} value={item.id}>
      {`${item.name} ${item.capacity || ""}`}
    </Option>
  ));
  const clientsOptions = ($suppliersItems.data || []).map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name}
    </Option>
  ));
  const formModeOptions = formModes.map((item) => (
    <Option value={item.code} key={item.code}>
      {item.name}
    </Option>
  ));

  const isInvoice = formMode === "INVOICE";
  const isScan = formMode === "SCAN";

  return (
    <Form
      form={form}
      initialValues={initialValues}
      name="warehouse-income"
      onFinish={onSubmit}
    >
      <Show if={startScan}>
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
          <h1>Добавить Приход</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button className="custom-button primary-button m-r-10" onClick={() => setStockInOut(true)} htmlType="submit">
            Сохранить и отгрузить
          </Button>
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
                allowClear
              >
                {formModeOptions}
              </Select>
            </Col>
            <Show if={isInvoice}>
              <Col sm={4}>
                <Select
                  className="w-100"
                  placeholder="Выберите фактуру"
                  loading={$invoiceList.loading}
                  value={invoiceValue}
                  disabled={startScan}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={onChangeInvoice}
                  allowClear
                >
                  {invoiceOptions}
                </Select>
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
                rules={[{ required: true, message: "Обязательное поле" }]}
              >
                <DatePicker className="w-100" disabled={startScan}/>
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                name="consignmentNumber"
                label=""
                rules={[{ required: true, message: "Обязательное поле" }]}
              >
                <Input disabled={startScan} placeholder="Накладная №"/>
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Show if={isInvoice}>
                <Input
                  value={
                    formMainValues.supplier ? formMainValues.supplier.name : ""
                  }
                  disabled={isInvoice}
                />
              </Show>
              <Show if={!isInvoice}>
                <Form.Item
                  name="supplier"
                  label=""
                  rules={[{ required: true, message: "Обязательное поле" }]}
                >
                  <Select
                    className="w-100"
                    disabled={isInvoice || startScan}
                    onChange={(v) => {
                      onChangeFormMainValues("supplier", { id: v });
                    }}
                    placeholder="Выберите поставщика"
                    showSearch
                    onSearch={onSupplierSearch}
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
              </Show>
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
                  placeholder="Выберите склад"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear
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
                  onChange={(v) => onChangeBranch(v)}
                  disabled={startScan}
                  placeholder="Выберите филиал"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear
                >
                  {branchOptions}
                </Select>
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
                                    <Show if={isScan}>
                                      <th className="ant-table-cell">Код</th>
                                    </Show>
                                    <th className="ant-table-cell">
                                      Наименование
                                    </th>
                                    <th className="ant-table-cell">
                                      Ед. Изм.
                                    </th>
                                    <th className="ant-table-cell">
                                      Количество
                                    </th>
                                    <th className="ant-table-cell">
                                      Цена
                                    </th>
                                    <th className="ant-table-cell">
                                      Ст. поставки
                                    </th>
                                    <th className="ant-table-cell">
                                      Ст. поставки с НДС
                                    </th>
                                    <th className="ant-table-cell">
                                      Наценка <br/> (Процент/Сумма)
                                    </th>
                                    <th className="ant-table-cell">
                                      НДС/Прод.Цена
                                    </th>
                                    <th className="ant-table-cell">
                                      Продажная цена
                                    </th>
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
                                        key={index}
                                        className="ant-table-row ant-table-row-level-0"
                                        align="baseline"
                                      >
                                        <td
                                          style={{ width: "25px" }}
                                          className="ant-table-cell"
                                        >
                                          {index + 1}
                                        </td>
                                        <Show if={isScan}>
                                          <td
                                            style={{ width: "170px" }}
                                            className="ant-table-cell"
                                          >
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
                                                  required:
                                                    currentListValues.length -
                                                    1 ===
                                                    index &&
                                                    currentRow &&
                                                    currentRow
                                                      .aggregationCodes
                                                      .length,
                                                  message: "Отсканируйте код",
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
                                        <td
                                          style={{ width: "200px" }}
                                          className="ant-table-cell"
                                        >
                                          <Show if={isInvoice}>
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[field.name, "name"]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "name",
                                              ]}
                                              rules={[
                                                {
                                                  required:
                                                    currentListValues.length -
                                                    1 ===
                                                    index &&
                                                    currentRow &&
                                                    currentRow
                                                      .aggregationCodes
                                                      .length,
                                                  message: "Выберите продукт",
                                                },
                                              ]}
                                            >
                                              <Input
                                                placeholder="Наименование"
                                                disabled={
                                                  isInvoice || startScan
                                                }
                                              />
                                            </Form.Item>
                                          </Show>
                                          <Show if={!isInvoice}>
                                            <Form.Item
                                              {...field}
                                              label=""
                                              style={{
                                                maxWidth: "300px",
                                                wordWrap: "break-word",
                                                wordBreak: "break-word",
                                              }}
                                              name={[field.name, "id"]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "id",
                                              ]}
                                              rules={[
                                                {
                                                  required:
                                                    currentListValues.length -
                                                    1 ===
                                                    index &&
                                                    currentRow &&
                                                    currentRow
                                                      .aggregationCodes
                                                      .length,
                                                  message: "Выберите продукт",
                                                },
                                              ]}
                                            >
                                              <Select
                                                placeholder="Выберите"
                                                loading={
                                                  $productItems.loading
                                                }
                                                allowClear={
                                                  !$productItems.loading
                                                }
                                                disabled={
                                                  isInvoice || startScan
                                                }
                                                onSearch={onSearchProducts}
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
                                          </Show>
                                        </td>
                                        <td
                                          style={{ width: "70px" }}
                                          className="ant-table-cell"
                                        >
                                          <Form.Item
                                            {...field}
                                            label=""
                                            name={[field.name, "measureId"]}
                                            fieldKey={[
                                              field.fieldKey,
                                              "measureId",
                                            ]}
                                            rules={[
                                              {
                                                required:
                                                  currentListValues.length -
                                                  1 ===
                                                  index &&
                                                  currentRow &&
                                                  currentRow.aggregationCodes
                                                    .length,
                                                message:
                                                  "Выберите ед. измерения",
                                              },
                                            ]}
                                          >
                                            <Select
                                              placeholder="Выберите"
                                              allowClear
                                              disabled={startScan}
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
                                          style={{ width: "130px" }}
                                          className="ant-table-cell"
                                        >
                                          <Form.Item
                                            {...field}
                                            label=""
                                            name={[field.name, "qty"]}
                                            fieldKey={[field.fieldKey, "qty"]}
                                            rules={[
                                              {
                                                required:
                                                  currentListValues.length -
                                                  1 ===
                                                  index &&
                                                  currentRow &&
                                                  currentRow.aggregationCodes
                                                    .length,
                                                message: "Введите количество",
                                              },
                                            ]}
                                          >
                                            <InputNumber
                                              className="w-100"
                                              disabled={
                                                isInvoice || startScan
                                              }
                                              onChange={() =>
                                                onChangeProductPrice(
                                                  "qty",
                                                  field.fieldKey
                                                )
                                              }
                                            />
                                          </Form.Item>
                                        </td>
                                        <td
                                          style={{ width: "130px" }}
                                          className="ant-table-cell"
                                        >
                                          <Form.Item
                                            {...field}
                                            label=""
                                            name={[field.name, "purchasePriceWithoutVat"]}
                                            fieldKey={[field.fieldKey, "purchasePriceWithoutVat"]}
                                          >
                                            <InputNumber
                                              className="w-100"
                                              disabled={true}
                                            />
                                          </Form.Item>
                                        </td>
                                        <td
                                          style={{ width: "130px" }}
                                          className="ant-table-cell"
                                        >
                                          <Form.Item
                                            {...field}
                                            label=""
                                            name={[field.name, "totalPurchasePriceWithoutVat"]}
                                            fieldKey={[field.fieldKey, "totalPurchasePriceWithoutVat"]}
                                          >
                                            <InputNumber
                                              className="w-100"
                                              disabled={true}
                                            />
                                          </Form.Item>
                                        </td>
                                        <td
                                          style={{ width: "130px" }}
                                          className="ant-table-cell"
                                        >
                                          <Form.Item
                                            {...field}
                                            label=""
                                            name={[
                                              field.name,
                                              "totalPurchasePrice",
                                            ]}
                                            fieldKey={[
                                              field.fieldKey,
                                              "totalPurchasePrice",
                                            ]}
                                            rules={[
                                              {
                                                required:
                                                  currentListValues.length -
                                                  1 ===
                                                  index &&
                                                  currentRow &&
                                                  currentRow.aggregationCodes
                                                    .length,
                                                message:
                                                  "Введите себестоимость",
                                              },
                                            ]}
                                          >
                                            <InputNumber
                                              className="w-100"
                                              disabled={
                                                isInvoice || startScan
                                              }
                                              onChange={() =>
                                                onChangeProductPrice(
                                                  "totalPurchasePrice",
                                                  field.fieldKey
                                                )
                                              }
                                            />
                                          </Form.Item>
                                        </td>
                                        <td
                                          style={{ width: "130px" }}
                                          className="ant-table-cell"
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[
                                                field.name,
                                                "markupPercent",
                                              ]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "markupPercent",
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
                                                disabled={startScan}
                                                onChange={() =>
                                                  onChangeProductPrice(
                                                    "markupPercent",
                                                    field.fieldKey
                                                  )
                                                }
                                              />
                                            </Form.Item>
                                            /
                                            <Form.Item
                                              {...field}
                                              label=""
                                              name={[
                                                field.name,
                                                "markupPrice",
                                              ]}
                                              fieldKey={[
                                                field.fieldKey,
                                                "markupPrice",
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
                                                disabled={startScan}
                                                onChange={() =>
                                                  onChangeProductPrice(
                                                    "markupPrice",
                                                    field.fieldKey
                                                  )
                                                }
                                              />
                                            </Form.Item>
                                          </div>
                                        </td>
                                        <td
                                          style={{ width: "150px" }}
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
                                            name={[
                                              field.name,
                                              "totalVatPrice",
                                            ]}
                                            fieldKey={[
                                              field.fieldKey,
                                              "totalVatPrice",
                                            ]}
                                          >
                                            <div>
                                              {(currentRow &&
                                                currentRow.totalVatPrice) ||
                                              0}{" "}
                                              сум
                                            </div>
                                          </Form.Item>
                                        </td>
                                        <td
                                          style={{ width: "130px" }}
                                          className="ant-table-cell"
                                        >
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
                                                required:
                                                  currentListValues.length -
                                                  1 ===
                                                  index &&
                                                  currentRow &&
                                                  currentRow.aggregationCodes
                                                    .length,
                                                message:
                                                  "Выберите ед. измерения",
                                              },
                                            ]}
                                          >
                                            <InputNumber
                                              className="w-100"
                                              disabled={startScan}
                                              onChange={() =>
                                                onChangeProductPrice(
                                                  "totalSellingPrice",
                                                  field.fieldKey,
                                                  true
                                                )
                                              }
                                            />
                                          </Form.Item>
                                        </td>
                                        <td
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
                                                icon={<RemoveMinusSvg/>}
                                              />
                                            </Show>
                                            <Show if={isScan && index === 0}>
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
                                                  add({
                                                    name: "",
                                                    aggregationCodes: [],
                                                  })
                                                }
                                                icon={<AddPlusSvg/>}
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
                <TextArea
                  disabled={startScan}
                  rows={4}
                  placeholder="Комментарий"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    </Form>
  );
};

export default StockAddForm;
