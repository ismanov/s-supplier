import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import InputMask from "react-input-mask";
import {Form, Button, Alert, Spin} from "antd";

import effector from "../effector";

import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

import { FormField } from "ui/molecules/form-field";

import logo from "images/logo.svg";

const { store, effects, events } = effector;

const FormState = ({ error, loading }) => {
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

export const ResetPasswordStep1 = (props) => {
  const { $resetPasswordInit } = useStore(store);

  const [ formFields, setFormFields ] = useState({
    phone: "998"
  });

  const { setPhone } = props;

  useEffect(() => {
    if ($resetPasswordInit.success) {
      openNotificationWithIcon("success", "SMS с кодом отправлено");
      events.resetPasswordInitEvent();
      events.updatePasswordStepEvent({
        step: 2
      });
      setPhone(formFields.phone);
    }
  }, [$resetPasswordInit.success]);

  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const onPhoneFieldChange = (prop, val) => {
    onFormFieldChange(prop, val ? val : "998");
  };


  const onSubmit = (val) => {
    effects.resetPasswordInitEffect({
      phone: formFields.phone
    });
  };

  return (
    <>
      <Form onFinish={onSubmit}>
        <div className="auth-wrapper__form_logo">
          <img src={logo} alt="logo"/>
          <span>Сброс пароля</span>
        </div>
        <FormState error={$resetPasswordInit.error} loading={$resetPasswordInit.loading} />
        <FormField title="Введите логин">
          <InputMask
            className="ant-input auth-input"
            mask="+\9\98 (99) 999 99 99"
            maskChar="*"
            value={formFields.phone}
            onChange={(phone) => onPhoneFieldChange("phone", phone.target.value.replace(/[^0-9]/g, ''))}
          />
        </FormField>
        <Button
          disabled={!formFields.phone}
          className="custom-button success-button fullwidth large b-r-30"
          htmlType="submit"
        >
          ПРОДОЛЖИТЬ
        </Button>
      </Form>
    </>
  )
};