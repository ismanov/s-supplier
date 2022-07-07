import React, { useState } from "react";
import { useStore } from "effector-react";
import { Button } from "antd";

import effector from "../effector";

import { InvoiceFormItem } from "./invoice-form-item";
import { fromObjToArray } from "helpers/from-obj-to-array";

const { store, effects, events } = effector;

const getFormFields = (arr) => {
  const fields = {};

  arr.forEach((item, index) => {
    fields[index] = item;
  });

  return fields;
};

export const InvoiceForm = ({ invoiceId, setEditMode }) => {
  const { $orderInfo } = useStore(store);

  const [ products, setProducts ] = useState(getFormFields($orderInfo.data.orderItems));
  const [ fieldsErrors, setFieldsErrors ] = useState({});

  const onFieldChange = (val, index) => {
    setProducts({
      ...products,
      [index]: val
    })
  };

  const productsRender = [];

  $orderInfo.data.orderItems.forEach((product, index) => {
    if (!product.product.vatBarcode) {
      productsRender.push(<InvoiceFormItem product={products[index]} fieldsErrors={fieldsErrors} onFieldChange={onFieldChange} number={productsRender.length + 1} index={index} key={index} />)
    }
  });

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    $orderInfo.data.orderItems.forEach((item, index) => {
      if (!products[index].product.vatBarcode) errors[index] = { vatBarcode: notFilledMessage };
    });

    return errors;
  };

  const onSendToXfiles = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const productsData = fromObjToArray(products).map((product) => {
      return {
        barcode: product.barcode,
        vatBarcode: product.product.vatBarcode,
        id: product.product.id,
        name: product.product.name
      }
    });

    const data = {
      products: productsData,
      invoiceId
    };

    effects.sendProductsToXfilesEffect(data);
  };

  return (
    <div className="invoice-form">
      <div>
        {productsRender}
      </div>
      <div className="invoice-form__controls">
        <Button onClick={() => setEditMode(false)} className="custom-button danger-button">
          Отменить
        </Button>
        <Button onClick={onSendToXfiles} className="custom-button primary-button m-l-20">
          Отправить
        </Button>
      </div>
    </div>
  )
};