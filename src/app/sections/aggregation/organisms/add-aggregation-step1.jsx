import React from "react";
import { useStore } from "effector-react";
import { Form, Row, Col, Select, Input } from "antd";

import effector from "../effector";

import { ProductSelect } from "../atoms/product-select";

const { store, events, effects } = effector;

const requiredField = "Заолните поле";

export const AddAggregationStep1 = (props) => {
  const { form, disabled = false } = props;

  const $packageTypes = useStore(store.$packageTypes);
  const $productsItems = useStore(store.$aggregationProductsItems);

  const getProductsItems = () => {
    effects.getAggregationProductsItemsEffect();
  };

  const onProductChange = (productId, option, product) => {
    form.setFields([
      {
        name: "product",
        value: product,
      },
    ]);
  };

  const onPackageTypeChange = (packageType) => {
    const packageTypeObj = $packageTypes.data.find((item) => item.code === packageType);

    form.setFieldsValue({
      packageTypeObj
    });
  };

  const onQuantityFieldChange = (e) => {
    const quantity = e.target.value.replace(/[^0-9]/g, '');

    form.setFieldsValue({
      quantity: quantity === "0" ? "" : quantity
    });
  };

  return (
    <div>
      <div className="aggregation-head">Новая партия</div>
      <Row justify="space-between" gutter={[20, 0]}>
        <Col span={12}>
          <Form.Item label="Продукция" name="productId" rules={[{ required: true, message: requiredField }]}>
            <ProductSelect disabled={disabled} returnItem={true} onChange={onProductChange} getProductsItems={getProductsItems} productsItems={$productsItems} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Тип упаковки" name="packageType" rules={[{ required: true, message: requiredField }]}>
            <Select placeholder="Выберите тип упаковки" disabled={disabled} onChange={onPackageTypeChange}>
              {$packageTypes.data.map((item) => (
                <Select.Option value={item.code} key={item.code}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Кол-во бутылок" name="quantity" rules={[{ required: true, message: requiredField }]}>
            <Input
              placeholder="Введите количество"
              disabled={disabled}
              onChange={onQuantityFieldChange}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Описание" name="description">
        <Input.TextArea placeholder="Введите описание" disabled={disabled} />
      </Form.Item>
    </div>
  );
};