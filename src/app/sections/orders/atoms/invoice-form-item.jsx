import React from "react";
import { Input } from "antd";

import { FormField } from "ui/molecules/form-field";

export const InvoiceFormItem = (props) => {
  const { number, product, fieldsErrors, onFieldChange, index } = props;

  const changeCode = (inputVal) => {
    const value = {
      ...product,
      product: {
        ...product.product,
        vatBarcode: inputVal
      }
    };

    onFieldChange(value, index);
  };

  return (
    <div className="invoice-form__item">
      <div className="invoice-form__item-field">
        <FormField className="m-r-15" title="№">
          {number}
        </FormField>
      </div>
      <div className="invoice-form__item-field">
        <FormField className="nomargin" title="Название товара">
          {product.product.name}
        </FormField>
      </div>
      <div className="invoice-form__item-field invoice-form__item-field-right">
        <FormField className="m-l-15" title="Код ИКПУ" error={fieldsErrors[index] ? fieldsErrors[index].vatBarcode : undefined}>
          <Input
            placeholder="Введите код"
            value={product.product.vatBarcode ? product.product.vatBarcode : ""}
            onChange={(e) => changeCode(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </FormField>
      </div>
    </div>
  )
};