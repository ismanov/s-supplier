import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Alert, Form, Input, Modal, Spin, Button } from "antd";

import effector from "../effector";

import { CloseModalSvg } from "svgIcons/svg-icons";
import { FormField } from "ui/molecules/form-field";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const { store, effects, events } = effector;

const { TextArea } = Input;

const FormState = ({ error, loading }) => {
  console.log("error", error);

  return (
    <div>
      {error && <div className="m-b-20">
        <Alert message={error.detail || error.title} type="error"/>
      </div>}
      {loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>}
    </div>
  )
};

export const AddAggregationOrderModal = (props) => {
  const $createAggregationOrder = useStore(store.$createAggregationOrder);

  const { modalProps, setModalProps, callBack } = props;

  const [ formFields, setFormFields ] = useState({});
  const [ fieldsErrors, setFieldsErrors ] = useState({});

  useEffect(() => {
    if ($createAggregationOrder.success) {
      openNotificationWithIcon('success', 'Заказ принят');

      callBack && callBack();

      closeModal();
    }
  }, [ $createAggregationOrder.success ]);


  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetCreateAggregationOrderEvent();

    setModalProps({ ...modalProps, shouldRender: false });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.quantity || formFields.quantity === "0") errors.quantity = notFilledMessage;

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const data = {
      quantity: formFields.quantity,
      description: formFields.description ? formFields.description : undefined,
    };

    effects.createAggregationOrderEffect(data);
  };

  return (
    <Modal
      className="custom-modal"
      title="Формирование предзаказа"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg/>}
    >
      <FormState error={$createAggregationOrder.error} loading={$createAggregationOrder.loading}/>
      <Form onFinish={onSubmit}>
        <FormField title="Количество кодов агрегации" error={fieldsErrors.quantity}>
          <Input
            placeholder="Введите количество"
            value={formFields.quantity}
            onChange={(quantity) => onFormFieldChange("quantity", quantity.target.value.replace(/[^0-9]/g, ''))}
          />
        </FormField>
        <FormField title="Описание">
          <TextArea
            value={formFields.description}
            onChange={(description) => onFormFieldChange("description", description.target.value)}
            placeholder="Введите описание"
          />
        </FormField>
        <div className="custom-modal__button-row">
          <Button htmlType="submit" className="custom-button primary-button fullwidth">Заказать</Button>
        </div>
      </Form>
    </Modal>
  )
};