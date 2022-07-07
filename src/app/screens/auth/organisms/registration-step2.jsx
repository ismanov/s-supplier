import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { useHistory } from 'react-router-dom';
import { Form, Input, Statistic, Button, Alert, Spin } from "antd";

import effector from "../effector";

import logo from "images/logo.svg";
import { FormField } from "ui/molecules/form-field";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const { store, effects, events } = effector;

const { Countdown } = Statistic;

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

export const RegistrationStep2 = (props) => {
  const history = useHistory();
  const { $checkLogin, $confirmActivationCode } = useStore(store);

  const [ formFields, setFormFields ] = useState({});

  const { phone } = props;

  const [ deadline, setDeadline ] = useState({
    date: ""
  });

  useEffect(() => {
    setDeadline({
      date: Date.now() + 1000 * 30 * 6
    });
  }, []);

  useEffect(() => {
    if ($confirmActivationCode.success) {
      if ($checkLogin.data.customer) {
        openNotificationWithIcon("success", "Код подтвержден");
        events.resetRegistrationStoreEvent();
        events.resetlogInEvent();
        history.push('/sign-in');
      } else {
        openNotificationWithIcon("success", "Код подтвержден");
        events.resetCheckLoginEffectEvent();
        events.resetConfirmActivationCodeEvent();
        events.updateRegistrationStepEvent({
          step: 3
        });
      }
    }
  }, [$confirmActivationCode.success]);


  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };


  const onSubmit = () => {
    effects.confirmActivationCodeEffect({
      phone,
      activationCode: formFields.activationCode
    });
  };

  return (
    <Form onFinish={onSubmit}>
      <div className="auth-wrapper__form_logo">
        <img src={logo} alt="logo"/>
        <span>Код подтверждения</span>
        <Countdown value={deadline.date} format="mm:ss" />
      </div>
      {($checkLogin.data && $checkLogin.data.customer) &&
        <Alert
          className="m-b-10"
          message='Данный пользователь уже зарегистрирован в среде SmartPOS. Для активации аккаунта Поставщик введите полученный код активации и нажмите на кнопку "Продолжить". После активации вы можете использовать ранее введенный пароль в среде SmartPOS.'
          type="warning"
        />
      }
      <FormState error={$confirmActivationCode.error} loading={$confirmActivationCode.loading} />
      <FormField className="m-b-25">
        <Input
          className="auth-input"
          placeholder="Введите код"
          disabled={$confirmActivationCode.loading}
          onChange={(activationCode) => onFormFieldChange("activationCode", activationCode.target.value)}
        />
      </FormField>
      <Button
        htmlType="submit"
        disabled={!formFields.activationCode}
        className="custom-button success-button large fullwidth b-r-30"
      >
        ПРОДОЛЖИТЬ
      </Button>
    </Form>
  );
};