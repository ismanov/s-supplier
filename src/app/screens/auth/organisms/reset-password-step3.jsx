import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { useHistory } from 'react-router-dom';
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

export const ResetPasswordStep3 = (props) => {
  const history = useHistory();

  const { $resetPasswordFinish } = useStore(store);

  const [ formFields, setFormFields ] = useState({});
  const [ fieldsErrors, setFieldsErrors ] = useState({});

  const { phone } = props;

  useEffect(() => {
    if ($resetPasswordFinish.success) {
      openNotificationWithIcon("success", "Новый пароль установлен");
      events.resetPasswordFinishEvent();
      events.resetUpdatePasswordStepEvent();
      events.resetlogInEvent();

      history.push('/sign-in');
    }
  }, [$resetPasswordFinish.success]);

  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";
    const notEqualMessage = "Пароли не совпадают";

    const errors = {};

    if (!formFields.password) errors.password = notFilledMessage;
    if (!formFields.confirmPassword) errors.confirmPassword = notFilledMessage;

    if (formFields.password && formFields.confirmPassword && formFields.password !== formFields.confirmPassword) {
      errors.password = notEqualMessage;
      errors.confirmPassword = notEqualMessage;
    }

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    effects.resetPasswordFinishEffect({
      phone,
      password: formFields.password,
      confirmPassword: formFields.confirmPassword
    });
  };

  return (
    <>
      <Form onFinish={onSubmit}>
        <div className="auth-wrapper__form_logo">
          <img src={logo} alt="logo"/>
          <span>Придумайте новый пароль</span>
        </div>
        <FormState error={$resetPasswordFinish.error} loading={$resetPasswordFinish.loading} />
        <div className='m-b-25'>
          <FormField error={fieldsErrors.password}>
            <Input.Password
              className="auth-input"
              placeholder="Введите пароль"
              value={formFields.password ? formFields.password: ""}
              onChange={(password) => onFormFieldChange("password", password.target.value)}
            />
          </FormField>
          <FormField error={fieldsErrors.confirmPassword}>
            <Input.Password
              className="auth-input"
              placeholder="Введите пароль"
              value={formFields.confirmPassword ? formFields.confirmPassword: ""}
              onChange={(confirmPassword) => onFormFieldChange("confirmPassword", confirmPassword.target.value)}
            />
          </FormField>
        </div>
        <Button className="custom-button success-button fullwidth large b-r-30" htmlType="submit">
          СОХРАНИТЬ
        </Button>
      </Form>
    </>
  )
};