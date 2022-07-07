import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Alert, Button, Form, Input, Spin } from "antd";

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

export const ResetPasswordStep2 = (props) => {
  const { $resetPasswordCheck, $resetPasswordResendSmsCode } = useStore(store);

  const [ formFields, setFormFields ] = useState({
    activationCode: ""
  });

  const { phone } = props;

  useEffect(() => {
    if ($resetPasswordCheck.success) {
      openNotificationWithIcon("success", "Код подтвержден");
      events.resetPasswordCheckEvent();
      events.updatePasswordStepEvent({
        step: 3
      });
    }
  }, [$resetPasswordCheck.success]);


  const onKeyChange = (e) => {
    const val = e.target.value;

    if (val.length < 7) {
      setFormFields({
        ...formFields,
        activationCode: val
      });
    }
  };

  const onSubmit = () => {
    effects.resetPasswordCheckEffect({
      phone,
      activationCode: formFields.activationCode
    });
  };

  return (
    <Form onFinish={onSubmit}>
      <div className="auth-wrapper__form_logo">
        <img src={logo} alt="logo"/>
        <span>Код подтверждения</span>
      </div>
      <FormState error={$resetPasswordCheck.error} loading={$resetPasswordCheck.loading} />
      <FormState error={$resetPasswordResendSmsCode.error} loading={$resetPasswordResendSmsCode.loading} />
      <div className='m-b-10'>
        <FormField>
          <Input
            className="custom-input"
            placeholder="Введите код"
            value={formFields.activationCode ? formFields.activationCode: ""}
            onChange={onKeyChange}
          />
        </FormField>
      </div>
      <Button
        disabled={formFields.activationCode.length !== 6}
        className="custom-button success-button fullwidth large b-r-30"
        htmlType="submit"
      >
        ПРОДОЛЖИТЬ
      </Button>
    </Form>
  )
};