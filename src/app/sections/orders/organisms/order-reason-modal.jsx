import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Form, Input, Modal, Button } from "antd";

import effector from "../effector";

import { CloseModalSvg } from "svgIcons/svg-icons";
import { FormField } from "ui/molecules/form-field";
import { FormState } from "ui/molecules/form-state";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const { store, effects, events } = effector;

const { TextArea } = Input;

export const OrderReasonModal = (props) => {
  const { $rejectOrder } = useStore(store);

  const { modalProps, setModalProps } = props;

  const { orderId, status } = modalProps;

  const [ formFields, setFormFields ] = useState({});
  const [ fieldsErrors, setFieldsErrors ] = useState({});

  useEffect(() => {
    if ($rejectOrder.success) {
      openNotificationWithIcon('success', 'Заказ отклонен');

      closeModal();

      effects.getOrderInfoEffect({
        id: orderId
      });
    }
  }, [$rejectOrder.success]);

  const onFormFieldChange = (prop, val, ) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetRejectOrderEvent();

    setModalProps({ ...modalProps, shouldRender: false, orderId: null, status: null });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.reason) errors.reason = notFilledMessage;

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
      note: {
        comment: formFields.reason
      },
      id: orderId,
      status: {
        code: status
      }
    };

    effects.rejectOrderEffect(data);
  };

  return (
    <Modal
      className="custom-modal"
      title="Причина отказа"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState error={$rejectOrder.error} loading={$rejectOrder.loading} />
      <Form onFinish={onSubmit}>
        <FormField error={fieldsErrors.reason}>
          <TextArea
            value={formFields.reason}
            onChange={(reason) => onFormFieldChange("reason", reason.target.value)}
            placeholder="Введите причину"
          />
        </FormField>
        <div className="custom-modal__button-row">
          <Button htmlType="submit" className="custom-button primary-button fullwidth">Отправить</Button>
        </div>
      </Form>
    </Modal>
  )
};