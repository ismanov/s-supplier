import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import InputMask from "react-input-mask";
import { Form, Button, Alert, Spin } from "antd";

import effector from "../effector";

import logo from "images/logo.svg";
import { FormField } from "ui/molecules/form-field";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

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

export const RegistrationStep1 = (props) => {
  const { $checkLogin } = useStore(store);

  const [ formFields, setFormFields ] = useState({
    phone: "998"
  });

  const { setPhone } = props;

  useEffect(() => {
    if ($checkLogin.data) {
      if (!$checkLogin.data.activated) {
        openNotificationWithIcon("success", "SMS с кодом отправлено");
        events.updateRegistrationStepEvent({
          step: 2
        });
        setPhone(formFields.phone);
      }
    }
  }, [$checkLogin.data]);


  const onLoginChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');

    setFormFields({
      ...formFields,
      phone: value ? value : "998"
    });
  };

  const onSubmit = () => {
    effects.checkLoginEffect(formFields);
  };

  return (
    <Form onFinish={onSubmit}>
      <div className="auth-wrapper__form_logo">
        <img src={logo} alt="logo"/>
        <span>Регистрация</span>
      </div>
      {($checkLogin.data && $checkLogin.data.activated) && <Alert className="m-b-10" message="Данный пользователь уже зарегистрирован в портале Поставщик." type="error"/>}
      <FormState error={$checkLogin.error} loading={$checkLogin.loading} />
      <FormField className="m-b-25" title="Телефон">
        <InputMask
          className="ant-input auth-input"
          mask="+\9\98 (99) 999 99 99"
          maskChar="*"
          value={formFields.phone}
          onChange={onLoginChange}
        />
      </FormField>
      <Button
        htmlType="submit"
        className="custom-button success-button fullwidth large b-r-30"
        disabled={formFields.phone.length !== 12}
      >
        ПРОДОЛЖИТЬ
      </Button>
    </Form>
  )
};