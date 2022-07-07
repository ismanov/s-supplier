import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Alert, Form, Input, Modal, Spin, Button } from "antd";

import effector from "../effector";

import { CloseModalSvg } from "svgIcons/svg-icons";
import { FormField } from "ui/molecules/form-field";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { isValidPassword } from "helpers/password-validation";

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

export const EditUserEmployeePasswordModal = (props) => {
  const { $updateUserEmployee } = useStore(store);

  const { modalProps, setModalProps } = props;

  const { employee: employeeProps } = modalProps;

  const [ formFields, setFormFields ] = useState({
    id: employeeProps.id,
    login: employeeProps.login,
    roles: employeeProps.roles.map((role) => role.code)
  });
  const [ fieldsErrors, setFieldsErrors ] = useState({});
  const [ passwordWarning, setPasswordWarning ] = useState("");
  const [ confirmPasswordWarning, setConfirmPasswordWarning ] = useState("");

  useEffect(() => {
    if ($updateUserEmployee.success) {
      openNotificationWithIcon('success', 'Пароль обновлен');
      closeModal();
    }
  }, [$updateUserEmployee.success]);


  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const onPasswordChange = (prop, val) => {
    if (fieldsErrors[prop]) {
      setFieldsErrors({
        ...fieldsErrors,
        password: ""
      })
    }

    if (isValidPassword(val)) {
      setPasswordWarning("");
    } else if (val.length > 16) {
      setPasswordWarning('Максимальное количество символов 16');
    } else {
      setPasswordWarning('Пароль должен состоять минимум из 8 символов, включая в себя цифры, строчная и заглавная буквы');
    }

    onFormFieldChange(prop, val);
  };

  const onConfirmPasswordChange = (prop, val) => {
    if (fieldsErrors[prop]) {
      setFieldsErrors({
        ...fieldsErrors,
        confirmPassword: ""
      })
    }

    if (formFields.password !== val) {
      setConfirmPasswordWarning("Пароли не совпадают");
    } else {
      setConfirmPasswordWarning("");
    }

    onFormFieldChange(prop, val);
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetUpdateUserEmployeeEvent();
    setModalProps({ ...modalProps, shouldRender: false, employee: null });
  };

  const validateForm = () => {
    setPasswordWarning("");
    setConfirmPasswordWarning("");

    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (formFields.password) {
      if (formFields.password.length > 16 ) {
        errors.password = "Максимальное количество символов 16";
      } else {
        if (!isValidPassword(formFields.password)) {
          errors.password = 'Пароль должен состоять минимум из 8 символов, включая в себя цифры, строчная и заглавная буквы';
        }
      }
    } else {
      errors.password = notFilledMessage;
    }

    if (formFields.confirmPassword) {
      if (formFields.password !== formFields.confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают';
      }
    } else {
      errors.confirmPassword = notFilledMessage
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

    const data = {
      id: formFields.id,
      password: formFields.password
    };

    effects.updateUserEmployeeEffect(data);
  };

  return (
    <Modal
      className="custom-modal"
      title="Редактировать пароль пользователя"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState error={$updateUserEmployee.error} loading={$updateUserEmployee.loading} />
      <Form onFinish={onSubmit}>
        <div className="form-field m-b-20">
          <div className="form-field__title">
            Логин: {formFields.login}
          </div>
        </div>
        <FormField className="m-b-25" title="Пароль" note={passwordWarning} error={fieldsErrors.password}>
          <Input.Password
            autoComplete="new-password"
            className="auth-input"
            placeholder="Введите пароль"
            onChange={(password) => onPasswordChange("password", password.target.value)}
          />
        </FormField>
        <FormField className="m-b-25" title="Подтверждение пароля" note={confirmPasswordWarning} error={fieldsErrors.confirmPassword}>
          <Input.Password
            className="auth-input"
            placeholder="Введите пароль"
            onChange={(confirmPassword) => onConfirmPasswordChange("confirmPassword", confirmPassword.target.value)}
          />
        </FormField>
        <div className="custom-modal__button-row">
          <Button htmlType="submit" className="custom-button primary-button fullwidth">Сохранить</Button>
        </div>
      </Form>
    </Modal>
  )
};