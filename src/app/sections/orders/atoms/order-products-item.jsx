import React from "react";
import { Input } from "antd";

import { FormField } from "ui/molecules/form-field";
import { formatPrice } from "helpers/format-price";

export const OrderProductsItem = (props) => {
  const { product, index, changeOrderItems, editMode, fieldErrors, setFieldErrors } = props;

  const onChangeQty = (val) => {
    const errors = {...fieldErrors};

    if (val < product.minOrder || !val) {
      errors[product.id] = true;
    } else {
      delete errors[product.id];
    }

    setFieldErrors(errors);

    changeOrderItems({
      ...product,
      qty: val ? val : ""
    })
  };

  return (
    <div className="order-products__row">
      <div className="order-products__row-item">
        <div className="order-products__row-item-title">№</div>
        <div className="order-products__row-item-body">{index + 1}</div>
      </div>
      <div className="order-products__row-item item-name">
        <div className="order-products__row-item-title">Название товара</div>
        <div className="order-products__row-item-body">{product.product.name}</div>
      </div>
      <div className="order-products__row-item item-unit">
        <div className="order-products__row-item-title">Ед. изм.</div>
        <div className="order-products__row-item-body">{product.unit.description}</div>
      </div>
      <div className={`order-products__row-item item-unit ${fieldErrors[product.id] ? "item-error" : ""}`}>
        <div className="order-products__row-item-title">Мин. заказ</div>
        <div className="order-products__row-item-body">{product.minOrder} {product.unit.name}</div>
      </div>
      <div className={`order-products__row-item item-count ${fieldErrors[product.id] ? "item-error" : ""}`}>
        <FormField className="m-b-0" title="Кол-во">
          <Input
            disabled={!editMode}
            placeholder="Кол-во"
            value={product.qty}
            onChange={(qty) => onChangeQty(parseInt(qty.target.value.replace(/[^0-9.]/g, '')))}
          />
        </FormField>
      </div>
      <div className="order-products__row-item item-price">
        <div className="order-products__row-item-title">Цена за 1 {product.unit.name}</div>
        <div className="order-products__row-item-body">
          {formatPrice(product.price)}
        </div>
      </div>
      <div className="order-products__row-item item-vat">
        <div className="order-products__row-item-title">НДС</div>
        <div className="order-products__row-item-body">
          {product.vatRate ? `${product.vatRate} %` : "Без НДС"}
        </div>
      </div>
      <div className="order-products__row-item">
        <div className="order-products__row-item-title">Сумма</div>
        <div className="order-products__row-item-body">{formatPrice(product.price * product.qty)}</div>
      </div>
    </div>
  )
};